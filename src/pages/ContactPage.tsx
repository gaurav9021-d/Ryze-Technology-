/**
 * ContactPage — `/contact` (task 14.15).
 *
 * Composition (design "8. /contact"):
 *   Hero → Contact_Form (with inline validation + submit states) →
 *   Contact info → closing email CTA.
 *
 * The page renders the `ContactForm` (Requirements 13.1–13.6) beneath a single
 * page `h1`, exposes the studio's contact details, and closes with a CTA that
 * offers a direct email path. Section reveals use `AnimationWrapper`, which
 * renders content in its final visible state immediately under
 * `prefers-reduced-motion` (Requirements 25.1, 37.2).
 *
 * _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 38.6_
 */
import type { SEOMeta } from '@app-types';
import { SectionHeader } from '@components/SectionHeader';
import { CTA } from '@components/CTA';
import { SEOHead } from '@components/SEOHead';
import { AnimationWrapper } from '@components/AnimationWrapper';
import { ContactForm } from '@components/ContactForm';
import { siteMetadata } from '@data/siteMetadata';

/** Per-route metadata. Canonical resolves to `/contact` on the site origin. */
const seo: SEOMeta = {
  title: 'Contact',
  description:
    'Tell Ryze Technology about your project. Share your goals, budget, and timeline, and we will help you figure out the right way to build it.',
  canonical: `${siteMetadata.baseUrl}/contact`,
};

export function ContactPage(): JSX.Element {
  return (
    <>
      <SEOHead meta={seo} />

      <main>
        {/* Hero */}
        <section className="px-6 pb-12 pt-32">
          <AnimationWrapper variant="rise">
            <SectionHeader
              as="h1"
              eyebrow="Get in touch"
              title="Let's build something that lasts"
            />
            <p className="mt-6 max-w-2xl font-sans text-body-l text-mist-300">
              Tell us what you're working on. Share as much or as little as you
              like — we'll read every word and get back to you with a thoughtful
              reply, not a canned one.
            </p>
          </AnimationWrapper>
        </section>

        {/* Contact form (Req 13.1–13.6) */}
        <section aria-label="Contact form" className="px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <AnimationWrapper variant="rise">
              <ContactForm />
            </AnimationWrapper>
          </div>
        </section>

        {/* Contact info */}
        <section aria-label="Contact details" className="px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <AnimationWrapper variant="fade">
              <div className="flex flex-col gap-3 border-t border-ink-600 pt-8">
                <p className="font-mono text-mono-eyebrow uppercase tracking-widest text-pulse-500">
                  Prefer email?
                </p>
                <a
                  href={`mailto:${siteMetadata.contactEmail}`}
                  className="font-display text-h3 text-mist-100 underline underline-offset-4 hover:text-pulse-500"
                >
                  {siteMetadata.contactEmail}
                </a>
                <p className="max-w-2xl font-sans text-body text-mist-300">
                  We typically reply within one business day.
                </p>
              </div>
            </AnimationWrapper>
          </div>
        </section>

        {/* Closing CTA */}
        <CTA
          heading="Rather just say hello?"
          sub="Drop us a line and we'll take it from there."
          href={`mailto:${siteMetadata.contactEmail}`}
          label="Email us"
        />
      </main>
    </>
  );
}

export default ContactPage;
