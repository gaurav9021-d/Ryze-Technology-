/**
 * ProcessTimeline — the "How we work" steps with a scroll-drawn progress line.
 *
 * A brand-blue rail runs across the four steps and *fills* from left to right
 * as the section scrolls through the viewport (scrubbed to scroll progress via
 * GSAP ScrollTrigger), while each step marker lights up. It turns a static
 * 4-column list into a sequence the visitor watches advance.
 *
 * Motion contract:
 *  - Motion allowed → the fill bar's `scaleX` is driven 0 → 1 by scroll.
 *  - Reduced motion → the rail renders fully drawn and every step is active,
 *    with no scroll dependency.
 */
import type { RefObject } from 'react';
import { useReducedMotion } from '@hooks/useReducedMotion';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import { SectionHeader } from './SectionHeader';

export interface ProcessStep {
  title: string;
  detail: string;
}

export interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps): JSX.Element {
  const reducedMotion = useReducedMotion();

  const ref = useScrollAnimation(({ el, gsap, reducedMotion: rm }) => {
    if (rm) return;
    const fill = el.querySelector<HTMLElement>('[data-fill]');
    const markers = gsap.utils.toArray<HTMLElement>('[data-marker]', el);
    if (fill === null) return;

    gsap.fromTo(
      fill,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          end: 'bottom 70%',
          scrub: 0.5,
        },
      },
    );

    // Light each marker as the line reaches it.
    markers.forEach((marker, index) => {
      gsap.fromTo(
        marker,
        { backgroundColor: 'var(--ink-600)', scale: 1 },
        {
          backgroundColor: 'var(--pulse-500)',
          scale: 1.35,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'bottom 70%',
            scrub: 0.5,
            onUpdate: (self) => {
              const active = self.progress >= index / steps.length;
              marker.style.backgroundColor = active
                ? 'var(--pulse-500)'
                : 'var(--ink-600)';
            },
          },
        },
      );
    });
  }, [steps.length]);

  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      aria-label="How we work"
      className="border-y border-ink-600 bg-ink-800"
    >
      <div className="mx-auto w-full max-w-site px-6 py-[clamp(6rem,14vh,11rem)] sm:px-10">
        <SectionHeader eyebrow="How we work" title="A process you can see" />

        <div className="relative mt-16">
          {/* Progress rail (track + scroll-driven fill). */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] bg-ink-600"
          />
          <div
            data-fill=""
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] origin-left bg-pulse-500"
            style={{ transform: reducedMotion ? 'scaleX(1)' : 'scaleX(0)' }}
          />

          <ol className="grid gap-x-10 gap-y-12 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    data-marker=""
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: reducedMotion
                        ? 'var(--pulse-500)'
                        : 'var(--ink-600)',
                    }}
                  />
                  <span className="font-mono text-mono-eyebrow uppercase tracking-[0.2em] text-pulse-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-semibold text-mist-100">
                  {step.title}
                </h3>
                <p className="font-sans text-body text-mist-300">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default ProcessTimeline;
