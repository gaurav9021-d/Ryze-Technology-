/**
 * Unit tests for ReducedMotionProvider + useReducedMotion.
 *
 * Validates: Requirements 37.1
 */
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ReducedMotionProvider } from '@providers/ReducedMotionProvider';
import { useReducedMotion } from '@hooks/useReducedMotion';
import { mockReducedMotion, resetMatchMedia } from '@/test/matchMedia';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function Probe(): JSX.Element {
  const reducedMotion = useReducedMotion();
  return <span data-testid="value">{String(reducedMotion)}</span>;
}

function renderProbe() {
  return render(
    <ReducedMotionProvider>
      <Probe />
    </ReducedMotionProvider>,
  );
}

afterEach(() => {
  resetMatchMedia();
});

describe('ReducedMotionProvider / useReducedMotion', () => {
  it('exposes false when the preference is not set', () => {
    mockReducedMotion(false);
    renderProbe();
    expect(screen.getByTestId('value')).toHaveTextContent('false');
  });

  it('exposes true when prefers-reduced-motion is active', () => {
    mockReducedMotion(true);
    renderProbe();
    expect(screen.getByTestId('value')).toHaveTextContent('true');
  });

  it('updates reactively when the preference changes mid-session', () => {
    const registry = mockReducedMotion(false);
    renderProbe();
    expect(screen.getByTestId('value')).toHaveTextContent('false');

    act(() => {
      registry.get(REDUCED_MOTION_QUERY)?.setMatches(true);
    });
    expect(screen.getByTestId('value')).toHaveTextContent('true');

    act(() => {
      registry.get(REDUCED_MOTION_QUERY)?.setMatches(false);
    });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
  });

  it('defaults to false when matchMedia is unavailable (SSR/jsdom)', () => {
    resetMatchMedia();
    renderProbe();
    expect(screen.getByTestId('value')).toHaveTextContent('false');
  });

  it('throws a helpful error when used outside the provider', () => {
    expect(() => render(<Probe />)).toThrow(
      /useReducedMotion must be used within a <ReducedMotionProvider>/,
    );
  });
});
