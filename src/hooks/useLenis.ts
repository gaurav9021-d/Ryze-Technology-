/**
 * Access the smooth-scroll controls from context.
 *
 * Returns the live Lenis instance (or `null` under reduced motion / native
 * fallback) plus imperative helpers: `scrollTo`, `stop`, `start`. Must be used
 * within a `<SmoothScrollProvider>` — throws a descriptive error otherwise so
 * misuse fails loudly during development.
 *
 * `useSmoothScroll` is a clearer-named alias of the same hook.
 */
import { useContext } from 'react';
import {
  SmoothScrollContext,
  type SmoothScrollContextValue,
} from '@providers/SmoothScrollProvider';

export function useLenis(): SmoothScrollContextValue {
  const value = useContext(SmoothScrollContext);

  if (value === null) {
    throw new Error(
      'useLenis must be used within a <SmoothScrollProvider>.',
    );
  }

  return value;
}

/** Alias of {@link useLenis} with a name that reads well at call sites. */
export const useSmoothScroll = useLenis;
