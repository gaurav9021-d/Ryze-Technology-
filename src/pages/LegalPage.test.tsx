/**
 * Tests for LegalPage (task 14.22).
 *
 * LegalPage is the param-driven template for `/privacy`, `/terms`, `/cookies`.
 * It reads `useParams().docType` (overridable via a `slug` prop) and renders a
 * Breadcrumb, a single `<h1>`, a last-updated label, an auto-generated table of
 * contents linking to each section id, and the long-form sections.
 *
 * Renders are wrapped in `HelmetProvider` (SEOHead) + `MemoryRouter`
 * (Breadcrumb + useParams).
 *
 *  - Each document renders per `:docType` param: title, last-updated, TOC links
 *    to every section id, and `<h2 id>` anchor targets (Requirement 17.1).
 *  - The `slug` prop overrides the route param.
 *  - An unknown key renders the graceful not-found state with a single h1.
 *  - The page has no axe violations.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { axe } from 'jest-axe';

import { legalDocs } from '@data/legal';

import LegalPage from './LegalPage';

type LegalSlug = 'privacy' | 'terms' | 'cookies';

/** Render LegalPage at `/:docType` using the route param to pick the doc. */
function renderAtParam(docType: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/${docType}`]}>
        <Routes>
          <Route path="/:docType" element={<LegalPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

/** Render LegalPage with an explicit `slug` prop (router-direct usage). */
function renderWithSlug(slug: LegalSlug) {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LegalPage slug={slug} />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

const SLUGS: LegalSlug[] = ['privacy', 'terms', 'cookies'];

describe('LegalPage', () => {
  it.each(SLUGS)(
    'renders the %s document resolved from the :docType param (Req 17.1)',
    (slug) => {
      const doc = legalDocs[slug];
      renderAtParam(slug);

      // Single h1 = the document title.
      const h1 = screen.getByRole('heading', { level: 1, name: doc.title });
      expect(h1.tagName).toBe('H1');

      // Last-updated label present.
      expect(
        screen.getByText(`Last updated: ${doc.lastUpdated}`),
      ).toBeInTheDocument();
    },
  );

  it('builds an auto TOC whose links point to each section id (Req 17.1)', () => {
    const doc = legalDocs.privacy;
    renderAtParam('privacy');

    const toc = screen.getByRole('navigation', { name: 'Table of contents' });
    for (const section of doc.sections) {
      const link = within(toc).getByRole('link', { name: section.heading });
      expect(link).toHaveAttribute('href', `#${section.id}`);

      // Each section heading is an h2 anchor target with the matching id.
      const h2 = screen.getByRole('heading', { level: 2, name: section.heading });
      expect(h2).toHaveAttribute('id', section.id);
    }
  });

  it('lets the slug prop override the route param', () => {
    // Param says privacy, prop says terms — prop wins.
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/privacy']}>
          <Routes>
            <Route path="/:docType" element={<LegalPage slug="terms" />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: legalDocs.terms.title }),
    ).toBeInTheDocument();
  });

  it('renders a graceful not-found state for an unknown key', () => {
    renderAtParam('unknown-doc');

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Document Not Found');
  });

  it('has no axe violations', async () => {
    const { container } = renderWithSlug('privacy');
    expect(await axe(container)).toHaveNoViolations();
  });
});
