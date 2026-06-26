/**
 * Tests for the useMagnetic hook.
 *
 * Verifies the reduced-motion no-op (no listeners, x/y stay 0 — Requirement
 * 23.2) and that pointer listeners are attached and translate toward the
 * pointer scaled by strength when motion is allowed (Requirement 23.1).
 *
 * Framework: Vitest + @testing-library/react.
 * Requirements: 23.1, 23.2
 */
import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ReducedMotionContext } from '@providers/ReducedMotionProvider';

// Make the spring an identity pass-through so the pointer math is observable
// synchronously, without depending on framer-motion's frame loop (which does
// not advance in jsdom). useMotionValue stays real.
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...actual, useSpring: (source: unknown) => source };
});

import { useMagnetic } from './useMagnetic';

/** Wrap the hook in a reduced-motion context with the given preference. */
function makeWrapper(reducedMotion: boolean) {
  return function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <ReducedMotionContext.Provider value={reducedMotion}>
        {children}
      </ReducedMotionContext.Provider>
    );
  };
}

describe('useMagnetic', () => {
  it('is a no-op under reduced motion: no listeners, x/y stay 0', () => {
    const element = document.createElement('div');
    const addSpy = vi.spyOn(element, 'addEventListener');

    const { result } = renderHook(
      () => {
        const r = useMagnetic();
        if (r.ref.current === null) {
          // @ts-expect-error -- test wiring of the ref
          r.ref.current = element;
        }
        return r;
      },
      { wrapper: makeWrapper(true) },
    );

    expect(addSpy).not.toHaveBeenCalled();
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
  });

  it('attaches pointer listeners when motion is allowed', () => {
    const element = document.createElement('div');
    const addSpy = vi.spyOn(element, 'addEventListener');

    renderHook(
      () => {
        const r = useMagnetic();
        if (r.ref.current === null) {
          // @ts-expect-error -- test wiring of the ref
          r.ref.current = element;
        }
        return r;
      },
      { wrapper: makeWrapper(false) },
    );

    const events = addSpy.mock.calls.map((call) => call[0]);
    expect(events).toContain('pointermove');
    expect(events).toContain('pointerleave');
  });

  it('translates toward the pointer scaled by strength on pointermove', () => {
    const element = document.createElement('div');
    // Center the element at (100, 100) with a 200x200 box.
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    const strength = 0.5;
    const { result } = renderHook(
      () => {
        const r = useMagnetic(strength);
        if (r.ref.current === null) {
          // @ts-expect-error -- test wiring of the ref
          r.ref.current = element;
        }
        return r;
      },
      { wrapper: makeWrapper(false) },
    );

    act(() => {
      const event = new Event('pointermove') as PointerEvent;
      Object.defineProperty(event, 'clientX', { value: 200 });
      Object.defineProperty(event, 'clientY', { value: 100 });
      element.dispatchEvent(event);
    });

    // Pointer at (200,100), center (100,100): dx=100*0.5=50, dy=0.
    expect(result.current.x.get()).toBe(50);
    expect(result.current.y.get()).toBe(0);

    // pointerleave springs back to rest.
    act(() => {
      element.dispatchEvent(new Event('pointerleave'));
    });
    expect(result.current.x.get()).toBe(0);
    expect(result.current.y.get()).toBe(0);
  });
});
