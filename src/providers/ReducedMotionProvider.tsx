/**
 * Single source of truth for the user's motion preference.
 *
 * Reads `matchMedia('(prefers-reduced-motion: reduce)')`, exposes the boolean
 * via React context, and updates reactively when the OS-level preference
 * changes mid-session (Requirement 37.1). All motion code branches on this so
 * the reduced-motion fallbacks stay consistent across the app.
 *
 * SSR / jsdom safe: when `window.matchMedia` is unavailable the value defaults
 * to `false` (motion allowed) and no listeners are registered.
 */
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Context holding the live reduced-motion preference. `null` is the sentinel
 * for "no provider mounted" so `useReducedMotion` can throw a helpful error.
 */
export const ReducedMotionContext = createContext<boolean | null>(null);
ReducedMotionContext.displayName = 'ReducedMotionContext';

/** Read the current preference without subscribing. SSR/jsdom-safe. */
function readReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export interface ReducedMotionProviderProps {
  children: ReactNode;
}

export function ReducedMotionProvider({
  children,
}: ReducedMotionProviderProps): JSX.Element {
  const [reducedMotion, setReducedMotion] = useState<boolean>(readReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    // Sync once on mount in case the preference changed between the initial
    // render and the effect running.
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent): void => {
      setReducedMotion(event.matches);
    };

    // Modern browsers expose addEventListener; older Safari only addListener.
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  );
}
