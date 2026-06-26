/**
 * CLS / reserved-aspect-ratio smoke checks (task 16.4).
 *
 * These guard the zero-layout-shift contract for card media: every content
 * image must sit inside a wrapper whose `aspect-ratio` is reserved from the
 * asset's intrinsic dimensions, and the `<img>` itself must carry explicit
 * `width`/`height` so the browser reserves space before the bytes arrive. On a
 * load failure the reserved box must be retained (no reflow) while the media
 * degrades to a placeholder / LQIP.
 *
 * Rendered against the REAL CaseStudyCard + real `@data/caseStudies` content,
 * plus CardImage directly, to assert against the components' actual behaviour
 * (CardImage.tsx) rather than a fixture.
 *
 * Requirements: 39.2, 39.3 (no CLS — reserved aspect box), 42.3 (graceful
 * image fallback that keeps layout stable).
 *
 * Framework: Vitest + @testing-library/react.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ReducedMotionProvider } from '@providers/ReducedMotionProvider';
import { mockReducedMotion, resetMatchMedia } from '@/test/matchMedia';
import { caseStudies } from '@data/caseStudies';
import type { ImageAsset } from '@app-types';

import { CaseStudyCard } from './CaseStudyCard';
import { CardImage } from './CardImage';

function renderInProviders(ui: React.ReactElement) {
  return render(
    <ReducedMotionProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ReducedMotionProvider>,
  );
}

beforeEach(() => {
  mockReducedMotion(false);
});

afterEach(() => {
  resetMatchMedia();
});

describe('CaseStudyCard reserves an aspect-ratio box for its hero (Req 39.2/39.3)', () => {
  const [caseStudy] = caseStudies;
  if (caseStudy === undefined) {
    throw new Error('Expected at least one case study fixture in @data/caseStudies');
  }

  it('wraps the hero image in a box whose aspect-ratio matches the intrinsic size', () => {
    renderInProviders(<CaseStudyCard caseStudy={caseStudy} />);

    const img = screen.getByRole('img', { name: caseStudy.hero.alt }) as HTMLImageElement;

    // The <img> carries explicit intrinsic dimensions so space is reserved.
    expect(img).toHaveAttribute('width', String(caseStudy.hero.width));
    expect(img).toHaveAttribute('height', String(caseStudy.hero.height));
    // Lazy + async decode keeps the image off the critical path without CLS.
    expect(img).toHaveAttribute('loading', 'lazy');

    // The direct wrapper reserves the aspect ratio from the intrinsic size.
    const wrapper = img.parentElement as HTMLElement;
    expect(wrapper.style.aspectRatio).toBe(
      `${caseStudy.hero.width} / ${caseStudy.hero.height}`,
    );
  });
});

describe('CardImage keeps the reserved box on load failure (Req 42.3)', () => {
  const baseImage = (overrides: Partial<ImageAsset> = {}): ImageAsset => ({
    src: 'https://cdn.ryze.test/hero.jpg',
    width: 1600,
    height: 900,
    alt: 'Reserved box hero',
    ...overrides,
  });

  it('swaps to the LQIP blurDataURL on error while preserving the aspect box', () => {
    const image = baseImage({ blurDataURL: 'data:image/png;base64,LQIP' });
    const { container } = render(<CardImage image={image} />);

    const img = screen.getByRole('img', { name: 'Reserved box hero' }) as HTMLImageElement;
    const wrapper = img.parentElement as HTMLElement;
    expect(wrapper.style.aspectRatio).toBe('1600 / 900');

    fireEvent.error(img);

    // The src degrades to the LQIP, and the reserved box is unchanged (no CLS).
    expect(img.getAttribute('src')).toBe('data:image/png;base64,LQIP');
    const stillWrapper = container.firstElementChild as HTMLElement;
    expect(stillWrapper.style.aspectRatio).toBe('1600 / 900');
  });

  it('falls back to a solid placeholder (no LQIP) while preserving the aspect box', () => {
    const image = baseImage(); // no blurDataURL
    const { container } = render(<CardImage image={image} />);

    const img = screen.getByRole('img', { name: 'Reserved box hero' });
    fireEvent.error(img);

    // The reserved aspect box is still the root element after the swap.
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.aspectRatio).toBe('1600 / 900');

    // The broken <img> is replaced by the labelled placeholder fill.
    const placeholder = container.querySelector('[data-card-image-placeholder="true"]');
    expect(placeholder).not.toBeNull();
    expect(wrapper.contains(placeholder)).toBe(true);
  });
});
