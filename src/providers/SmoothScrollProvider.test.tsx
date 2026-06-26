/**
 * Unit tests for SmoothScrollProvider + useLenis.
 *
 * Mocking GSAP/Lenis fully in jsdom is brittle, so these tests focus on the
 * reduced-motion contract: Lenis is NEVER instantiated, children still render,
 * and consumers see a `null` instance (native scroll).
 *
 * Validates: Requirements 37.3
 */
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Track Lenis instantiations without pulling the real engine into jsdom.
const { lenisConstructor } = vi.hoisted(() => ({
  lenisConstructor: vi.fn(),
}));

vi.mock('lenis', () => ({
  default: class MockLenis {
    constructor(opts?: unknown) {
      lenisConstructor(opts);
    }
    raf(): void {}
    on(): () => void {
      return () => {};
    }
    off(): void {}
    destroy(): void {}
    scrollTo(): void {}
    stop(): void {}
    start(): void {}
    get scroll(): number {
      return 0;
    }
  },
}));

import { SmoothScrollProvider } from '@providers/SmoothScrollProvider';
import { ReducedMotionProvider } from '@providers/ReducedMotionProvider';
import { useLenis } from '@hooks/useLenis';
import { mockReducedMotion, resetMatchMedia } from '@/test/matchMedia';

function Probe(): JSX.Element {
  const { lenis } = useLenis();
  return <span data-testid="lenis">{lenis ? 'instance' : 'null'}</span>;
}

function renderTree() {
  return render(
    <ReducedMotionProvider>
      <SmoothScrollProvider>
        <Probe />
        <span data-testid="child">child content</span>
      </SmoothScrollProvider>
    </ReducedMotionProvider>,
  );
}

afterEach(() => {
  lenisConstructor.mockClear();
  resetMatchMedia();
});

describe('SmoothScrollProvider / useLenis (reduced motion)', () => {
  it('does NOT instantiate Lenis under prefers-reduced-motion', () => {
    mockReducedMotion(true);
    renderTree();

    expect(lenisConstructor).not.toHaveBeenCalled();
    expect(screen.getByTestId('lenis')).toHaveTextContent('null');
  });

  it('renders children (native scroll) under reduced motion', () => {
    mockReducedMotion(true);
    renderTree();

    expect(screen.getByTestId('child')).toHaveTextContent('child content');
  });

  it('throws a helpful error when useLenis is used outside the provider', () => {
    mockReducedMotion(true);
    expect(() => render(<Probe />)).toThrow(
      /useLenis must be used within a <SmoothScrollProvider>/,
    );
  });
});
