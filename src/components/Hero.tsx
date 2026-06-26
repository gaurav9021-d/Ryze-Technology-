/**
 * Hero — capability-gated homepage hero (task 11.2).
 *
 * The Hero is the single decision point that chooses between the heavy animated
 * WebGL scene and the static fallback, following the "WebGL Capability Gating"
 * flow in design.md:
 *
 *   1. ALWAYS render {@link HeroFallback} first, before any WebGL is ready
 *      (Requirement 19.1). It is the persistent background layer and the poster
 *      the animated scene cross-fades in over.
 *   2. IF reduced motion is active → render ONLY the fallback and NEVER mount a
 *      WebGL canvas (Requirement 19.2).
 *   3. IF a WebGL2 context is unavailable or the capability gate fails (too few
 *      cores, too little memory, save-data) → render ONLY the fallback
 *      (Requirements 19.3, 19.4). Both are decided by `canRenderWebGL()`.
 *   4. WHEN motion is allowed, WebGL2 is available, the gate passes, AND the
 *      hero is scrolled into view → lazily import {@link HeroWebGL} via
 *      `React.lazy` + `<Suspense>` behind an IntersectionObserver and mount it
 *      behind the fallback (Requirement 19.5).
 *   5. WHEN the scene becomes ready → cross-fade from the fallback to the
 *      animated scene (Requirement 19.6).
 *
 * Chunking discipline: `three` / `@react-three/fiber` MUST NOT be imported by
 * this module or {@link HeroFallback}; they live only in the lazily-imported
 * {@link HeroWebGL} chunk (task 11.3) so the entry bundle stays clean.
 *
 * The headline/eyebrow/subheadline/CTA content is composed on top of whichever
 * background layer is active.
 *
 * _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_
 */
import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type CSSProperties,
} from 'react';

import { useReducedMotion } from '@hooks/useReducedMotion';
import { useInView } from '@hooks/useInView';
import { canRenderWebGL } from '@lib/canRenderWebGL';

import { HeroFallback } from './HeroFallback';
import { MagneticButton } from './MagneticButton';
import { ScrollIndicator } from './ScrollIndicator';
import { SplitText } from './SplitText';

/**
 * Lazily-imported animated scene. Declared at module scope so the chunk is only
 * fetched the first time the component is actually rendered — never in the
 * entry bundle (Requirement 19.5). Task 11.3 fills in the real R3F scene.
 */
const HeroWebGL = lazy(() => import('./HeroWebGL'));

export interface HeroProps {
  /** Oversized hero headline (revealed via SplitText). */
  headline: string;
  /** Optional mono eyebrow line above the headline. */
  eyebrow?: string;
}

const SUBHEADLINE =
  'We design and build durable digital products — websites, mobile apps, ' +
  'and business systems engineered to work forever.';

/**
 * Notifies the parent once the lazily-loaded scene has actually mounted, which
 * is the signal to begin the cross-fade (Requirement 19.6). Rendering this as a
 * child of `<Suspense>` means its mount effect only runs after the lazy chunk
 * resolved and committed.
 */
function HeroWebGLLayer({
  paused,
  onReady,
}: {
  paused: boolean;
  onReady: () => void;
}): JSX.Element {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return <HeroWebGL paused={paused} />;
}

export function Hero({ headline, eyebrow }: HeroProps): JSX.Element {
  const reducedMotion = useReducedMotion();

  // Watch the hero so the WebGL chunk is only requested once it scrolls in.
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  });

  // The capability gate touches the DOM (probes a WebGL2 context), so decide it
  // once on the client after mount rather than during render. Starts `false`
  // so the server/first paint always shows the fallback (Requirement 19.1).
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    // Reduced motion never probes WebGL at all (Requirement 19.2).
    if (reducedMotion) {
      setCapable(false);
      return;
    }
    setCapable(canRenderWebGL());
  }, [reducedMotion]);

  // Tracks when the animated scene has mounted, to drive the cross-fade.
  const [webglReady, setWebglReady] = useState(false);

  // Final gate: motion allowed + capable + in view (Requirements 19.2–19.5).
  const shouldMountWebGL = !reducedMotion && capable && inView;

  // Cross-fade: the fallback fades out only once the scene is ready; the scene
  // fades in as it becomes ready (Requirement 19.6).
  const fallbackLayerStyle: CSSProperties = {
    transition: reducedMotion ? undefined : 'opacity 800ms ease',
    opacity: webglReady ? 0 : 1,
  };
  const webglLayerStyle: CSSProperties = {
    transition: 'opacity 800ms ease',
    opacity: webglReady ? 1 : 0,
  };

  return (
    <section
      className="relative flex min-h-[90vh] w-full items-center overflow-hidden bg-ink-900"
      aria-label="Intro"
    >
      {/* Background layers live inside the observed ref. */}
      <div ref={ref} className="absolute inset-0">
        {/* (1) Always-present static fallback (Requirement 19.1). */}
        <div className="absolute inset-0" style={fallbackLayerStyle}>
          <HeroFallback />
        </div>

        {/* (4/5) Animated scene — only mounted when fully gated on. */}
        {shouldMountWebGL ? (
          <div className="absolute inset-0" style={webglLayerStyle}>
            <Suspense fallback={null}>
              <HeroWebGLLayer
                paused={!inView}
                onReady={() => setWebglReady(true)}
              />
            </Suspense>
          </div>
        ) : null}
      </div>

      {/* Composed hero content on top of whichever background is active. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 sm:px-8">
        {eyebrow !== undefined && eyebrow.length > 0 ? (
          <p className="mb-6 font-mono text-sm uppercase tracking-[0.2em] text-pulse-500">
            {eyebrow}
          </p>
        ) : null}

        <SplitText
          as="h1"
          by="word"
          text={headline}
          trigger="mount"
          className="max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-mist-100 sm:text-6xl md:text-7xl lg:text-8xl"
        />

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist-300 md:text-xl">
          {SUBHEADLINE}
        </p>

        <div className="mt-10">
          <MagneticButton as="a" href="/contact" ariaLabel="Start a project">
            Start a project
          </MagneticButton>
        </div>
      </div>

      {/* Scroll affordance pinned to the bottom of the hero. */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}

export default Hero;
