/**
 * Unit + a11y tests for NotFoundPage (task 14.23).
 *
 * NotFoundPage composes react-router `Link`s, a `MagneticButton`, and SEOHead,
 * so renders are wrapped in `MemoryRouter` (Links), `ReducedMotionProvider`
 * (motion prefs read by MagneticButton), and `HelmetProvider` (SEOHead).
 * `matchMedia` is stubbed because jsdom does not implement it.
 *
 * Requirements: 18.1 (custom 404), 18.2 (quick links + home/back action),
 * 18.3 / 40.5 (noIndex metadata emitted as robots noindex).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { axe } from 'jest-axe';
import { ReducedMotionProvider } from '@providers/ReducedMotionProvider';
import { mockReducedMotion, resetMatchMedia } from '@/test/matchMedia';

import { NotFoundPage } from './NotFoundPage';

beforeEach(() => {
  mockReducedMotion(false);
});

afterEach(() => {
  resetMatchMedia();
  vi.restoreAllMocks();
});

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ReducedMotionProvider>
          <NotFoundPage />
        </ReducedMotionProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe('NotFoundPage', () => {
  it('renders the oversized 404 as the page-level h1 (Req 18.1)', () => {
    renderPage();
    const h1 = screen.getByRole('heading', { level: 1, name: '404' });
    expect(h1.tagName).toBe('H1');
  });

  it('renders quick links to the top routes (Req 18.2)', () => {
    renderPage();

    const nav = screen.getByRole('navigation', { name: 'Quick links' });
    const expected: Array<[string, string]> = [
      ['Home', '/'],
      ['Portfolio', '/portfolio'],
      ['Services', '/services'],
      ['About', '/about'],
      ['Blog', '/blog'],
      ['Contact', '/contact'],
    ];

    for (const [label, href] of expected) {
      const link = within(nav).getByRole('link', { name: label });
      expect(link).toHaveAttribute('href', href);
    }
  });

  it('renders a primary back-home action (Req 18.2)', () => {
    renderPage();
    const home = screen.getByRole('link', { name: 'Back home' });
    expect(home).toHaveAttribute('href', '/');
  });

  it('emits noIndex robots metadata via SEOHead (Req 18.3 / 40.5)', async () => {
    renderPage();
    await waitFor(() => {
      const robots = document.head.querySelector('meta[name="robots"]');
      expect(robots).not.toBeNull();
      expect(robots?.getAttribute('content')).toBe('noindex,follow');
    });
  });

  it('has no axe violations under reduced motion', async () => {
    mockReducedMotion(true);
    const { container } = renderPage();
    expect(await axe(container)).toHaveNoViolations();
  });
});
