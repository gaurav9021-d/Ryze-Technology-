/**
 * Responsive layout + fluid-type token tests.
 *
 * Two concerns:
 *  1. `viewportCategory` maps representative widths to the documented breakpoint
 *     bands and the boundaries are ordered / contiguous / non-overlapping
 *     (Requirements 35.1, 35.2).
 *  2. The display/heading/body fluid-type tokens use CSS `clamp()` so type
 *     scales fluidly between viewports (Requirement 36.4). Read from the source
 *     of truth (`src/index.css`) and mirrored in `tailwind.config.ts`.
 *
 * Framework: Vitest.
 * Requirements: 35.1, 35.2, 36.4
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import { viewportCategory, VIEWPORT_BREAKPOINTS } from '@lib/viewport';
import type { ViewportCategory } from '@app-types';

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}

/** Extract a `--token: <value>;` declaration value from a CSS file. */
function readCssTokenValue(css: string, token: string): string {
  const pattern = new RegExp(`--${token}:\\s*([^;]+);`);
  const match = pattern.exec(css);
  if (match === null || match[1] === undefined) {
    throw new Error(`Token --${token} not found in source CSS`);
  }
  return match[1].trim();
}

describe('viewportCategory mapping (Requirement 35.1)', () => {
  const cases: ReadonlyArray<readonly [number, ViewportCategory]> = [
    [320, 'mobile'],
    [767, 'mobile'],
    [768, 'tablet'],
    [1023, 'tablet'],
    [1024, 'desktop'],
    [1440, 'desktop'],
    [1535, 'desktop'],
    [1536, 'wide'],
    [2560, 'wide'],
  ];

  it.each(cases)('classifies width %ipx as "%s"', (width, expected) => {
    expect(viewportCategory(width)).toBe(expected);
  });

  it('returns each documented breakpoint lower bound as its own category', () => {
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.mobile)).toBe('mobile');
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.tablet)).toBe('tablet');
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.desktop)).toBe('desktop');
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.wide)).toBe('wide');
  });

  it('coerces out-of-domain widths (negative / NaN) to the mobile band', () => {
    expect(viewportCategory(-100)).toBe('mobile');
    expect(viewportCategory(Number.NaN)).toBe('mobile');
  });
});

describe('viewport breakpoints are ordered and non-overlapping (Requirement 35.2)', () => {
  it('has strictly increasing lower bounds starting at 0', () => {
    const bounds = [
      VIEWPORT_BREAKPOINTS.mobile,
      VIEWPORT_BREAKPOINTS.tablet,
      VIEWPORT_BREAKPOINTS.desktop,
      VIEWPORT_BREAKPOINTS.wide,
    ];
    expect(bounds[0]).toBe(0);
    for (let i = 1; i < bounds.length; i++) {
      expect(bounds[i]!).toBeGreaterThan(bounds[i - 1]!);
    }
  });

  it('is monotonic: a larger width never maps to an earlier category', () => {
    const order: ViewportCategory[] = ['mobile', 'tablet', 'desktop', 'wide'];
    let lastIndex = -1;
    for (let width = 0; width <= 3000; width += 17) {
      const index = order.indexOf(viewportCategory(width));
      expect(index).toBeGreaterThanOrEqual(lastIndex);
      lastIndex = index;
    }
  });

  it('switches category exactly at each boundary (no overlap or gap)', () => {
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.tablet - 1)).toBe('mobile');
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.tablet)).toBe('tablet');
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.desktop - 1)).toBe('tablet');
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.desktop)).toBe('desktop');
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.wide - 1)).toBe('desktop');
    expect(viewportCategory(VIEWPORT_BREAKPOINTS.wide)).toBe('wide');
  });
});

describe('fluid type tokens use clamp() (Requirement 36.4)', () => {
  const css = readRepoFile('src/index.css');
  const tailwind = readRepoFile('tailwind.config.ts');

  const fluidTokens = ['fs-display-xl', 'fs-display-l', 'fs-h2', 'fs-h3', 'fs-body-l'];

  it.each(fluidTokens)('--%s is defined with clamp()', (token) => {
    const value = readCssTokenValue(css, token);
    expect(value).toContain('clamp(');
  });

  it('exposes the fluid font-size tokens through tailwind via var() references', () => {
    // Tailwind mirrors the CSS custom properties so utilities read identical
    // fluid values (the clamp lives in the :root token).
    expect(tailwind).toContain('var(--fs-display-xl)');
    expect(tailwind).toContain('var(--fs-display-l)');
    expect(tailwind).toContain('var(--fs-h2)');
    expect(tailwind).toContain('var(--fs-h3)');
    expect(tailwind).toContain('var(--fs-body-l)');
  });
});
