/**
 * Access the live `prefers-reduced-motion` preference from context.
 *
 * Must be used within a `<ReducedMotionProvider>` (Requirement 37.1). Throws a
 * descriptive error otherwise so misuse fails loudly during development rather
 * than silently defaulting to motion-on.
 */
import { useContext } from 'react';
import { ReducedMotionContext } from '@providers/ReducedMotionProvider';

export function useReducedMotion(): boolean {
  const value = useContext(ReducedMotionContext);

  if (value === null) {
    throw new Error(
      'useReducedMotion must be used within a <ReducedMotionProvider>.',
    );
  }

  return value;
}
