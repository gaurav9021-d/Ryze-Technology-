/**
 * Site-wide metadata for SEO, Open Graph, and the global footer.
 *
 * Centralized, typed, static metadata consumed by SEOHead and Footer. The
 * `contactEndpoint` is read from injected environment configuration so the
 * static build holds no secrets (Requirement 41.2).
 *
 * Requirements: 40.1 (title template + default OG/canonical), 41.2 (env-injected
 * Form_Endpoint), 13.3 (Contact_Form POST target), 4.2 (footer contact details).
 */

import type { ImageAsset, SiteMetadata, SocialLink } from '@app-types';

/**
 * Fallback used when no `VITE_CONTACT_ENDPOINT` is injected at build time.
 * Keeps the form wired to a sensible default during local development while
 * allowing the deploy environment to override it.
 */
const DEFAULT_CONTACT_ENDPOINT = 'https://ryze.technology/api/contact';

/**
 * The form POST target, injected per environment. Reads
 * `import.meta.env.VITE_CONTACT_ENDPOINT` and falls back to a sane default so
 * the build never ships an empty endpoint.
 */
const contactEndpoint: string =
  import.meta.env.VITE_CONTACT_ENDPOINT ?? DEFAULT_CONTACT_ENDPOINT;

const defaultOgImage: ImageAsset = {
  src: '/images/og/default.jpg',
  width: 1200,
  height: 630,
  alt: 'Ryze Technology — a software studio engineering durable web, mobile, and business systems',
};

const social: SocialLink[] = [
  { platform: 'linkedin', url: 'https://www.linkedin.com/company/ryze-technology' },
  { platform: 'github', url: 'https://github.com/ryze-technology' },
  { platform: 'x', url: 'https://x.com/ryzetech' },
];

export const siteMetadata: SiteMetadata = {
  siteName: 'Ryze Technology',
  defaultTitle: 'Ryze Technology — Software Studio',
  titleTemplate: '%s — Ryze Technology',
  // 142 chars: within the 50–160 range for clean search/social previews.
  defaultDescription:
    'Ryze Technology is a software studio that designs and engineers durable websites, web apps, mobile apps, and business systems built to last.',
  baseUrl: 'https://ryze.technology',
  defaultOgImage,
  social,
  contactEmail: 'hello@ryze.technology',
  contactEndpoint,
};
