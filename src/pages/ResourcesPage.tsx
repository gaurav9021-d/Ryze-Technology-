/**
 * ResourcesPage — `/resources` optional downloads page (task 14.21).
 *
 * Composition (design "11. /resources (optional)"):
 *   Hero → grid of downloadable resource cards (file metadata + download link).
 *
 * When the `resourcesEnabled` flag is true the page renders a responsive grid
 * of `ResourceItem`s, each card showing a title, description, mono file-type /
 * size metadata, and an accessible download link (Requirement 16.1). When the
 * flag is false the page renders a tasteful "coming soon" empty state instead
 * of the grid — in both cases the page keeps a single `h1` and SEOHead.
 *
 * Motion: section reveals use `AnimationWrapper`, which renders content in its
 * final visible state immediately under `prefers-reduced-motion` (Requirements
 * 25.1, 37.2), so cards and links stay fully readable with no scroll
 * dependency.
 *
 * _Requirements: 16.1_
 */
import type { SEOMeta } from '@app-types';
import { SectionHeader } from '@components/SectionHeader';
import { CTA } from '@components/CTA';
import { SEOHead } from '@components/SEOHead';
import { AnimationWrapper } from '@components/AnimationWrapper';
import { resources, resourcesEnabled } from '@data/resources';
import { siteMetadata } from '@data/siteMetadata';

/** Per-route metadata. Canonical resolves to `/resources` on the site origin. */
const seo: SEOMeta = {
  title: 'Resources',
  description:
    'Free, practical resources from Ryze Technology — playbooks, checklists, and templates we use to design and engineer durable software.',
  canonical: `${siteMetadata.baseUrl}/resources`,
};

export function ResourcesPage(): JSX.Element {
  return (
    <>
      <SEOHead meta={seo} />

      <main>
        {/* Hero */}
        <section className="px-6 pb-16 pt-32">
          <AnimationWrapper variant="rise">
            <SectionHeader
              as="h1"
              eyebrow="Free downloads"
              title="Resources"
            />
            <p className="mt-6 max-w-2xl font-sans text-body-l text-mist-300">
              The playbooks, checklists, and templates we lean on to ship
              durable software. Free to download and use on your own projects.
            </p>
          </AnimationWrapper>
        </section>

        {resourcesEnabled ? (
          /* Resource grid (Req 16.1) */
          <section aria-labelledby="resources-heading" className="px-6 py-16">
            <h2 id="resources-heading" className="sr-only">
              Downloadable resources
            </h2>
            <AnimationWrapper variant="rise" stagger={0.08}>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-4 rounded-lg border border-ink-600 bg-ink-800 p-6"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="font-display text-h3 text-mist-100">
                        {item.title}
                      </h3>
                      <p className="font-sans text-body text-mist-300">
                        {item.description}
                      </p>
                    </div>
                    <p className="font-mono text-mono-eyebrow uppercase tracking-widest text-pulse-500">
                      {item.fileType} · {item.fileSize}
                    </p>
                    <a
                      href={item.href}
                      download
                      aria-label={`Download ${item.title} (${item.fileType}, ${item.fileSize})`}
                      className="mt-auto inline-flex w-fit items-center font-mono text-mono-eyebrow uppercase tracking-widest text-mist-100 underline decoration-pulse-500 underline-offset-4 transition-colors hover:text-pulse-500"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            </AnimationWrapper>
          </section>
        ) : (
          /* Empty "coming soon" state */
          <section aria-labelledby="resources-heading" className="px-6 py-16">
            <h2 id="resources-heading" className="sr-only">
              Downloadable resources
            </h2>
            <AnimationWrapper variant="fade">
              <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-lg border border-ink-600 bg-ink-800 p-10 text-center">
                <p className="font-mono text-mono-eyebrow uppercase tracking-widest text-pulse-500">
                  Coming soon
                </p>
                <p className="font-sans text-body-l text-mist-300">
                  We're putting together a library of playbooks, checklists, and
                  templates. Check back soon — or reach out and we'll share what
                  we have today.
                </p>
              </div>
            </AnimationWrapper>
          </section>
        )}

        {/* Closing CTA */}
        <CTA
          heading="Want help putting these into practice?"
          sub="Tell us what you're working on. We'll help you figure out the right way to build it."
        />
      </main>
    </>
  );
}

export default ResourcesPage;
