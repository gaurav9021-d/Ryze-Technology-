/**
 * HeroForeground — Solar-system orbital card system.
 *
 * Three concentric elliptical orbits (A=large/slow, B=medium, C=small/fast)
 * each carry two cards placed exactly 180° apart for perfect visual balance.
 * All six cards orbit continuously around the "Design. Develop. Grow." headline.
 *
 * True 3D depth without any separate layer divs:
 *   – Upper arc of orbit (card moving away from viewer) → z-index: 5  → BEHIND headline (z-10)
 *   – Lower arc of orbit (card approaching viewer)      → z-index: 15 → IN FRONT of headline (z-10)
 *   – z-index is switched only on threshold crossing to avoid per-frame style thrash
 *
 * Depth is further reinforced by scale: cards shrink at the back (0.90) and
 * grow at the front (1.10), matching natural perspective.
 *
 * 36 waypoints per orbit approximates a smooth ellipse without MotionPathPlugin.
 * Hidden below md (768 px) — mobile sees only the WebGL ambient layer.
 */
import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { heroMidCards, heroFrontCards } from '@data/heroCards';

// ---------------------------------------------------------------------------
// Orbit ring definitions
// ---------------------------------------------------------------------------

interface Orbit { rxF: number; ryF: number; dur: number }

const ORBITS: Orbit[] = [
  { rxF: 0.42, ryF: 0.34, dur: 22 },  // A — large, slow   (22 s / rev)
  { rxF: 0.28, ryF: 0.22, dur: 14 },  // B — medium         (14 s / rev)
  { rxF: 0.16, ryF: 0.13, dur:  9 },  // C — small, fast    ( 9 s / rev)
];

// Headline centre (fraction of viewport)
const CX_F = 0.50;
const CY_F = 0.42;

// Steps per full orbit — 36 gives a smooth 10°-per-segment polygon
const STEPS = 36;

// ---------------------------------------------------------------------------
// Card manifest — 2 cards per orbit, 180° apart for even distribution
// ---------------------------------------------------------------------------

interface CardDef {
  src: string;
  alt: string;
  w: number;
  h: number;
  orbit: number;    // index into ORBITS
  startDeg: number; // angle on the orbit at t = 0
  tilt: number;     // fixed visual rotation (degrees)
}

const CARDS: CardDef[] = [
  // ── Orbit A  (large ring, 22 s) ─────────────────────────────────────────
  {
    src: heroMidCards[1]!.src, alt: heroMidCards[1]!.alt,
    w: 258, h: 194, orbit: 0, startDeg:   0, tilt: -6,
  },
  {
    src: heroMidCards[0]!.src, alt: heroMidCards[0]!.alt,
    w: 200, h: 200, orbit: 0, startDeg: 180, tilt:  8,
  },
  // ── Orbit B  (medium ring, 14 s) ────────────────────────────────────────
  {
    src: heroFrontCards[0]!.src, alt: heroFrontCards[0]!.alt,
    w: 228, h: 228, orbit: 1, startDeg:  90, tilt: -8,
  },
  {
    src: heroMidCards[2]!.src, alt: heroMidCards[2]!.alt,
    w: 165, h: 220, orbit: 1, startDeg: 270, tilt:  7,
  },
  // ── Orbit C  (small ring, 9 s) ──────────────────────────────────────────
  {
    src: heroFrontCards[1]!.src, alt: heroFrontCards[1]!.alt,
    w: 170, h: 227, orbit: 2, startDeg:  45, tilt: -10,
  },
  {
    src: heroFrontCards[2]!.src, alt: heroFrontCards[2]!.alt,
    w: 210, h: 210, orbit: 2, startDeg: 225, tilt:   5,
  },
];

// ---------------------------------------------------------------------------
// Orbit engine
// ---------------------------------------------------------------------------

function launchOrbit(el: HTMLElement, def: CardDef, W: number, H: number): void {
  const cx   = W * CX_F;
  const cy   = H * CY_F;
  const orb  = ORBITS[def.orbit]!;
  const rx   = W * orb.rxF;
  const ry   = H * orb.ryF;
  const sDur = orb.dur / STEPS;

  // ── Initial position ────────────────────────────────────────────────────
  const startRad = (def.startDeg * Math.PI) / 180;
  gsap.set(el, {
    x:        cx + rx * Math.cos(startRad) - def.w / 2,
    y:        cy + ry * Math.sin(startRad) - def.h / 2,
    rotation: def.tilt,
    scale:    1 + 0.10 * Math.sin(startRad),
  });

  // ── 36-waypoint orbital timeline ─────────────────────────────────────────
  const tl = gsap.timeline({ repeat: -1 });

  for (let i = 1; i <= STEPS; i++) {
    const rad   = ((def.startDeg + (i / STEPS) * 360) * Math.PI) / 180;
    const x     = cx + rx * Math.cos(rad) - def.w / 2;
    const y     = cy + ry * Math.sin(rad) - def.h / 2;
    // scale: 0.90 at top of orbit (back), 1.10 at bottom (front)
    const scale = 1 + 0.10 * Math.sin(rad);

    tl.to(el, { x, y, scale, duration: sDur, ease: 'none' });
  }

  // ── Dynamic z-index — only update on threshold crossing ─────────────────
  // Upper arc (sin < 0, card moving away): z=5  → behind  headline (z-10)
  // Lower arc (sin ≥ 0, card approaching): z=15 → in front of headline
  let isFront: boolean | null = null;

  tl.eventCallback('onUpdate', () => {
    const cardCenterY = (gsap.getProperty(el, 'y') as number) + def.h / 2;
    const nowFront    = cardCenterY >= cy;
    if (nowFront !== isFront) {
      isFront          = nowFront;
      el.style.zIndex  = nowFront ? '15' : '5';
    }
  });
}

// ---------------------------------------------------------------------------
// Shared card shell style
// ---------------------------------------------------------------------------

const shellStyle = (w: number, h: number): CSSProperties => ({
  position:      'absolute',
  left:          0,
  top:           0,
  width:         w,
  height:        h,
  zIndex:        5,          // behind headline until onUpdate promotes it
  borderRadius:  14,
  overflow:      'hidden',
  border:        '1px solid rgba(255,255,255,0.18)',
  boxShadow:     '6px -4px 44px rgba(0,0,0,0.54)',
  willChange:    'transform',
  pointerEvents: 'none',
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroForeground(): JSX.Element {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // gsap.context() captures every tween/timeline created inside so
    // ctx.revert() cleanly kills all animations on unmount.
    const ctx = gsap.context(() => {
      CARDS.forEach((def, i) => {
        const el = refs.current[i];
        if (!el) return;
        launchOrbit(el, def, W, H);
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    /*
     * NO z-index on this wrapper → z-index: auto → does NOT create a new
     * stacking context.  Each card's inline z-index (5 or 15) is therefore
     * evaluated directly in the section's stacking context, placing it below
     * or above the z-10 headline content div as needed.
     */
    <div
      className="pointer-events-none absolute inset-0 hidden md:block"
      aria-hidden="true"
    >
      {CARDS.map((def, i) => (
        <div
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          style={shellStyle(def.w, def.h)}
        >
          <img
            src={def.src}
            alt={def.alt}
            draggable={false}
            style={{
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              display:    'block',
              userSelect: 'none',
            }}
          />
        </div>
      ))}
    </div>
  );
}
