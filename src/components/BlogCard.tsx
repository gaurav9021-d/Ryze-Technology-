/**
 * BlogCard — blog post preview card (task 10.5).
 *
 * Renders the post's cover image, category tag, title (a `Link` to
 * `/blog/:slug`), excerpt, published date, and reading time ("X min read").
 * The cover sits in a reserved aspect-ratio box (no CLS) and degrades to a
 * blurDataURL/solid placeholder on load failure via {@link CardImage}. The card
 * carries `data-cursor="link"` for the custom-cursor link state.
 *
 * _Requirements: 14.1, 39.3, 42.3_
 */
import { Link } from 'react-router-dom';

import type { BlogPost } from '@app-types';
import { CardImage } from './CardImage';

export interface BlogCardProps {
  /** The post to render. */
  post: BlogPost;
  /** Position in a grid; drives a small stagger delay. */
  index?: number;
}

/** Human-readable labels per blog category. */
const CATEGORY_LABELS: Record<BlogPost['category'], string> = {
  engineering: 'Engineering',
  design: 'Design',
  process: 'Process',
  company: 'Company',
};

/** Format an ISO 'YYYY-MM-DD' date as e.g. "Jan 5, 2025"; passthrough on parse failure. */
function formatDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function BlogCard({ post, index = 0 }: BlogCardProps): JSX.Element {
  return (
    <article
      style={{ ['--card-index' as string]: index }}
      className="group flex flex-col gap-4"
    >
      <Link
        to={`/blog/${post.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="block rounded-lg ring-1 ring-ink-600/60"
      >
        <CardImage
          image={post.cover}
          className="rounded-lg"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-pulse-500">
          {CATEGORY_LABELS[post.category]}
        </p>
        <h3 className="font-display text-h3 text-mist-100">
          <Link
            to={`/blog/${post.slug}`}
            data-cursor="link"
            className="transition-colors hover:text-pulse-500 focus-visible:text-pulse-500"
          >
            {post.title}
          </Link>
        </h3>
        <p className="font-sans text-body text-mist-300">{post.excerpt}</p>
        <p className="mt-1 flex items-center gap-2 font-mono text-xs text-mist-300">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </p>
      </div>
    </article>
  );
}

export default BlogCard;
