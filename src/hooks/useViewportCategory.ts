/**
 * Track the live viewport width and classify it into a semantic
 * {@link ViewportCategory} via the single-source-of-truth {@link viewportCategory}
 * helper. Components consume this instead of re-deriving breakpoints inline, so
 * responsive layout never flickers at the edges (Requirement 35.1) and the
 * mobile navigation knows when to switch to the hamburger control
 * (Requirement 2.1).
 *
 * Implementation notes:
 *  - SSR-safe: during prerender (`window` undefined) it resolves a stable
 *    default category rather than touching the DOM, so server and first client
 *    render agree until the post-mount measurement runs.
 *  - rAF-batched: rapid `resize` events are coalesced into a single frame so we
 *    classify at most once per paint and never thrash React state.
 *  - State only ever holds the derived category (not the raw width), so a
 *    re-render is triggered only when the bucket actually changes.
 *
 * _Requirements: 35.1, 2.1_
 */
import { useEffect, useState } from 'react';
import { viewportCategory } from '@lib/viewport';
import type { ViewportCategory } from '@app-types';

/**
 * Category assumed when there is no `window` to measure (server prerender or
 * non-DOM environments). `desktop` is the most common viewport for first paint
 * and avoids a hamburger flash on wide screens; the real category is applied
 * synchronously on mount.
 */
const SSR_DEFAULT_CATEGORY: ViewportCategory = 'desktop';

/** Read and classify the current viewport width, guarding against SSR. */
function readCategory(): ViewportCategory {
  if (typeof window === 'undefined') {
    return SSR_DEFAULT_CATEGORY;
  }
  return viewportCategory(window.innerWidth);
}

/**
 * Return the current {@link ViewportCategory}, updating on resize.
 *
 * @returns One of `'mobile' | 'tablet' | 'desktop' | 'wide'`.
 */
export function useViewportCategory(): ViewportCategory {
  const [category, setCategory] = useState<ViewportCategory>(readCategory);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let frame = 0;

    const measure = (): void => {
      frame = 0;
      // Functional update keeps React from re-rendering when the bucket is
      // unchanged (the value is referentially equal).
      setCategory(viewportCategory(window.innerWidth));
    };

    const handleResize = (): void => {
      // Coalesce bursts of resize events into a single measurement per frame.
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(measure);
    };

    // Reconcile against any width change that happened between the initial
    // render and effect commit.
    setCategory(viewportCategory(window.innerWidth));

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return category;
}
