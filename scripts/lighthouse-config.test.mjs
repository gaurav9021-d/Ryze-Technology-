// @ts-check
/**
 * Lighthouse CI "smoke" contract test (task 16.4).
 *
 * A real `lhci autorun` needs a built + served site and a Chrome binary, which
 * is far too heavy and flaky to run inside the unit suite. Instead this test
 * asserts the deliverable — `lighthouserc.cjs` — exists and encodes the
 * performance/quality thresholds from the design's performance budget, so a
 * regression to the config is caught cheaply and deterministically.
 *
 * Requirements: 39.6
 *   - Content pages target Performance ≥ 0.95; the homepage defers the WebGL
 *     scene so its baseline floor is ≥ 0.85 (used as the hard CI floor).
 *   - Accessibility, Best Practices, and SEO target ≥ 0.95 on every page.
 *
 * Framework: Vitest (runs `.mjs` test files).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const configPath = resolve(projectRoot, 'lighthouserc.cjs');

const require = createRequire(import.meta.url);

describe('lighthouserc.cjs exists and is loadable', () => {
  it('is present at the project root', () => {
    expect(existsSync(configPath)).toBe(true);
  });

  it('exports a valid LHCI config shape', () => {
    /** @type {any} */
    const config = require(configPath);
    expect(config).toBeTypeOf('object');
    expect(config.ci).toBeTypeOf('object');
    expect(config.ci.assert).toBeTypeOf('object');
    expect(config.ci.assert.assertions).toBeTypeOf('object');
  });
});

describe('encoded quality thresholds (Requirement 39.6)', () => {
  /** @type {any} */
  const config = require(configPath);
  const assertions = config.ci.assert.assertions;

  /** @param {[string, { minScore: number }]} assertion */
  const minScoreOf = (assertion) => assertion[1].minScore;

  it('enforces the homepage performance floor of 0.85 as the hard CI gate', () => {
    expect(minScoreOf(assertions['categories:performance'])).toBe(0.85);
  });

  it('enforces accessibility ≥ 0.95', () => {
    expect(minScoreOf(assertions['categories:accessibility'])).toBe(0.95);
  });

  it('enforces best-practices ≥ 0.95', () => {
    expect(minScoreOf(assertions['categories:best-practices'])).toBe(0.95);
  });

  it('enforces SEO ≥ 0.95', () => {
    expect(minScoreOf(assertions['categories:seo'])).toBe(0.95);
  });
});

describe('documented content-page target (Requirement 39.6)', () => {
  // The 0.95 content-page Performance target lives as a documented note in the
  // config header (the hard assertion uses the 0.85 homepage floor so the
  // deferred-WebGL homepage does not fail CI). Assert the contract is recorded.
  const source = readFileSync(configPath, 'utf8');

  it('records the content-page Performance ≥ 0.95 target in the config', () => {
    expect(source).toMatch(/Performance >= 0\.95|Performance >= 95/);
  });

  it('audits representative content routes plus the homepage', () => {
    /** @type {any} */
    const config = require(configPath);
    const urls = config.ci.collect.url;
    expect(urls).toContain('index.html');
    expect(urls.some((/** @type {string} */ u) => u !== 'index.html')).toBe(true);
  });
});
