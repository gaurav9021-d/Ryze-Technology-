/**
 * SEOHead — per-route document metadata (task 7.7).
 *
 * Renders a `<Helmet>` that sets the document title, meta description, canonical
 * link, Open Graph and Twitter Card tags, and an optional `robots` directive for
 * pages that should not be indexed. An optional JSON-LD payload is injected as a
 * `<script type="application/ld+json">`.
 *
 * The title is composed from `siteMetadata.titleTemplate` (e.g. `%s — Ryze
 * Technology`). When the supplied `meta.title` already equals the site name, the
 * template would produce a redundant "Ryze Technology — Ryze Technology", so we
 * fall back to `siteMetadata.defaultTitle` instead.
 *
 * The meta description is passed through `normalizeMetaDescription` so it stays
 * within the crawler-safe length regardless of the raw input.
 *
 * NOTE: For these tags to take effect the application root must be wrapped in
 * `<HelmetProvider>` (from `react-helmet-async`). That wiring is performed in
 * task 13.2 — this component intentionally does not modify App.
 *
 * Requirements: 40.1 (title template, description, canonical, OG per route),
 * 40.2 (normalized description), 18.3 / 40.5 (noIndex → robots noindex).
 */
import { Helmet } from 'react-helmet-async';
import type { SEOMeta } from '@app-types';
import { normalizeMetaDescription } from '@lib/seo';
import { siteMetadata } from '@data/siteMetadata';

export interface SEOHeadProps {
  meta: SEOMeta;
  /** Optional JSON-LD structured data injected as an ld+json script. */
  jsonLd?: object;
}

/**
 * Build the document title from the site title template.
 *
 * When `title` already equals the site name we use the configured default
 * title to avoid a doubled-up "Name — Name" string.
 */
function buildTitle(title: string): string {
  if (title === siteMetadata.siteName) {
    return siteMetadata.defaultTitle;
  }
  return siteMetadata.titleTemplate.replace('%s', title);
}

export function SEOHead({ meta, jsonLd }: SEOHeadProps): React.ReactElement {
  const title = buildTitle(meta.title);
  const description = normalizeMetaDescription(meta.description);
  const ogImageSrc = meta.ogImage?.src ?? siteMetadata.defaultOgImage.src;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={meta.canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageSrc} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:site_name" content={siteMetadata.siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageSrc} />

      {/* Robots: keep non-indexable routes out of search results. */}
      {meta.noIndex ? <meta name="robots" content="noindex,follow" /> : null}

      {/* Structured data */}
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}

export default SEOHead;
