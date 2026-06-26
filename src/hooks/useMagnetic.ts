/**
 * Pointer-follow ("magnetic") transform values for an interactive element.
 *
 * Returns a `ref` to attach plus spring-smoothed `x`/`y` `MotionValue`s the
 * caller binds to a `motion` element's transform. While the pointer moves over
 * the element, the values translate toward the pointer relative to the
 * element's center, scaled by `strength`. On `pointerleave` the values spring
 * back to `0`.
 *
 * Reduced motion (Requirement 23.2): when the visitor prefers reduced motion
 * the hook is a no-op — no pointer listeners are attached and `x`/`y` stay at
 * `0`, so only CSS hover styling applies and no JavaScript transform is made.
 * When motion is allowed it translates toward the pointer scaled by strength
 * (Requirement 23.1).
 *
 * _Requirements: 23.1, 23.2_
 */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';

import { useReducedMotion } from './useReducedMotion';

/** Spring smoothing applied to the magnetic translation. */
const SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.1 } as const;

/** Result of {@link useMagnetic}: ref to attach and spring transform values. */
export interface UseMagneticResult {
  /** Attach to the element that should react to the pointer. */
  ref: RefObject<HTMLElement>;
  /** Spring-smoothed horizontal offset in pixels. */
  x: MotionValue<number>;
  /** Spring-smoothed vertical offset in pixels. */
  y: MotionValue<number>;
}

/**
 * Track the pointer over an element and expose magnetic transform values.
 *
 * @param strength - Fraction of the pointer-to-center distance to translate by
 *   (default `0.35`). Higher values pull the element further toward the pointer.
 * @returns `{ ref, x, y }` — attach `ref`, bind `x`/`y` to a transform.
 */
export function useMagnetic(strength = 0.35): UseMagneticResult {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    const el = ref.current;

    // Reduced motion → no listeners, no transform. Values remain at 0.
    if (el === null || reducedMotion) {
      return;
    }

    const handlePointerMove = (event: PointerEvent): void => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      rawX.set((event.clientX - centerX) * strength);
      rawY.set((event.clientY - centerY) * strength);
    };

    const handlePointerLeave = (): void => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      // Reset so a remount/strength change starts from rest.
      rawX.set(0);
      rawY.set(0);
    };
  }, [reducedMotion, strength, rawX, rawY]);

  return { ref, x, y };
}
