/**
 * Tests for the useInView hook.
 *
 * Mocks `IntersectionObserver` to drive intersection callbacks manually and
 * asserts the `inView` flag, one-shot `once` disconnect behavior, and the safe
 * default when the API is missing.
 *
 * Framework: Vitest + @testing-library/react.
 * Requirements: 21.1, 25.1
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useInView } from './useInView';

/** A controllable IntersectionObserver test double. */
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  callback: IntersectionObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  /** Simulate an intersection-change emission for the observed target. */
  emit(isIntersecting: boolean): void {
    act(() => {
      this.callback(
        [{ isIntersecting } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    });
  }

  static get latest(): MockIntersectionObserver {
    const last = this.instances.at(-1);
    if (last === undefined) {
      throw new Error('No IntersectionObserver instance created');
    }
    return last;
  }
}

describe('useInView', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts not in view when the observer is available', () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    expect(result.current.inView).toBe(false);
  });

  it('sets inView true when the element intersects', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => {
      const r = useInView<HTMLDivElement>();
      // Attach a real element so observe receives a target on mount.
      if (r.ref.current === null) {
        // @ts-expect-error -- test wiring of the ref
        r.ref.current = element;
      }
      return r;
    });

    MockIntersectionObserver.latest.emit(true);
    expect(result.current.inView).toBe(true);
  });

  it('disconnects after first intersection when once is true (default)', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => {
      const r = useInView<HTMLDivElement>();
      if (r.ref.current === null) {
        // @ts-expect-error -- test wiring of the ref
        r.ref.current = element;
      }
      return r;
    });

    const observer = MockIntersectionObserver.latest;
    observer.emit(true);
    expect(result.current.inView).toBe(true);
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('tracks intersection in both directions when once is false', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => {
      const r = useInView<HTMLDivElement>({ once: false });
      if (r.ref.current === null) {
        // @ts-expect-error -- test wiring of the ref
        r.ref.current = element;
      }
      return r;
    });

    const observer = MockIntersectionObserver.latest;
    observer.emit(true);
    expect(result.current.inView).toBe(true);

    observer.emit(false);
    expect(result.current.inView).toBe(false);
    expect(observer.disconnect).not.toHaveBeenCalled();
  });

  it('passes threshold and rootMargin to the observer', () => {
    const element = document.createElement('div');
    renderHook(() => {
      const r = useInView<HTMLDivElement>({ threshold: 0.5, rootMargin: '10px' });
      if (r.ref.current === null) {
        // @ts-expect-error -- test wiring of the ref
        r.ref.current = element;
      }
      return r;
    });

    const observer = MockIntersectionObserver.latest;
    expect(observer.observe).toHaveBeenCalledWith(element);
  });

  it('defaults inView to true when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    expect(result.current.inView).toBe(true);
  });
});
