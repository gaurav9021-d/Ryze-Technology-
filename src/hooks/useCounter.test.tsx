/**
 * Tests for the useCounter hook.
 *
 * Mocks `useReducedMotion` to toggle the motion branch and drives
 * `requestAnimationFrame` manually via a controllable clock so the tween's
 * frames can be stepped deterministically. Asserts the reduced-motion instant
 * value (Req 37.2), that intermediate frames stay within `[from, target]`
 * (Req 21.3), and that the animation lands exactly on `target` (Req 21.2).
 *
 * Framework: Vitest + @testing-library/react.
 * Requirements: 21.1, 21.2, 21.3, 37.2
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useCounter } from './useCounter';

// Toggle for the mocked reduced-motion preference.
let mockReducedMotion = false;
vi.mock('./useReducedMotion', () => ({
  useReducedMotion: () => mockReducedMotion,
}));

/** Controllable requestAnimationFrame: callbacks fire when `step` is called. */
class RafClock {
  private callbacks = new Map<number, FrameRequestCallback>();
  private nextId = 1;
  now = 0;

  install(): void {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      const id = this.nextId++;
      this.callbacks.set(id, cb);
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      this.callbacks.delete(id);
    });
  }

  /** Advance time by `ms` and flush all currently-pending frame callbacks. */
  step(ms: number): void {
    this.now += ms;
    const pending = [...this.callbacks.entries()];
    this.callbacks.clear();
    act(() => {
      for (const [, cb] of pending) {
        cb(this.now);
      }
    });
  }

  get pendingCount(): number {
    return this.callbacks.size;
  }
}

describe('useCounter', () => {
  let clock: RafClock;

  beforeEach(() => {
    mockReducedMotion = false;
    clock = new RafClock();
    clock.install();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the target immediately under reduced motion (Req 37.2)', () => {
    mockReducedMotion = true;
    const { result } = renderHook(() => useCounter(100, { from: 0 }));
    expect(result.current).toBe(100);
    // No animation frames should be scheduled.
    expect(clock.pendingCount).toBe(0);
  });

  it('rounds the reduced-motion target to the configured decimals', () => {
    mockReducedMotion = true;
    const { result } = renderHook(() =>
      useCounter(99.567, { from: 0, decimals: 1 }),
    );
    expect(result.current).toBe(99.6);
  });

  it('starts at the from value before any frames run', () => {
    const { result } = renderHook(() =>
      useCounter(100, { from: 10, duration: 1000 }),
    );
    expect(result.current).toBe(10);
  });

  it('progresses within [from, target] and lands exactly on target (Req 21.2, 21.3)', () => {
    const from = 0;
    const target = 100;
    const { result } = renderHook(() =>
      useCounter(target, { from, duration: 1000 }),
    );

    const seen: number[] = [result.current];

    // Step through the tween in 100ms slices.
    for (let i = 0; i < 12 && clock.pendingCount > 0; i++) {
      clock.step(100);
      seen.push(result.current);
    }

    // Every observed value stays within the [from, target] range (Req 21.3).
    for (const v of seen) {
      expect(v).toBeGreaterThanOrEqual(from);
      expect(v).toBeLessThanOrEqual(target);
    }

    // The animation lands exactly on the target (Req 21.2).
    expect(result.current).toBe(target);
    // Once complete, no further frames are scheduled.
    expect(clock.pendingCount).toBe(0);
  });

  it('never displays a value outside the descending range (Req 21.3)', () => {
    const from = 50;
    const target = 10;
    const { result } = renderHook(() =>
      useCounter(target, { from, duration: 1000 }),
    );

    for (let i = 0; i < 12 && clock.pendingCount > 0; i++) {
      clock.step(100);
      expect(result.current).toBeLessThanOrEqual(from);
      expect(result.current).toBeGreaterThanOrEqual(target);
    }

    expect(result.current).toBe(target);
  });

  it('holds at the from value while start is false', () => {
    const { result } = renderHook(() =>
      useCounter(100, { from: 5, duration: 1000, start: false }),
    );
    expect(result.current).toBe(5);
    // No animation should be scheduled while paused.
    expect(clock.pendingCount).toBe(0);
  });

  it('cancels the pending frame on unmount', () => {
    const { unmount } = renderHook(() =>
      useCounter(100, { from: 0, duration: 1000 }),
    );
    expect(clock.pendingCount).toBeGreaterThan(0);
    unmount();
    expect(clock.pendingCount).toBe(0);
  });
});
