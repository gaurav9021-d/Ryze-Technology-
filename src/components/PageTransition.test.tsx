/**
 * Unit tests for PageTransition (task 7.8).
 *
 * Verifies the route-change contract that is independent of the actual
 * animation frames:
 *  - changing `routeKey` scrolls the window to the top (Requirements 26.2, 20.3);
 *  - focus moves to the new page's `tabIndex={-1}` main wrapper (Requirement 38.3);
 *  - the `aria-live` Route_Announcer updates with the new page (Requirement 38.3);
 *  - under reduced motion the new page renders immediately (Requirement 37.4).
 *
 * PageTransition reads the motion preference via `useReducedMotion`, so every
 * render is wrapped in a `ReducedMotionProvider` with a mocked `matchMedia`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ReducedMotionProvider } from '@providers/ReducedMotionProvider';
import { mockReducedMotion, resetMatchMedia } from '@/test/matchMedia';
import { PageTransition } from './PageTransition';

function renderTransition(routeKey: string, label: string) {
  return render(
    <ReducedMotionProvider>
      <PageTransition routeKey={routeKey}>
        <main>
          <h1>{label}</h1>
        </main>
      </PageTransition>
    </ReducedMotionProvider>,
  );
}

let scrollSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  scrollSpy = vi.fn();
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    configurable: true,
    value: scrollSpy,
  });
});

afterEach(() => {
  resetMatchMedia();
  vi.restoreAllMocks();
});

describe('PageTransition', () => {
  it('scrolls to the top of the new page on the initial mount', () => {
    mockReducedMotion(false);
    renderTransition('/services', 'Services');

    expect(scrollSpy).toHaveBeenCalledWith(0, 0);
  });

  it('scrolls to the top again when the route changes', async () => {
    mockReducedMotion(false);
    const { rerender } = renderTransition('/services', 'Services');
    scrollSpy.mockClear();

    rerender(
      <ReducedMotionProvider>
        <PageTransition routeKey="/about">
          <main>
            <h1>About</h1>
          </main>
        </PageTransition>
      </ReducedMotionProvider>,
    );

    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalledWith(0, 0);
    });
  });

  it('moves focus to the new page main wrapper', async () => {
    mockReducedMotion(false);
    renderTransition('/services', 'Services');

    await waitFor(() => {
      const active = document.activeElement as HTMLElement | null;
      expect(active).not.toBeNull();
      expect(active?.getAttribute('data-page-wrapper')).toBe('');
    });
    // The focused wrapper contains the current page's heading.
    expect(document.activeElement).toContainElement(
      screen.getByRole('heading', { name: 'Services' }),
    );
  });

  it('updates the aria-live Route_Announcer with the new page', async () => {
    mockReducedMotion(false);
    const { rerender } = renderTransition('/services', 'Services');

    const announcer = screen.getByTestId('route-announcer');
    expect(announcer).toHaveAttribute('aria-live', 'polite');
    await waitFor(() => {
      expect(announcer).toHaveTextContent('Navigated to services');
    });

    rerender(
      <ReducedMotionProvider>
        <PageTransition routeKey="/about">
          <main>
            <h1>About</h1>
          </main>
        </PageTransition>
      </ReducedMotionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('route-announcer')).toHaveTextContent(
        'Navigated to about',
      );
    });
  });

  it('announces the home route with a meaningful label', async () => {
    mockReducedMotion(false);
    renderTransition('/', 'Home');

    await waitFor(() => {
      expect(screen.getByTestId('route-announcer')).toHaveTextContent(
        'Navigated to Home',
      );
    });
  });

  it('renders children immediately under reduced motion', () => {
    mockReducedMotion(true);
    renderTransition('/services', 'Services');

    // No waitFor: the page content must be present synchronously.
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument();
    expect(scrollSpy).toHaveBeenCalledWith(0, 0);
  });
});
