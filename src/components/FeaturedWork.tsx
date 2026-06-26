/**
 * FeaturedWork — scroll-animated showcase of the featured case studies.
 *
 * Replaces the flat preview grid with large, alternating editorial rows. As the
 * visitor scrolls, each project's media drifts with a parallax offset and the
 * row reveals — turning the section into motion rather than a static grid.
 *
 * Each row is a single `Link` to the case study (carrying the "VIEW" cursor
 * state) so the homepage's link contract is preserved: one link per featured
 * project plus the "View all work" link.
 *
 * Motion contract:
 *  - Motion allowed → GSAP `ScrollTrigger` scrubs a vertical parallax on each
 *    project's media as its row passes through the viewport.
 *  - Reduced motion → no parallax/scrub; rows render fully visible and still.
 *    (`useScrollAnimation` re-runs on preference change and we skip the setup.)
 */
import type { RefObject } from 'react';
import { Link } from 'react-router-dom';

import type { CaseStudy } from '@app-types';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import { CardImage } from './CardImage';
import { SectionHeader } from './SectionHeader';

export interface FeaturedWorkProps {
  caseStudies: CaseStudy[];
}

const CATEGORY_LABELS: Record<CaseStudy['category'], string> = {
  websites: 'Websites',
  mobile: 'Mobile',
  systems: 'Systems',
};

export function FeaturedWork({ caseStudies }: FeaturedWorkProps): JSX.Element {
  const ref = useScrollAnimation(({ el, gsap, reducedMotion }) => {
    if (reducedMotion) return;
    const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]', el);
    layers.forEach((layer) => {
      const row = layer.closest('[data-row]');
      gsap.fromTo(
        layer,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: row ?? layer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });
  });

  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      aria-label="Featured work"
      className="mx-auto w-full max-w-site px-6 py-[clamp(6rem,14vh,11rem)] sm:px-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader eyebrow="Selected work" title="Built to outlast" />
        <Link
          to="/portfolio"
          data-cursor="link"
          className="inline-flex min-h-[44px] items-center gap-2 font-mono text-mono-eyebrow uppercase tracking-[0.18em] text-pulse-500 transition-transform duration-200 ease-out hover:translate-x-1 focus-visible:translate-x-1"
        >
          View all work
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-16 flex flex-col gap-[clamp(4rem,9vh,8rem)]">
        {caseStudies.map((caseStudy, index) => {
          const reversed = index % 2 === 1;
          const keyMetric = caseStudy.results[0];
          return (
            <Link
              key={caseStudy.slug}
              to={`/portfolio/${caseStudy.slug}`}
              data-cursor="view"
              data-row=""
              className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              {/* Media with parallax drift inside an overflow-clipped frame. */}
              <div
                className={[
                  'relative overflow-hidden rounded-2xl ring-1 ring-ink-600',
                  'transition-shadow duration-500 ease-out',
                  'group-hover:shadow-[0_24px_80px_-32px_var(--pulse-700)]',
                  reversed ? 'lg:order-2' : 'lg:order-1',
                ].join(' ')}
              >
                <div data-parallax="" className="scale-[1.18]">
                  <CardImage
                    image={caseStudy.hero}
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                {/* Index badge. */}
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-4 rounded-full bg-ink-900/85 px-3 py-1 font-mono text-xs uppercase tracking-widest text-mist-100 backdrop-blur"
                >
                  {String(index + 1).padStart(2, '0')} / {String(caseStudies.length).padStart(2, '0')}
                </span>
              </div>

              {/* Copy. */}
              <div className={reversed ? 'lg:order-1' : 'lg:order-2'}>
                <p className="font-mono text-mono-eyebrow uppercase tracking-[0.2em] text-pulse-500">
                  {caseStudy.client} · {CATEGORY_LABELS[caseStudy.category]}
                </p>
                <h3 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.02em] text-mist-100">
                  {caseStudy.title}
                </h3>
                <p className="mt-5 max-w-md font-sans text-body-l text-mist-300">
                  {caseStudy.summary}
                </p>
                {keyMetric !== undefined ? (
                  <p className="mt-6 inline-flex items-baseline gap-2">
                    <span className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-pulse-500">
                      {keyMetric.prefix ?? ''}
                      {keyMetric.value}
                      {keyMetric.suffix ?? ''}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-mist-300">
                      {keyMetric.label}
                    </span>
                  </p>
                ) : null}
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-mono-eyebrow uppercase tracking-[0.18em] text-mist-100">
                  View case study
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedWork;
