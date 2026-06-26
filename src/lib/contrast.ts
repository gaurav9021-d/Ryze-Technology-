/**
 * Pure, dependency-free WCAG 2.1 contrast helpers.
 *
 * Implements the relative-luminance and contrast-ratio formulae defined by the
 * W3C in WCAG 2.1 (success criterion 1.4.3 "Contrast (Minimum)"). Used by the
 * token contrast tests to assert the design's documented colour pairings meet
 * WCAG AA (Requirement 36.2).
 *
 * Reference: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 *
 * The module is intentionally framework- and DOM-free so it can be unit-tested
 * in isolation and reused anywhere (including a future server-side a11y gate).
 *
 * _Requirements: 36.2_
 */

/** An sRGB colour as three 8-bit channels in the inclusive range `0..255`. */
export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/**
 * Parse a hex colour string into 8-bit RGB channels.
 *
 * Accepts `#rgb`, `#rrggbb`, and the same forms without the leading `#`
 * (case-insensitive). 3-digit shorthand is expanded by doubling each nibble
 * (e.g. `#0af` → `#00aaff`).
 *
 * @param hex - A CSS hex colour such as `#070A12`, `070a12`, or `#0af`.
 * @returns The parsed {@link Rgb} channels.
 * @throws If the string is not a valid 3- or 6-digit hex colour.
 */
export function hexToRgb(hex: string): Rgb {
  const cleaned = hex.trim().replace(/^#/, '').toLowerCase();

  let normalized: string;
  if (/^[0-9a-f]{3}$/.test(cleaned)) {
    // Expand shorthand: each nibble is doubled.
    normalized = cleaned
      .split('')
      .map((nibble) => nibble + nibble)
      .join('');
  } else if (/^[0-9a-f]{6}$/.test(cleaned)) {
    normalized = cleaned;
  } else {
    throw new Error(`Invalid hex colour: "${hex}"`);
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

/**
 * Linearize a single 8-bit sRGB channel per the WCAG transfer function.
 *
 * @param channel - An sRGB channel value in `0..255`.
 * @returns The linear-light channel value in `0..1`.
 */
function linearizeChannel(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/**
 * Compute the WCAG relative luminance of a colour.
 *
 * @param hex - A CSS hex colour (`#rrggbb`, `#rgb`, with or without `#`).
 * @returns The relative luminance `L` in the inclusive range `0..1`
 *   (0 = black, 1 = white).
 */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const rl = linearizeChannel(r);
  const gl = linearizeChannel(g);
  const bl = linearizeChannel(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/**
 * Compute the WCAG contrast ratio between two colours.
 *
 * The result is symmetric in its arguments and lies in the inclusive range
 * `1..21` (1:1 for identical colours, 21:1 for pure black against pure white).
 *
 * @param hexA - First colour.
 * @param hexB - Second colour.
 * @returns The contrast ratio `(Llighter + 0.05) / (Ldarker + 0.05)`.
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const la = relativeLuminance(hexA);
  const lb = relativeLuminance(hexB);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}
