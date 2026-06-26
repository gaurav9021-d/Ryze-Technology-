/**
 * Footer — global site footer (task 10.3).
 *
 * Renders on every page (Requirement 4.1) as the `contentinfo` landmark. Sources
 * all content from the typed Data_Layer (Requirement 4.2):
 *  - the brand name + tagline and the copyright line from `siteMetadata`;
 *  - site links from `footerNav` groups (internal `Link`s);
 *  - legal links from `footerLegalLinks`;
 *  - social profiles from `siteMetadata.social` (external, opened in a new tab
 *    with `rel="noopener noreferrer"`);
 *  - the contact email as a `mailto:` link from `siteMetadata.contactEmail`.
 *
 * _Requirements: 4.1, 4.2_
 */
import { Link } from 'react-router-dom';

import { Logo } from './Logo';
import { siteMetadata } from '@data/siteMetadata';
import { footerLegalLinks } from '@data/navigation';
import type { SiteMetadata, SocialLink } from '@app-types';

export interface FooterProps {
  /** Site metadata source. Defaults to the shipped `siteMetadata`. */
  metadata?: SiteMetadata;
}

/** Human-readable labels for each social platform. */
const SOCIAL_LABELS: Record<SocialLink['platform'], string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  x: 'X',
  dribbble: 'Dribbble',
  email: 'Email',
};

/**
 * Build the href for a social link. The `email` platform becomes a `mailto:`
 * target; everything else is treated as an external URL.
 */
function socialHref(link: SocialLink): string {
  return link.platform === 'email' ? `mailto:${link.url}` : link.url;
}

export function Footer({ metadata = siteMetadata }: FooterProps = {}): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t border-ink-600 bg-ink-900 text-mist-300"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
        {/* Brand + copyright */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            to="/"
            aria-label="Ryze Technology home"
            className="inline-flex transition-opacity hover:opacity-80 focus-visible:opacity-80"
          >
            <Logo variant="full" height={24} />
          </Link>
          <p className="font-mono text-xs text-mist-300">
            © {year} {metadata.siteName}
          </p>
        </div>

        {/* Social + email + legal */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ul className="flex flex-wrap gap-5" aria-label="Social media">
            {metadata.social.map((link) => (
              <li key={link.platform}>
                <a
                  href={socialHref(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-mist-300 transition-colors hover:text-pulse-500"
                >
                  {SOCIAL_LABELS[link.platform]}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${metadata.contactEmail}`}
            className="font-mono text-xs text-mist-100 transition-colors hover:text-pulse-500"
          >
            {metadata.contactEmail}
          </a>

          <ul className="flex flex-wrap gap-5" aria-label="Legal">
            {footerLegalLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="font-mono text-xs text-mist-300 transition-colors hover:text-pulse-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
