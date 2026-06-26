/**
 * Tween a numeric value from `from` to `target` with easing, returning the
 * current displayed value each frame. This drives the AnimatedCounter so
 * metrics count up when they scroll into view (Requirements 21.1, 21.2, 21.3).
 *
 * Behavior:
 *  - When `start` is `true` and motion is allowed, the value animates from
 *    `from` (default `0`) to `target` over `duration` ms (default `2000`),
 *    driven by `requestAnimationFrame`. Each frame's value is computed via
 *    `interpolateCounter`, which eases, rounds to `decimals`, and clamps to the
 *    `[from, target]` interval — so the value is never outside that range
 *    (Req 21.3) and lands exactly on `target` (Req 21.2).
 *  - Under reduced motion the value is the rounded `target` immediately, with
 *    no animation (Req 37.2).
 *  - When `start` is `false`, the value holds at the rounded `from` until
 *    `start` becomes `true`.
 *  - The pending animation frame is cancelled on unmount or when an input that
 *    restarts the tween changes.
 *
 * _Requirements: 21.1, 21.2, 21.3, 37.2_
 */
import { useEffect, useRef, useState } from 'react';
import type { EasingFn } from '@app-types';
import { easeOutExpo, interpolateCounter } from '@lib/easing';

import { useReducedMotion } from './useReducedMotion';

/** Options controlling the counter tween. */
export interface UseCounterOptions {
  /** Starting value of the tween. Defaults to `0`. */
  from?: number;
  /** Animation duration in milliseconds. Defaults to `2000`. */
  duration?: number;
  /** Easing applied to progress. Defaults to {@link easeOutExpo}. */
  easing?: EasingFn;
  /** When `true`, run (or hold completed) the animation. Defaults to `true`. */
  start?: boolean;
  /** Decimal places the displayed value is rounded to. Defaults to `0`. */
  decimals?: number;
}

/**
 * Animate a number from `from` to `target` and return the current value.
 *
 * @param target - The value to count toward and land exactly on.
 * @param opts - Tween configuration; see {@link UseCounterOptions}.
 * @returns The current displayed value, rounded to `decimals`.
 */
export function useCounter(target: number, opts: UseCounterOptions = {}): number {
  const {
    from = 0,
    duration = 2000,
    easing = easeOutExpo,
    start = true,
    decimals = 0,
  } = opts;

  const reducedMotion = useReducedMotion();

  // Initial value: target instantly under reduced motion, otherwise `from`.
  const [value, setValue] = useState<number>(() =>
    reducedMotion
      ? interpolateCounter(from, target, 1, easing, decimals)
      : interpolateCounter(from, target, 0, easing, decimals),
  );

  // Keep the latest easing in a ref so it does not need to be a tween dependency
  // (an inline easing would otherwise restart the animation every render).
  const easingRef = useRef<EasingFn>(easing);
  easingRef.current = easing;

  useEffect(() => {
    // Reduced motion: jump straight to the target end state (Req 37.2).
    if (reducedMotion) {
      setValue(interpolateCounter(from, target, 1, easingRef.current, decimals));
      return undefined;
    }

    // Not started yet: hold at the start value (Req 21.x — animate on trigger).
    if (!start) {
      setValue(interpolateCounter(from, target, 0, easingRef.current, decimals));
      return undefined;
    }

    // Degenerate / non-animatable duration: land on target immediately.
    if (duration <= 0) {
      setValue(interpolateCounter(from, target, 1, easingRef.current, decimals));
      return undefined;
    }

    let frameId = 0;
    let startTime: number | null = null;

    const tick = (now: number): void => {
      if (startTime === null) {
        startTime = now;
      }
      const elapsed = now - startTime;
      const progress = elapsed / duration;

      // interpolateCounter eases, rounds, and clamps to [from, target], so the
      // value is always within range (Req 21.3) and exact at progress >= 1.
      setValue(
        interpolateCounter(from, target, progress, easingRef.current, decimals),
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [target, from, duration, decimals, start, reducedMotion]);

  return value;
}
