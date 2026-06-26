/**
 * Observe whether an element has entered the viewport using
 * `IntersectionObserver`, returning a ref to attach and the current `inView`
 * flag. This is the shared trigger for scroll-driven reveals and counters
 * (Requirements 21.1, 25.1).
 *
 * Behavior:
 *  - `once` (default `true`): once the element first intersects, the observer
 *    disconnects and `inView` stays `true` — reveals do not re-hide on scroll.
 *    With `once: false` the flag tracks intersection in both directions.
 *  - Graceful degradation: when `IntersectionObserver` is unavailable (older
 *    browsers, SSR, or test environments without the API), `inView` defaults to
 *    `true` so content is shown rather than trapped in a hidden start state.
 *
 * _Requirements: 21.1, 25.1_
 */
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/** Options controlling intersection sensitivity and one-shot behavior. */
export interface UseInViewOptions {
  /** Fraction of the target that must be visible to count as intersecting. */
  threshold?: number;
  /** Margin around the root, expressed like a CSS margin string. */
  rootMargin?: string;
  /**
   * When `true` (default), stop observing after the first intersection and
   * latch `inView` to `true`.
   */
  once?: boolean;
}

/** Result of {@link useInView}: the ref to attach and the visibility flag. */
export interface UseInViewResult<T extends Element> {
  ref: RefObject<T>;
  inView: boolean;
}

/** True when the `IntersectionObserver` API is available in this environment. */
function hasIntersectionObserver(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.IntersectionObserver !== 'undefined'
  );
}

/**
 * Track whether the referenced element is within the viewport.
 *
 * @typeParam T - The element type the returned ref will be attached to.
 * @param options - Threshold, root margin, and one-shot configuration.
 * @returns `{ ref, inView }` — attach `ref` to the target element.
 */
export function useInView<T extends Element>(
  options: UseInViewOptions = {},
): UseInViewResult<T> {
  const { threshold, rootMargin, once = true } = options;
  const ref = useRef<T>(null);

  // No observer support → show content by default (safe, non-hiding fallback).
  const [inView, setInView] = useState<boolean>(() => !hasIntersectionObserver());

  useEffect(() => {
    const element = ref.current;

    if (element === null || !hasIntersectionObserver()) {
      return;
    }

    const observerOptions: IntersectionObserverInit = {};
    if (threshold !== undefined) {
      observerOptions.threshold = threshold;
    }
    if (rootMargin !== undefined) {
      observerOptions.rootMargin = rootMargin;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry === undefined) {
          return;
        }

        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setInView(false);
        }
      },
      observerOptions,
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
