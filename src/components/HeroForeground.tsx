/**
 * HeroForeground — three DOM image cards that float IN FRONT of the hero
 * headline (z-20 > z-10 text layer > z-0 WebGL canvas).
 *
 * Each card uses Framer Motion with a unique y-oscillation, rotation range,
 * duration, and phase so no two cards move in sync. The visual result is a
 * floating 3D gallery where the headline exists in physical space between
 * the back (WebGL) and front (DOM) card layers.
 *
 * Cards are hidden below the `md` breakpoint to avoid cluttering mobile.
 * `pointer-events: none` ensures they never swallow clicks.
 */
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { heroFrontCards } from '@data/heroCards';

interface FrontCardSpec {
  index: number;
  pos: CSSProperties;
  width: number;
  height: number;
  initRotate: number;
  animY: [number, number, number];
  animRotate: [number, number, number];
  duration: number;
  delay: number;
}

const SPECS: FrontCardSpec[] = [
  {
    // strategic-ads (square) — top-right, overlaps the right side of "Grow."
    index: 0,
    pos: { right: '6%', top: '13%' },
    width: 228,
    height: 228,
    initRotate: 7,
    animY:      [0, -22, 0],
    animRotate: [7, 5, 7],
    duration: 7.8,
    delay: 0,
  },
  {
    // brand-glowup (portrait 3:4) — left-center, overlaps the left of "Design."
    index: 1,
    pos: { left: '5%', top: '34%' },
    width: 170,
    height: 227,
    initRotate: -10,
    animY:      [0, -16, 0],
    animRotate: [-10, -8, -10],
    duration: 9.4,
    delay: 2.0,
  },
  {
    // stopwatch (square) — right-lower, overlaps below "Develop."
    index: 2,
    pos: { right: '4%', bottom: '20%' },
    width: 210,
    height: 210,
    initRotate: -5,
    animY:      [0, -18, 0],
    animRotate: [-5, -3, -5],
    duration: 8.6,
    delay: 3.8,
  },
];

/** Corner radius in px matching the WebGL shader's UV-space RADIUS = 0.07. */
const CORNER_RADIUS = 14;

export function HeroForeground(): JSX.Element {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 hidden md:block"
      aria-hidden="true"
    >
      {SPECS.map((spec) => {
        const card = heroFrontCards[spec.index]!;
        return (
          <motion.div
            key={spec.index}
            style={{
              position: 'absolute',
              width: spec.width,
              height: spec.height,
              borderRadius: CORNER_RADIUS,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '4px -5px 36px rgba(0,0,0,0.50)',
              willChange: 'transform',
              ...spec.pos,
            }}
            initial={{ rotate: spec.initRotate, y: 0 }}
            animate={{
              y: spec.animY,
              rotate: spec.animRotate,
            }}
            transition={{
              duration: spec.duration,
              delay: spec.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <img
              src={card.src}
              alt={card.alt}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                userSelect: 'none',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
