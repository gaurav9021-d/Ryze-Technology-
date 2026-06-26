/**
 * Owns the smooth-scroll engine and its wiring to GSAP.
 *
 * This is the single most fragile integration in the app, so it lives in one
 * provider to avoid the classic "two scroll engines fighting" and "double RAF"
 * bugs. The contract:
 *
 *  - **One RAF.** `gsap.ticker` is the only animation loop; Lenis is advanced
 *    from it (`gsap.ticker.add(t => lenis.raf(t * 1000))`). No other code calls
 *    `requestAnimationFrame` for scroll (Requirements 20.1, 20.2).
 *  - **ScrollTrigger follows Lenis.** `lenis.on('scroll', ScrollTrigger.update)`
 *    plus `ScrollTrigger.scrollerProxy` make ScrollTrigger read its scroll
 *    position from Lenis instead of the native scroller (Requirement 20.2).
 *  - **Reduced motion = no Lenis.** Under `prefers-reduced-motion` the engine is
 *    never instantiated; the page uses native scrolling (Requirement 37.3).
 *  - **Resilient init.** If Lenis throws while initializing, we swallow the
 *    error, tear down anything partially built, and fall back to native scroll
 *    with ScrollTrigger on its default scroller (Requirement 42.5).
 *  - **Cleanup is mandatory.** On unmount we remove the ticker callback, detach
 *    the scroll listener, kill every ScrollTrigger, and destroy Lenis.
 *
 * SSR / jsdom safe: nothing touches `window`/`document` until the mount effect
 * runs, and the effect bails early when those globals are absent.
 */
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis, { type LenisOptions } from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@hooks/useReducedMotion';

/** Options accepted by the imperative `scrollTo` helper exposed on context. */
export interface ScrollToOptions {
  /** Pixel offset applied to the resolved target position. */
  offset?: number;
  /** Duration of the scroll animation, in seconds. */
  duration?: number;
  /** Jump instantly to the target instead of animating. */
  immediate?: boolean;
}

/** Shape of the value provided by {@link SmoothScrollProvider}. */
export interface SmoothScrollContextValue {
  /** The live Lenis instance, or `null` under reduced motion / native fallback. */
  lenis: Lenis | null;
  /** Scroll to a target (pixel offset, selector, or element). */
  scrollTo: (
    target: number | string | HTMLElement,
    opts?: ScrollToOptions,
  ) => void;
  /** Pause smooth scrolling (no-op under native fallback). */
  stop: () => void;
  /** Resume smooth scrolling (no-op under native fallback). */
  start: () => void;
}

/**
 * Context for the smooth-scroll controls. `null` is the "no provider mounted"
 * sentinel so {@link useLenis} can throw a helpful error.
 */
export const SmoothScrollContext =
  createContext<SmoothScrollContextValue | null>(null);
SmoothScrollContext.displayName = 'SmoothScrollContext';

export interface SmoothScrollProviderProps {
  children: ReactNode;
  /** Optional Lenis overrides merged over the defaults. */
  options?: Partial<LenisOptions>;
}

/**
 * Resolve a `scrollTo` target to a vertical pixel position using the native
 * scroller. Used only when Lenis is absent (reduced motion or init failure).
 */
function nativeScrollTo(
  target: number | string | HTMLElement,
  opts?: ScrollToOptions,
): void {
  if (typeof window === 'undefined') return;

  const offset = opts?.offset ?? 0;
  const behavior: ScrollBehavior = opts?.immediate ? 'auto' : 'smooth';

  let top: number;
  if (typeof target === 'number') {
    top = target;
  } else {
    const element =
      typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    top = rect.top + window.scrollY;
  }

  window.scrollTo({ top: top + offset, behavior });
}

export function SmoothScrollProvider({
  children,
  options,
}: SmoothScrollProviderProps): JSX.Element {
  const reducedMotion = useReducedMotion();

  // `lenisRef` is the source of truth read by the stable callbacks; the state
  // mirror exists purely to re-render consumers when the instance appears/clears.
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  // Keep the latest options without making them an effect dependency — that
  // would re-instantiate Lenis on every render (object identity changes).
  const optionsRef = useRef<Partial<LenisOptions> | undefined>(options);
  optionsRef.current = options;

  const scrollTo = useCallback<SmoothScrollContextValue['scrollTo']>(
    (target, opts) => {
      const lenis = lenisRef.current;
      if (lenis) {
        // Only forward keys that were actually provided — `exactOptionalPropertyTypes`
        // rejects explicit `undefined` on Lenis's optional fields.
        const lenisOpts: {
          offset?: number;
          duration?: number;
          immediate?: boolean;
        } = {};
        if (opts?.offset !== undefined) lenisOpts.offset = opts.offset;
        if (opts?.duration !== undefined) lenisOpts.duration = opts.duration;
        if (opts?.immediate !== undefined) lenisOpts.immediate = opts.immediate;
        lenis.scrollTo(target, lenisOpts);
        return;
      }
      nativeScrollTo(target, opts);
    },
    [],
  );

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  useEffect(() => {
    // Reduced motion or SSR/jsdom → never instantiate Lenis; native scroll.
    if (reducedMotion) return undefined;
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;
    let detachScroll: (() => void) | null = null;

    try {
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ autoRaf: false, ...optionsRef.current });
      lenisRef.current = lenis;
      setLenisInstance(lenis);

      // ScrollTrigger updates on every Lenis scroll event.
      detachScroll = lenis.on('scroll', ScrollTrigger.update);

      // Single RAF source: drive Lenis from the GSAP ticker (ms → Lenis wants ms).
      const instance = lenis;
      tickerCallback = (time: number) => {
        instance.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      // Disable lag smoothing so Lenis stays in lockstep with the ticker clock.
      gsap.ticker.lagSmoothing(0);

      // Make ScrollTrigger read scroll position from Lenis instead of native.
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length && typeof value === 'number') {
            instance.scrollTo(value, { immediate: true });
          }
          return instance.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });
      ScrollTrigger.refresh();
    } catch (error) {
      // Requirement 42.5: Lenis init failed — tear down partial state and fall
      // back to native scrolling. The site stays fully functional.
      if (detachScroll) {
        try {
          detachScroll();
        } catch {
          /* ignore */
        }
      }
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenis) {
        try {
          lenis.destroy();
        } catch {
          /* ignore */
        }
      }
      lenisRef.current = null;
      setLenisInstance(null);
      if (import.meta.env.DEV) {
        console.error(
          '[SmoothScrollProvider] Lenis init failed; using native scroll.',
          error,
        );
      }
      return undefined;
    }

    return () => {
      if (detachScroll) detachScroll();
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis?.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [reducedMotion]);

  const value = useMemo<SmoothScrollContextValue>(
    () => ({ lenis: lenisInstance, scrollTo, stop, start }),
    [lenisInstance, scrollTo, stop, start],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
