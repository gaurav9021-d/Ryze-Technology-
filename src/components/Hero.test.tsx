/**
 * Unit tests for Hero (task 11.2).
 *
 * Verifies the capability-gating contract from Requirement 19:
 *  - the static HeroFallback is always rendered first (19.1);
 *  - under reduced motion the hero renders only the fallback and NEVER mounts
 *    a WebGL canvas/scene (19.2);
 *  - when the capability gate returns false the hero renders only the fallback
 *    (19.3, 19.4);
 *  - the composed content (eyebrow, headline, CTA) renders in all cases.
 *
 * Hero reads the motion preference via `useReducedMotion`, so renders are
 * wrapped in a `ReducedMotionProvider` with mocked `matchMedia`.
 * `canRenderWebGL` is mocked to drive the gate deterministically, and
 * `IntersectionObserver` is stubbed because jsdom does not implement it
 * (`useInView` falls back to `inView === true` when the API is absent, which is
 * the "in view" condition we want for the mount path).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReducedMotionProvider } from '@providers/ReducedMotionProvider';
import { mockReducedMotion, resetMatchMedia } from '@/test/matchMedia';
import { canRenderWebGL } from '@lib/canRenderWebGL';
import { Hero } from './Hero';

// Mock the capability gate so we can drive the WebGL decision deterministically.
vi.mock('@lib/canRenderWebGL', () => ({
  canRenderWebGL: vi.fn(() => false),
}));

const mockedCanRenderWebGL = vi.mocked(canRenderWebGL);

/** Minimal IntersectionObserver stub — never reports intersection. */
class MockIntersectionObserver {
  constructor(_callback: IntersectionObserverCallback) {}
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  mockedCanRenderWebGL.mockReturnValue(false);
});

afterEach(() => {
  resetMatchMedia();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function renderHero(ui: React.ReactNode) {
  return render(<ReducedMotionProvider>{ui}</ReducedMotionProvider>);
}

describe('Hero', () => {
  it('renders the static HeroFallback (Requirement 19.1)', () => {
    mockReducedMotion(false);
    renderHero(<Hero headline="Build products that work forever" />);

    expect(screen.getByTestId('hero-fallback')).toBeInTheDocument();
  });

  it('renders headline, eyebrow, and CTA content', () => {
    mockReducedMotion(false);
    renderHero(
      <Hero
        headline="Build products that work forever"
        eyebrow="Ryze Technology"
      />,
    );

    // Headline is exposed as a single accessible name via SplitText's aria-label.
    expect(
      screen.getByLabelText('Build products that work forever'),
    ).toBeInTheDocument();
    // Eyebrow text.
    expect(screen.getByText('Ryze Technology')).toBeInTheDocument();
    // Primary CTA.
    expect(
      screen.getByRole('link', { name: 'Start a project' }),
    ).toBeInTheDocument();
  });

  it('renders only the fallback under reduced motion and never mounts WebGL (Requirement 19.2)', () => {
    mockReducedMotion(true);
    // Even if the gate would pass, reduced motion must suppress WebGL.
    mockedCanRenderWebGL.mockReturnValue(true);

    renderHero(<Hero headline="Reduced motion hero" eyebrow="Ryze" />);

    expect(screen.getByTestId('hero-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('hero-webgl')).not.toBeInTheDocument();
    // The capability gate should never even be consulted under reduced motion.
    expect(mockedCanRenderWebGL).not.toHaveBeenCalled();
  });

  it('renders only the fallback when the capability gate fails (Requirements 19.3, 19.4)', () => {
    mockReducedMotion(false);
    mockedCanRenderWebGL.mockReturnValue(false);

    renderHero(<Hero headline="Low capability hero" eyebrow="Ryze" />);

    expect(screen.getByTestId('hero-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('hero-webgl')).not.toBeInTheDocument();
    // Content still renders.
    expect(screen.getByLabelText('Low capability hero')).toBeInTheDocument();
  });
});
