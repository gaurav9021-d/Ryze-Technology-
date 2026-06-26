/**
 * Unit tests for ResourcesPage (task 14.21).
 *
 * ResourcesPage composes motion-aware components (SectionHeader/SplitText,
 * AnimationWrapper, MagneticButton) and SEOHead, so renders are wrapped in
 * `MemoryRouter`, `ReducedMotionProvider`, and `HelmetProvider`. `matchMedia`
 * and `IntersectionObserver` are stubbed because jsdom does not implement them.
 *
 * Requirements: 16.1 (grid of downloadable resource cards with file metadata
 * and download links), 38.x (single h1, no axe violations).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { axe } from 'jest-axe';
import { ReducedMotionProvider } from '@providers/ReducedMotionProvider';
import { mockReducedMotion, resetMatchMedia } from '@/test/matchMedia';
import { resources } from '@data/resources';

import { ResourcesPage } from './ResourcesPage';

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
  mockReducedMotion(false);
});

afterEach(() => {
  resetMatchMedia();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ReducedMotionProvider>
          <ResourcesPage />
        </ReducedMotionProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe('ResourcesPage', () => {
  it('renders the page-level h1 hero heading', () => {
    renderPage();
    const h1 = screen.getByRole('heading', { level: 1, name: 'Resources' });
    expect(h1.tagName).toBe('H1');
  });

  it('renders every resource as a card with metadata and a download link (Req 16.1)', () => {
    renderPage();

    expect(resources.length).toBeGreaterThanOrEqual(4);
    for (const item of resources) {
      expect(
        screen.getByRole('heading', { level: 3, name: item.title }),
      ).toBeInTheDocument();

      // Mono file metadata is rendered for each card.
      expect(
        screen.getByText(`${item.fileType} · ${item.fileSize}`),
      ).toBeInTheDocument();

      // Accessible, labelled download link pointing at the asset.
      const link = screen.getByRole('link', {
        name: `Download ${item.title} (${item.fileType}, ${item.fileSize})`,
      });
      expect(link).toHaveAttribute('href', item.href);
      expect(link).toHaveAttribute('download');
    }
  });

  it('renders the cards inside a single list (Req 16.1)', () => {
    renderPage();
    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(resources.length);
  });

  it('has no axe-detectable accessibility violations', async () => {
    mockReducedMotion(true);
    const { container } = renderPage();
    expect(await axe(container)).toHaveNoViolations();
  });
});
