/**
 * TestimonialCard — client testimonial card (task 10.5).
 *
 * Renders the quote, author, author role, and company, with an optional avatar
 * and an optional 1..5 star rating. The avatar (when present) uses the reserved
 * aspect-ratio {@link CardImage} so a load failure degrades to a placeholder
 * without breaking layout. The rating is exposed with an accessible label while
 * the individual stars are decorative (`aria-hidden`).
 *
 * _Requirements: 8.1, 39.3, 42.3_
 */
import type { Testimonial } from '@app-types';
import { CardImage } from './CardImage';

export interface TestimonialCardProps {
  /** The testimonial to render. */
  testimonial: Testimonial;
}

/** Clamp a rating into the renderable 1..5 range. */
function clampRating(rating: number): number {
  if (rating < 1) return 1;
  if (rating > 5) return 5;
  return Math.round(rating);
}

export function TestimonialCard({ testimonial }: TestimonialCardProps): JSX.Element {
  const { quote, author, authorRole, company, avatar, rating } = testimonial;
  const stars = rating !== undefined ? clampRating(rating) : undefined;

  return (
    <figure className="flex flex-col gap-6 rounded-lg border border-ink-600 bg-ink-800 p-8">
      {stars !== undefined ? (
        <div
          className="flex gap-1 text-pulse-500"
          role="img"
          aria-label={`Rated ${stars} out of 5`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} aria-hidden="true">
              {i < stars ? '★' : '☆'}
            </span>
          ))}
        </div>
      ) : null}

      <blockquote className="font-display text-h3 leading-snug text-mist-100">
        “{quote}”
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-4">
        {avatar !== undefined ? (
          <CardImage
            image={avatar}
            className="h-12 w-12 shrink-0 rounded-full"
          />
        ) : null}
        <div className="flex flex-col">
          <span className="font-sans text-body text-mist-100">{author}</span>
          <span className="font-mono text-xs uppercase tracking-widest text-mist-300">
            {authorRole}, {company}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}

export default TestimonialCard;
