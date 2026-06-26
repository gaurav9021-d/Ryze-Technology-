/**
 * ErrorBoundary — task 7.6.
 *
 * A class-based React error boundary (the only way to catch render-phase
 * errors in React 18) used in two places per the design's Error Handling
 * section:
 *
 *   1. A top-level boundary wraps the Router so a thrown error never blanks
 *      the whole application.
 *   2. A per-route boundary wraps each <Suspense>, so one failed lazy chunk
 *      import only fails that route — the rest of the shell stays interactive.
 *
 * Recovery: the fallback exposes a "Try again" control that calls `reset()`,
 * which clears the captured error and re-renders the subtree. For a chunk-load
 * failure the subtree contains the `React.lazy` import, so re-rendering causes
 * React to re-attempt the dynamic import — no full page reload required. (If
 * the bad chunk is cached, the host can pass a custom `fallback` that calls
 * `window.location.reload()` with a cache-bust; the default keeps it simple.)
 *
 * Accessibility: the default fallback is a `role="alert"` region (announced by
 * assistive tech) and the retry control is a real, focusable <button> that
 * inherits the never-removed `:focus-visible` pulse ring from index.css.
 *
 * Requirements: 42.1 (boundary wraps Router + per-route Suspense), 42.2 (lazy
 * chunk import failure renders an error state with a retry control that
 * re-imports the chunk).
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';

/** Render-prop signature for a caller-supplied fallback. */
export type ErrorFallbackRender = (error: Error, reset: () => void) => ReactNode;

export interface ErrorBoundaryProps {
  /** The subtree this boundary guards. */
  children: ReactNode;
  /**
   * Optional custom fallback. Receives the captured error and a `reset`
   * callback that clears the boundary so the subtree re-renders. When omitted,
   * the branded default fallback is rendered.
   */
  fallback?: ErrorFallbackRender;
  /**
   * Optional hook for logging/telemetry. Invoked with the same arguments React
   * passes to `componentDidCatch`.
   */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  /** Move the boundary into the error state when a child throws on render. */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  /** Side-effect channel: forward to the optional telemetry hook. */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  /**
   * Clear the captured error so the next render attempts the subtree again.
   * Bound as a field so it keeps a stable identity across renders and is safe
   * to pass straight to a fallback's retry button.
   */
  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error !== null) {
      if (fallback) {
        return fallback(error, this.reset);
      }
      return <DefaultErrorFallback error={error} reset={this.reset} />;
    }

    return children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * Branded default fallback — on the "Engineered Permanence" dark-navy (ink)
 * surface with a cyan (pulse) accent. Announced via `role="alert"`.
 */
function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps): ReactNode {
  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-ink-900 px-6 py-12 text-center text-mist-100"
    >
      <p className="font-mono text-mono-eyebrow uppercase tracking-widest text-pulse-500">
        Something broke
      </p>
      <h2 className="max-w-site font-display text-h2 text-mist-100">
        This part of the page failed to load.
      </h2>
      <p className="prose text-body text-mist-300">
        {error.message || 'An unexpected error occurred while rendering this view.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-sm border border-pulse-500 bg-transparent px-6 py-3 font-mono text-mono-eyebrow uppercase tracking-widest text-pulse-500 transition-colors duration-fast ease-out-expo hover:bg-pulse-500 hover:text-ink-900"
      >
        Try again
      </button>
    </div>
  );
}

/**
 * Convenience alias for the per-route boundary that wraps a route's
 * <Suspense>. It is the same component; the distinct name documents intent at
 * the call site and leaves room for route-specific defaults later.
 */
export const RouteErrorBoundary = ErrorBoundary;

export default ErrorBoundary;
