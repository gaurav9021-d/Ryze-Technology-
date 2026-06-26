/**
 * CaseStudyCard — portfolio project card (task 10.5).
 *
 * A `Link` to `/portfolio/:slug` presenting the project's hero image, title,
 * client + category, and a single key metric. The whole card advertises the
 * "VIEW" custom-cursor state via `data-cursor="view"` (design "Portfolio
 * preview"). When motion is allowed the media tilts toward the pointer with the
 * `hoverDistort` utility and the card lifts/glows on hover; under reduced motion
 * the distortion is skipped (`hoverDistort` is never attached) and only CSS
 * styling applies.
 *
 * The hero image sits in a reserved aspect-ratio box (no CLS) and degrades to a
 * blurDataURL/solid placeholder on load failure via {@link CardImage}.
 *
 * _Requirements: 7.1, 39.3, 42.3_
 */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import type { CaseStudy } from '@app-types';
import { useReducedMotion } from '@hooks/useReducedMotion';
import { CardImage } from './CardImage';

export interface CaseStudyCardProps {
  /** The case study to render. */
  caseStudy: CaseStudy;
  /** Position in a grid; drives a small stagger delay. */
  index?: number;
  /** Featured cards render larger / emphasized. */
  featured?: boolean;
}

/** Human-readable labels for the portfolio categories. */
const CATEGORY_LABELS: Record<CaseStudy['category'], string> = {
  websites: 'Websites',
  mobile: 'Mobile',
  systems: 'Systems',
};

export function CaseStudyCard({
  caseStudy,
  index = 0,
  featured = false,
}: CaseStudyCardProps): JSX.Element {
  const reducedMotion = useReducedMotion();
  const mediaRef = useRef<HTMLDivElement>(null);

  // Attach pointer-driven distortion lazily on first hover so GSAP is only
  // loaded for visitors who actually interact (keeps it out of the initial
  // bundle). No-op under reduced motion (Requirement 37.2).
  useEffect(() => {
    const el = mediaRef.current;
    if (el === null || reducedMotion) {
      return undefined;
    }
    let cleanup: (() => void) | undefined;
    let disposed = false;
    const handleEnter = (): void => {
      if (cleanup !== undefined) {
        return;
      }
      void import('@lib/animation').then(({ hoverDistort }) => {
        if (disposed || mediaRef.current === null) {
          return;
        }
        cleanup = hoverDistort(mediaRef.current, { intensity: 8 });
      });
    };
    el.addEventListener('pointerenter', handleEnter);
    return () => {
      disposed = true;
      el.removeEventListener('pointerenter', handleEnter);
      cleanup?.();
    };
  }, [reducedMotion]);

  // First metric is the headline "key metric" shown on the card.
  const keyMetric = caseStudy.results[0];

  return (
    <Link
      to={`/portfolio/${caseStudy.slug}`}
      data-cursor="view"
      style={{ ['--card-index' as string]: index }}
      className={[
        'group flex flex-col gap-4 rounded-lg p-2',
        'transition-transform duration-300 ease-out',
        'hover:-translate-y-1',
        'focus-visible:-translate-y-1',
        featured ? 'md:col-span-2' : '',
      ]
        .filter((c) => c.length > 0)
        .join(' ')}
    >
      <div
        ref={mediaRef}
        className={[
          'rounded-lg ring-1 ring-ink-600/60 [perspective:1000px]',
          'transition-shadow duration-300 ease-out',
          'group-hover:shadow-[0_0_40px_-8px_var(--pulse-500,#22d3ee)]',
          'group-focus-visible:shadow-[0_0_40px_-8px_var(--pulse-500,#22d3ee)]',
        ].join(' ')}
      >
        <CardImage
          image={caseStudy.hero}
          className="rounded-lg"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-widest text-pulse-500">
          {caseStudy.client} · {CATEGORY_LABELS[caseStudy.category]}
        </p>
        <h3
          className={[
            'font-display text-mist-100',
            featured ? 'text-h2' : 'text-h3',
          ].join(' ')}
        >
          {caseStudy.title}
        </h3>
        {keyMetric !== undefined ? (
          <p className="mt-1 font-mono text-sm text-mist-300">
            <span className="text-mist-100">
              {keyMetric.prefix ?? ''}
              {keyMetric.value}
              {keyMetric.suffix ?? ''}
            </span>{' '}
            {keyMetric.label}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export default CaseStudyCard;
