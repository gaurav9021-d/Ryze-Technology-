/**
 * HeroForeground — GSAP closed-orbit card system with variable speed.
 *
 * Each card follows a closed 4-point orbit that stays within the hero viewport.
 * Speed is deliberately variable:
 *   • Approaching the headline zone  → power2.out (decelerates)
 *   • Over the headline words        → linear, long duration (lingers)
 *   • Leaving the headline zone      → power2.in (accelerates away)
 *   • Return leg to orbit start      → power1.inOut (smooth)
 *
 * Word coverage (approximate, based on centred headline at ~5.2vw):
 *   "Design."  → x: W×0.15–0.39,  y: H×0.38–0.46
 *   "Develop." → x: W×0.39–0.63,  y: H×0.38–0.46
 *   "Grow."    → x: W×0.63–0.85,  y: H×0.38–0.46
 *
 * Layer pairs per word:
 *   "Design."  → M1 behind  + F2 in front
 *   "Develop." → M3 behind  + F3 in front
 *   "Grow."    → M2 behind  + F1 in front
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { heroMidCards, heroFrontCards } from '@data/heroCards';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CardSpec {
  src: string;
  alt: string;
  width: number;
  height: number;
  initPos: (W: number, H: number) => gsap.TweenVars;
  buildTl: (el: HTMLElement, W: number, H: number) => gsap.core.Timeline;
}

// ---------------------------------------------------------------------------
// Mid-layer specs  (z = 5 → BEHIND headline)
// ---------------------------------------------------------------------------

const MID_SPECS: CardSpec[] = [
  {
    // dev-design (square) — orbits left side, lingers at "Design."
    src: heroMidCards[0]!.src,
    alt: heroMidCards[0]!.alt,
    width: 200,
    height: 200,
    initPos: (W, H) => ({ x: W * 0.05, y: H * 0.70, rotation: 0, scale: 1 }),
    buildTl: (el, W, H) =>
      gsap.timeline({ repeat: -1, delay: 0 })
        // Approach from lower-left → near "Design."
        .to(el, { x: W * 0.10, y: H * 0.44, rotation:  5, scale: 1.00, duration: 2.5, ease: 'power2.out' })
        // SLOW — linger over "Design." (behind text)
        .to(el, { x: W * 0.28, y: H * 0.41, rotation:  8, scale: 1.03, duration: 5.5, ease: 'none' })
        // Accelerate away to upper-left
        .to(el, { x: W * 0.06, y: H * 0.20, rotation:  3, scale: 0.97, duration: 3.0, ease: 'power2.in' })
        // Return to orbit start
        .to(el, { x: W * 0.05, y: H * 0.70, rotation:  0, scale: 1.00, duration: 3.5, ease: 'power1.inOut' }),
  },
  {
    // developers (landscape) — orbits right side, lingers at "Grow."
    src: heroMidCards[1]!.src,
    alt: heroMidCards[1]!.alt,
    width: 258,
    height: 194,
    initPos: (W, H) => ({ x: W * 0.75, y: H * 0.74, rotation: 0, scale: 1 }),
    buildTl: (el, W, H) =>
      gsap.timeline({ repeat: -1, delay: 5 })
        // Approach from lower-right → near "Grow."
        .to(el, { x: W * 0.68, y: H * 0.44, rotation: -6, scale: 1.00, duration: 3.0, ease: 'power2.out' })
        // SLOW — linger over "Grow." (behind text)
        .to(el, { x: W * 0.72, y: H * 0.41, rotation: -9, scale: 1.03, duration: 5.5, ease: 'none' })
        // Accelerate away to upper-right
        .to(el, { x: W * 0.84, y: H * 0.18, rotation: -4, scale: 0.97, duration: 3.5, ease: 'power2.in' })
        // Return to orbit start
        .to(el, { x: W * 0.75, y: H * 0.74, rotation:  0, scale: 1.00, duration: 3.5, ease: 'power1.inOut' }),
  },
  {
    // social-marketing (portrait) — orbits bottom-center, lingers at "Develop."
    src: heroMidCards[2]!.src,
    alt: heroMidCards[2]!.alt,
    width: 165,
    height: 220,
    initPos: (W, H) => ({ x: W * 0.50, y: H * 0.80, rotation: 0, scale: 1 }),
    buildTl: (el, W, H) =>
      gsap.timeline({ repeat: -1, delay: 10 })
        // Approach from bottom-center → near "Develop."
        .to(el, { x: W * 0.56, y: H * 0.50, rotation:  6, scale: 1.00, duration: 2.5, ease: 'power2.out' })
        // SLOW — linger over "Develop." (behind text)
        .to(el, { x: W * 0.52, y: H * 0.40, rotation:  9, scale: 1.03, duration: 5.5, ease: 'none' })
        // Accelerate away to lower-left
        .to(el, { x: W * 0.34, y: H * 0.54, rotation:  4, scale: 0.97, duration: 3.0, ease: 'power2.in' })
        // Return to orbit start
        .to(el, { x: W * 0.50, y: H * 0.80, rotation:  0, scale: 1.00, duration: 3.5, ease: 'power1.inOut' }),
  },
];

// ---------------------------------------------------------------------------
// Front-layer specs  (z = 20 → IN FRONT of headline)
// ---------------------------------------------------------------------------

const FRONT_SPECS: CardSpec[] = [
  {
    // strategic-ads (square) — orbits top-right, lingers in front of "Grow."
    src: heroFrontCards[0]!.src,
    alt: heroFrontCards[0]!.alt,
    width: 228,
    height: 228,
    initPos: (W, H) => ({ x: W * 0.74, y: H * 0.10, rotation: 0, scale: 1 }),
    buildTl: (el, W, H) =>
      gsap.timeline({ repeat: -1, delay: 3 })
        // Descend from top-right → front of "Grow."
        .to(el, { x: W * 0.70, y: H * 0.36, rotation: -6, scale: 1.00, duration: 2.5, ease: 'power2.out' })
        // SLOW — linger in front of "Grow."
        .to(el, { x: W * 0.66, y: H * 0.41, rotation: -9, scale: 1.04, duration: 5.5, ease: 'none' })
        // Accelerate away to right
        .to(el, { x: W * 0.84, y: H * 0.28, rotation: -4, scale: 0.96, duration: 3.0, ease: 'power2.in' })
        // Return to orbit start
        .to(el, { x: W * 0.74, y: H * 0.10, rotation:  0, scale: 1.00, duration: 2.5, ease: 'power1.inOut' }),
  },
  {
    // brand-glowup (portrait) — orbits left side, lingers in front of "Design."
    src: heroFrontCards[1]!.src,
    alt: heroFrontCards[1]!.alt,
    width: 170,
    height: 227,
    initPos: (W, H) => ({ x: W * 0.04, y: H * 0.58, rotation: 0, scale: 1 }),
    buildTl: (el, W, H) =>
      gsap.timeline({ repeat: -1, delay: 8 })
        // Approach from left → front of "Design."
        .to(el, { x: W * 0.14, y: H * 0.42, rotation: -8, scale: 1.00, duration: 2.5, ease: 'power2.out' })
        // SLOW — linger in front of "Design."
        .to(el, { x: W * 0.20, y: H * 0.38, rotation: -11, scale: 1.04, duration: 5.5, ease: 'none' })
        // Accelerate away to upper-left
        .to(el, { x: W * 0.06, y: H * 0.22, rotation:  -5, scale: 0.96, duration: 3.0, ease: 'power2.in' })
        // Return to orbit start
        .to(el, { x: W * 0.04, y: H * 0.58, rotation:   0, scale: 1.00, duration: 3.5, ease: 'power1.inOut' }),
  },
  {
    // stopwatch (square) — orbits bottom-center, lingers in front of "Develop."
    src: heroFrontCards[2]!.src,
    alt: heroFrontCards[2]!.alt,
    width: 210,
    height: 210,
    initPos: (W, H) => ({ x: W * 0.42, y: H * 0.78, rotation: 0, scale: 1 }),
    buildTl: (el, W, H) =>
      gsap.timeline({ repeat: -1, delay: 14 })
        // Rise from bottom-center → front of "Develop."
        .to(el, { x: W * 0.40, y: H * 0.50, rotation:  7, scale: 1.00, duration: 2.5, ease: 'power2.out' })
        // SLOW — linger in front of "Develop."
        .to(el, { x: W * 0.38, y: H * 0.39, rotation: 10, scale: 1.04, duration: 5.5, ease: 'none' })
        // Accelerate away to lower-right
        .to(el, { x: W * 0.56, y: H * 0.60, rotation:  4, scale: 0.96, duration: 3.0, ease: 'power2.in' })
        // Return to orbit start
        .to(el, { x: W * 0.42, y: H * 0.78, rotation:  0, scale: 1.00, duration: 3.5, ease: 'power1.inOut' }),
  },
];

// ---------------------------------------------------------------------------
// Shared card style
// ---------------------------------------------------------------------------

const cardStyle = (w: number, h: number): React.CSSProperties => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: w,
  height: h,
  borderRadius: 14,
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '4px -5px 40px rgba(0,0,0,0.52)',
  willChange: 'transform',
  pointerEvents: 'none',
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroForeground(): JSX.Element {
  const midRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const frontRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const ctx = gsap.context(() => {
      MID_SPECS.forEach((spec, i) => {
        const el = midRefs.current[i];
        if (!el) return;
        gsap.set(el, spec.initPos(W, H));
        spec.buildTl(el, W, H);
      });
      FRONT_SPECS.forEach((spec, i) => {
        const el = frontRefs.current[i];
        if (!el) return;
        gsap.set(el, spec.initPos(W, H));
        spec.buildTl(el, W, H);
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Mid layer — orbits BEHIND the z-10 headline */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ zIndex: 5 }}
        aria-hidden="true"
      >
        {MID_SPECS.map((spec, i) => (
          <div
            key={i}
            ref={(el) => { midRefs.current[i] = el; }}
            style={cardStyle(spec.width, spec.height)}
          >
            <img
              src={spec.src}
              alt={spec.alt}
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }}
            />
          </div>
        ))}
      </div>

      {/* Front layer — orbits IN FRONT of the z-10 headline */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ zIndex: 20 }}
        aria-hidden="true"
      >
        {FRONT_SPECS.map((spec, i) => (
          <div
            key={i}
            ref={(el) => { frontRefs.current[i] = el; }}
            style={cardStyle(spec.width, spec.height)}
          >
            <img
              src={spec.src}
              alt={spec.alt}
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
