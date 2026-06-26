/**
 * Tests for the useViewportCategory hook.
 *
 * Drives the hook by mocking `window.innerWidth` and dispatching `resize`
 * events, asserting the derived category tracks breakpoint transitions through
 * the `viewportCategory` source of truth.
 *
 * Framework: Vitest + @testing-library/react.
 * Requirements: 35.1, 2.1
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useViewportCategory } from './useViewportCategory';

/** Set the mocked viewport width. */
function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
}

/** Pending rAF callbacks, flushed manually to mirror real async timing. */
let rafQueue: FrameRequestCallback[] = [];

/** Fire a resize event and flush the rAF-batched measurement. */
function fireResize(): void {
  act(() => {
    window.dispatchEvent(new Event('resize'));
    // Flush queued animation frames so the batched measurement applies. This
    // runs after the rAF handle has been assigned, matching real browsers.
    const pending = rafQueue;
    rafQueue = [];
    for (const cb of pending) {
      cb(performance.now());
    }
  });
}

describe('useViewportCategory', () => {
  beforeEach(() => {
    rafQueue = [];
    // Queue rAF callbacks so they run after the handle is assigned (async-like),
    // then flush them explicitly via fireResize().
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback): number => {
      rafQueue.push(cb);
      return rafQueue.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the category for the current width on mount', () => {
    setWidth(800); // tablet band [768, 1024)
    const { result } = renderHook(() => useViewportCategory());
    expect(result.current).toBe('tablet');
  });

  it('classifies each breakpoint band correctly', () => {
    const cases: Array<[number, string]> = [
      [320, 'mobile'],
      [767, 'mobile'],
      [768, 'tablet'],
      [1023, 'tablet'],
      [1024, 'desktop'],
      [1535, 'desktop'],
      [1536, 'wide'],
      [2560, 'wide'],
    ];

    for (const [width, expected] of cases) {
      setWidth(width);
      const { result, unmount } = renderHook(() => useViewportCategory());
      expect(result.current).toBe(expected);
      unmount();
    }
  });

  it('updates the category when the viewport crosses a breakpoint', () => {
    setWidth(500); // mobile
    const { result } = renderHook(() => useViewportCategory());
    expect(result.current).toBe('mobile');

    setWidth(1200); // desktop
    fireResize();
    expect(result.current).toBe('desktop');

    setWidth(1600); // wide
    fireResize();
    expect(result.current).toBe('wide');
  });

  it('removes its resize listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    setWidth(900);
    const { unmount } = renderHook(() => useViewportCategory());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore();
  });
});
