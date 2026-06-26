// @ts-check
/**
 * Unit tests for the pure bundle-budget predicates (task 16.4).
 *
 * The canonical guard `scripts/check-bundle-budget.mjs` reads the real `dist/`
 * build, gzips the entry chunk(s) and calls `process.exit`, so it cannot be
 * unit-tested directly without a build. These tests exercise the pure decision
 * helpers extracted into `scripts/bundle-budget-lib.mjs`, which mirror the
 * guard's thresholds and forbidden-token contract exactly.
 *
 * Requirements: 39.1 (initial route JS ≤ 180 KB gzip; no three/R3F in the entry
 * chunk), 5.4 (heavy deps split below the route boundary).
 *
 * Framework: Vitest (runs `.mjs` test files, matching generate-sitemap.test.mjs).
 */
import { describe, it, expect } from 'vitest';

import {
  BUDGET_GZIP_BYTES,
  FORBIDDEN_ENTRY_TOKENS,
  isWithinBudget,
  findForbiddenTokens,
  entryHasForbiddenModule,
} from './bundle-budget-lib.mjs';

describe('budget constant', () => {
  it('is the spec budget of 180 KB gzip (Requirement 39.1)', () => {
    expect(BUDGET_GZIP_BYTES).toBe(180 * 1024);
  });

  it('lists the heavy WebGL markers that must stay out of the entry chunk', () => {
    expect(FORBIDDEN_ENTRY_TOKENS).toEqual([
      'THREE.',
      'react-three',
      '@react-three/fiber',
    ]);
  });
});

describe('isWithinBudget', () => {
  it('passes when comfortably under budget', () => {
    expect(isWithinBudget(120 * 1024)).toBe(true);
  });

  it('passes exactly at the budget (≤, not <)', () => {
    expect(isWithinBudget(BUDGET_GZIP_BYTES)).toBe(true);
  });

  it('fails one byte over the budget', () => {
    expect(isWithinBudget(BUDGET_GZIP_BYTES + 1)).toBe(false);
  });

  it('honours an explicit budget argument', () => {
    expect(isWithinBudget(50, 49)).toBe(false);
    expect(isWithinBudget(50, 50)).toBe(true);
  });
});

describe('findForbiddenTokens / entryHasForbiddenModule', () => {
  it('reports a clean entry chunk as having no forbidden modules', () => {
    const clean = 'import{r as e}from"./vendor.js";const a=1;export{a};';
    expect(findForbiddenTokens(clean)).toEqual([]);
    expect(entryHasForbiddenModule(clean)).toBe(false);
  });

  it('detects three.js leaking into the entry chunk (THREE. namespace)', () => {
    const dirty = 'const s=new THREE.Scene();';
    expect(entryHasForbiddenModule(dirty)).toBe(true);
    expect(findForbiddenTokens(dirty)).toContain('THREE.');
  });

  it('detects react-three-fiber leaking into the entry chunk', () => {
    const dirty = 'warning: @react-three/fiber requires a Canvas';
    expect(entryHasForbiddenModule(dirty)).toBe(true);
    // Both the bare "react-three" substring and the package specifier match.
    expect(findForbiddenTokens(dirty)).toEqual(
      expect.arrayContaining(['react-three', '@react-three/fiber']),
    );
  });

  it('returns matches in token-list order when several are present', () => {
    const dirty = 'THREE. ... react-three ... @react-three/fiber';
    expect(findForbiddenTokens(dirty)).toEqual([
      'THREE.',
      'react-three',
      '@react-three/fiber',
    ]);
  });
});
