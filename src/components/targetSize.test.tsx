/**
 * Interactive target-size test.
 *
 * Requirement 36.3: interactive targets must be at least 44×44px. The shared
 * interactive primitive `MagneticButton` bakes this guarantee into its base
 * classes (`min-h-[44px] min-w-[44px]`). We render it (under a
 * `ReducedMotionProvider`, with a stubbed `matchMedia`) and assert the rendered
 * element carries the 44px minimum-size constraints in both the button and
 * anchor renderings.
 *
 * Framework: Vitest + @testing-library/react.
 * Requirements: 36.3
 */
import type { ReactElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MagneticButton } from '@components/MagneticButton';
import { ReducedMotionProvider } from '@providers/ReducedMotionProvider';
import { mockReducedMotion, resetMatchMedia } from '@/test/matchMedia';

afterEach(() => {
  resetMatchMedia();
});

function renderButton(ui: ReactElement) {
  return render(<ReducedMotionProvider>{ui}</ReducedMotionProvider>);
}

describe('MagneticButton target size (Requirement 36.3)', () => {
  it('guarantees a ≥44×44px hit area via min-h/min-w classes (button)', () => {
    mockReducedMotion(true);
    renderButton(<MagneticButton>Get in touch</MagneticButton>);

    const button = screen.getByRole('button', { name: 'Get in touch' });
    expect(button.className).toContain('min-h-[44px]');
    expect(button.className).toContain('min-w-[44px]');
  });

  it('keeps the 44px minimums when rendered as an anchor', () => {
    mockReducedMotion(true);
    renderButton(
      <MagneticButton as="a" href="/contact" ariaLabel="Contact us">
        Contact
      </MagneticButton>,
    );

    const link = screen.getByRole('link', { name: 'Contact us' });
    expect(link.className).toContain('min-h-[44px]');
    expect(link.className).toContain('min-w-[44px]');
  });

  it('preserves the 44px minimums when motion is allowed', () => {
    mockReducedMotion(false);
    renderButton(<MagneticButton>Explore</MagneticButton>);

    const button = screen.getByRole('button', { name: 'Explore' });
    expect(button.className).toContain('min-h-[44px]');
    expect(button.className).toContain('min-w-[44px]');
  });

  it('appends extra classes without dropping the size guarantee', () => {
    mockReducedMotion(true);
    renderButton(<MagneticButton className="mt-4">Sized</MagneticButton>);

    const button = screen.getByRole('button', { name: 'Sized' });
    expect(button.className).toContain('min-h-[44px]');
    expect(button.className).toContain('min-w-[44px]');
    expect(button.className).toContain('mt-4');
  });
});
