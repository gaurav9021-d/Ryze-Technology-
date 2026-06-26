// @ts-check
/**
 * Pure, side-effect-free predicates extracted for the bundle-budget guardrail
 * (task 16.4).
 *
 * The CANONICAL guard remains `scripts/check-bundle-budget.mjs` — that script is
 * the one wired into `npm run budget` / `npm run verify`, it owns reading the
 * real `dist/` output, gzipping the entry chunk(s), printing the report, and
 * calling `process.exit`. Its thresholds and behaviour are intentionally NOT
 * changed by this module.
 *
 * This file simply factors out the two pure decisions the guard makes so they
 * can be unit-tested without a real build or a `process.exit`:
 *   1. Is the (gzipped) initial route JS within the budget? (Requirement 39.1)
 *   2. Does the entry chunk's source text contain a forbidden heavy-WebGL
 *      marker (three / @react-three/fiber)? (Requirements 39.1, 5.4)
 *
 * The constants and the forbidden-token list mirror the canonical guard exactly
 * so the unit tests assert the same contract the guard enforces.
 */

/**
 * Initial route JS budget, in bytes (gzipped). Mirrors
 * `scripts/check-bundle-budget.mjs` (Requirement 39.1: initial bundle ≤ 180 KB
 * gzip).
 */
export const BUDGET_GZIP_BYTES = 180 * 1024;

/**
 * Tokens that, if present in the entry chunk's source text, indicate the heavy
 * WebGL stack (three / @react-three/fiber) was bundled into the entry chunk
 * instead of being split below the route boundary. Mirrors the canonical guard
 * (Requirements 39.1, 5.4).
 *
 * @type {readonly string[]}
 */
export const FORBIDDEN_ENTRY_TOKENS = Object.freeze([
  'THREE.',
  'react-three',
  '@react-three/fiber',
]);

/**
 * True when the gzipped initial route JS is at or below the budget.
 *
 * The guard treats strictly-greater-than as a violation, so the budget value
 * itself is considered within budget (≤, not <).
 *
 * @param {number} gzipBytes Measured gzip size of the initial route JS.
 * @param {number} [budgetBytes] Budget in bytes; defaults to {@link BUDGET_GZIP_BYTES}.
 * @returns {boolean}
 */
export function isWithinBudget(gzipBytes, budgetBytes = BUDGET_GZIP_BYTES) {
  return gzipBytes <= budgetBytes;
}

/**
 * Return the forbidden tokens found in a chunk's source text, in the order they
 * appear in the token list. Empty array means the chunk is clean.
 *
 * @param {string} chunkText The (minified) entry chunk source text.
 * @param {readonly string[]} [tokens] Token list; defaults to {@link FORBIDDEN_ENTRY_TOKENS}.
 * @returns {string[]}
 */
export function findForbiddenTokens(chunkText, tokens = FORBIDDEN_ENTRY_TOKENS) {
  return tokens.filter((token) => chunkText.includes(token));
}

/**
 * True when the entry chunk's source text contains any forbidden heavy-WebGL
 * marker — i.e. the route-boundary code-split regressed and three / R3F leaked
 * into the entry chunk.
 *
 * @param {string} chunkText The (minified) entry chunk source text.
 * @param {readonly string[]} [tokens] Token list; defaults to {@link FORBIDDEN_ENTRY_TOKENS}.
 * @returns {boolean}
 */
export function entryHasForbiddenModule(chunkText, tokens = FORBIDDEN_ENTRY_TOKENS) {
  return findForbiddenTokens(chunkText, tokens).length > 0;
}
