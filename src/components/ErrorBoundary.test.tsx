/**
 * Unit tests for ErrorBoundary (task 7.6).
 *
 * Covers the two behaviors the design's Error Handling section requires:
 *  - a child that throws on render is caught and the fallback is shown
 *    (Requirement 42.1 — one failure does not blank the app);
 *  - the retry control clears the boundary, and a subsequently non-throwing
 *    child renders normally (Requirement 42.2 — retry re-renders / re-imports
 *    the failed subtree).
 */
import { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary, RouteErrorBoundary } from './ErrorBoundary';

/** A child that throws during render to simulate a chunk/render failure. */
function Boom({ message = 'kaboom' }: { message?: string }): never {
  throw new Error(message);
}

/**
 * Wrapper that throws on first render, then renders healthy content once a
 * flag flips. The retry button below toggles the flag, modeling "the lazy
 * import succeeds on re-attempt".
 */
function Recoverable(): React.ReactElement {
  const [healthy, setHealthy] = useState(false);
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div role="alert">
          <p>{error.message}</p>
          <button
            type="button"
            onClick={() => {
              setHealthy(true);
              reset();
            }}
          >
            Try again
          </button>
        </div>
      )}
    >
      {healthy ? <p>recovered content</p> : <Boom message="initial failure" />}
    </ErrorBoundary>
  );
}

describe('ErrorBoundary', () => {
  // React logs caught errors to console.error; silence it for clean output.
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children unchanged when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>healthy</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('healthy')).toBeInTheDocument();
  });

  it('renders the default branded fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom message="render exploded" />
      </ErrorBoundary>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('render exploded')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('uses a custom fallback render prop when provided', () => {
    render(
      <ErrorBoundary fallback={(error) => <div role="alert">custom: {error.message}</div>}>
        <Boom message="oops" />
      </ErrorBoundary>,
    );
    expect(screen.getByText('custom: oops')).toBeInTheDocument();
  });

  it('recovers when retry is clicked and the child no longer throws', async () => {
    const user = userEvent.setup();
    render(<Recoverable />);

    // Initially the fallback is shown.
    expect(screen.getByText('initial failure')).toBeInTheDocument();

    // Click retry: flips the child to healthy and resets the boundary.
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText('recovered content')).toBeInTheDocument();
    expect(screen.queryByText('initial failure')).not.toBeInTheDocument();
  });

  it('exposes RouteErrorBoundary as the same boundary component', () => {
    expect(RouteErrorBoundary).toBe(ErrorBoundary);
  });
});
