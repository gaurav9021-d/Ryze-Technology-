/**
 * NotFoundPage — catch-all `*` route 404 (task 14.23).
 *
 * Composition (design "13. * — 404"): an oversized "404" display heading,
 * witty copy, quick links to the top routes, and a primary "Back home"
 * `MagneticButton`. The route is non-indexable, so its SEO metadata carries
 * `noIndex: true` which SEOHead emits as a `robots: noindex,follow` tag
 * (Requirements 18.3 / 40.5).
 *
 * Motion: the decorative "404" is real, ordered DOM content rendered in its
 * final, fully readable state regardless of motion preference. The design's
 * interactive canvas is purely decorative polish and is intentionally NOT
 * mounted here — under `prefers-reduced-motion` the page is fully static
 * (Requirement 37.x), and with motion allowed it remains a clean, accessible
 * static 404. This keeps the not-found path lightweight and dependable, which
 * matters most when a user has already hit a dead end.
 *
 * Requirements: 18.1 (custom 404 for unknown routes), 18.2 (quick links + home/
 * back action to recover), 18.3 / 40.5 (noIndex metadata).
 */
import type { SEOMeta } from '@app-types';
import { Link } from 'react-router-dom';
import { SEOHead } from '@components/SEOHead';
import { MagneticButton } from '@components/MagneticButton';
import { siteMetadata } from '@data/siteMetadata';

/** Per-route metadata. Non-indexable, so `noIndex` is set (Req 18.3 / 40.5). */
const seo: SEOMeta = {
  title: 'Page not found',
  description:
    "The page you are looking for may have moved or never existed. Head back home or jump to one of our main sections.",
  canonical: `${siteMetadata.baseUrl}/404`,
  noIndex: true,
};

/** A recovery link surfaced in the quick-links list (Req 18.2). */
interface QuickLink {
  to: string;
  label: string;
}

/** Top routes a lost visitor most likely wants (Req 18.2). */
const QUICK_LINKS: QuickLink[] = [
  { to: '/', label: 'Home' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export function NotFoundPage(): JSX.Element {
  return (
    <>
      <SEOHead meta={seo} />

      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center">
        <p className="font-mono text-mono-eyebrow tracking-widest text-pulse-500">
          Error · Lost in space
        </p>

        <h1 className="mt-6 font-display text-display-xl leading-none text-mist-100">
          404
        </h1>

        <p className="mt-8 max-w-2xl font-sans text-body-l text-mist-300">
          We looked everywhere, but this page isn&rsquo;t here. It may have
          moved, been retired, or never existed at all. Let&rsquo;s get you back
          on track.
        </p>

        {/* Primary recovery action — back home (Req 18.2). */}
        <div className="mt-10">
          <MagneticButton as="a" href="/" ariaLabel="Back home">
            Back home
          </MagneticButton>
        </div>

        {/* Quick links to top routes (Req 18.2). */}
        <nav aria-label="Quick links" className="mt-16 w-full max-w-xl">
          <h2 className="font-mono text-mono-eyebrow tracking-widest text-mist-300">
            Or try one of these
          </h2>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="font-sans text-body text-mist-100 underline-offset-4 transition-colors duration-200 ease-out hover:text-pulse-500 hover:underline focus-visible:text-pulse-500 focus-visible:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}

export default NotFoundPage;
