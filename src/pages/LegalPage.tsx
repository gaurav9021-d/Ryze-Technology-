/**
 * LegalPage — shared, param-driven template for `/privacy`, `/terms`, and
 * `/cookies` (task 14.22, design "12. /privacy · /terms · /cookies").
 *
 * The page resolves which `LegalDoc` to render, then lays out:
 *   Breadcrumb → page `<h1>` + last-updated mono label → auto-generated table
 *   of contents → long-form sections (each an `<h2 id>` anchor target).
 *
 * The TOC is generated from the document's `sections`: a
 * `<nav aria-label="Table of contents">` of in-page anchor links, one per
 * section, each pointing at its section's `id`. Prose is constrained to a
 * ~68ch measure for readability (Requirement 17.1).
 *
 * Routing is tolerant of how the future router wires this up. The document key
 * is resolved in order: explicit `slug` prop → `useParams().docType` → default
 * `'privacy'`. If the resolved key is not a known legal document, the page
 * renders a graceful not-found message — still a single `<h1>` with a
 * `noIndex` SEOHead so the stray URL stays out of search results.
 *
 * _Requirements: 17.1_
 */
import type { SEOMeta } from '@app-types';
import { Breadcrumb } from '@components/Breadcrumb';
import { SEOHead } from '@components/SEOHead';
import { legalDocs, type LegalDoc } from '@data/legal';
import { siteMetadata } from '@data/siteMetadata';
import { useParams } from 'react-router-dom';

type LegalSlug = 'privacy' | 'terms' | 'cookies';

export interface LegalPageProps {
  /**
   * Explicit document slug. When provided it overrides the `:docType` route
   * param — lets the router render `<LegalPage slug="privacy" />` directly.
   */
  slug?: LegalSlug;
}

/** Narrowing guard: is `key` one of the known legal document slugs? */
function isLegalSlug(key: string | undefined): key is LegalSlug {
  return key === 'privacy' || key === 'terms' || key === 'cookies';
}

export function LegalPage({ slug }: LegalPageProps = {}): JSX.Element {
  const { docType } = useParams<{ docType?: string }>();

  // Resolve order: explicit prop → route param → default 'privacy'.
  const resolvedKey: string = slug ?? docType ?? 'privacy';

  // Guard the indexed access (noUncheckedIndexedAccess): only look up known keys.
  const doc: LegalDoc | undefined = isLegalSlug(resolvedKey)
    ? legalDocs[resolvedKey]
    : undefined;

  if (doc === undefined) {
    const notFoundMeta: SEOMeta = {
      title: 'Document Not Found',
      description:
        'The legal document you are looking for could not be found.',
      canonical: `${siteMetadata.baseUrl}/${resolvedKey}`,
      noIndex: true,
    };

    return (
      <>
        <SEOHead meta={notFoundMeta} />
        <main className="px-6 pb-24 pt-32">
          <Breadcrumb />
          <h1 className="mt-8 font-display text-display-l text-mist-100">
            Document Not Found
          </h1>
          <p className="mt-6 max-w-[68ch] font-sans text-body-l text-mist-300">
            We couldn't find the legal document you were looking for. Try the
            Privacy Policy, Terms of Service, or Cookie Policy.
          </p>
        </main>
      </>
    );
  }

  const meta: SEOMeta = {
    title: doc.title,
    description: `${doc.title} for Ryze Technology — how we handle your information and the terms of using our site.`,
    canonical: `${siteMetadata.baseUrl}/${doc.slug}`,
  };

  return (
    <>
      <SEOHead meta={meta} />
      <main className="px-6 pb-24 pt-32">
        <Breadcrumb />

        <header className="mt-8 max-w-[68ch]">
          <h1 className="font-display text-display-l text-mist-100">
            {doc.title}
          </h1>
          <p className="mt-4 font-mono text-mono-eyebrow uppercase tracking-widest text-mist-300">
            Last updated: {doc.lastUpdated}
          </p>
        </header>

        {/* Auto-generated table of contents (Req 17.1) */}
        <nav
          aria-label="Table of contents"
          className="mt-12 max-w-[68ch] border-l border-ink-600 pl-6"
        >
          <p className="font-mono text-mono-eyebrow uppercase tracking-widest text-pulse-500">
            On this page
          </p>
          <ol className="mt-4 flex flex-col gap-2">
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="font-sans text-body text-mist-300 transition-colors hover:text-pulse-500"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Long-form content (Req 17.1) */}
        <div className="mt-16 flex max-w-[68ch] flex-col gap-12">
          {doc.sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2
                id={section.id}
                className="font-display text-h2 text-mist-100"
              >
                {section.heading}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {section.body.map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-sans text-body text-mist-300"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}

export default LegalPage;
