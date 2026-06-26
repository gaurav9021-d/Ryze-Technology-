/**
 * HeroFallback — high-craft STATIC hero treatment (task 11.2).
 *
 * This is the always-painted hero background layer. It is rendered first by
 * {@link Hero} (Requirement 19.1) and remains the entire visual when the WebGL
 * scene is gated off — under reduced motion (Requirement 19.2), without a
 * WebGL2 context (Requirement 19.3), or when the capability gate fails
 * (Requirement 19.4). When WebGL is allowed it doubles as the pre-WebGL poster
 * that the animated scene cross-fades in over (Requirement 19.6).
 *
 * The treatment is intentionally lightweight: pure CSS gradient-mesh glows, a
 * subtle SVG grain texture, and faint "blueprint" grid accents. There is NO
 * `<canvas>`, no Three.js, and no heavy/looping motion here, so this module
 * stays in the entry chunk and never pulls in `three`/`@react-three/fiber`
 * (those live only in the lazily-imported {@link HeroWebGL} chunk — task 11.3).
 *
 * If a `poster` ImageAsset is supplied it is painted as a covering background
 * image (with its intrinsic dimensions reserving aspect ratio) beneath the
 * decorative layers; otherwise the CSS mesh alone carries the treatment.
 *
 * The fallback paints only the background canvas area — the headline, eyebrow,
 * subheadline, and CTA are composed on top by {@link Hero}.
 *
 * _Requirements: 19.1, 19.2, 19.3, 19.4, 19.6_
 */
import type { CSSProperties } from 'react';
import type { ImageAsset } from '@app-types';

export interface HeroFallbackProps {
  /** Optional poster image painted beneath the CSS treatment. */
  poster?: ImageAsset;
}

/**
 * Inline data-URI SVG fractal-noise grain. Kept as a data URI so it adds no
 * network request and lives entirely in the entry CSS-in-JS.
 */
const GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

export function HeroFallback({ poster }: HeroFallbackProps): JSX.Element {
  // Optional poster layer — covers the area, reserving aspect ratio via the
  // intrinsic dimensions carried on the ImageAsset.
  const posterStyle: CSSProperties | undefined =
    poster === undefined
      ? undefined
      : {
          backgroundImage: `url(${poster.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Reserve the intrinsic aspect ratio to avoid layout shift (no CLS).
          aspectRatio: `${poster.width} / ${poster.height}`,
        };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-ink-900"
      data-testid="hero-fallback"
    >
      {/* Optional poster image beneath the decorative layers. */}
      {posterStyle !== undefined ? (
        <div
          className="absolute inset-0 h-full w-full"
          style={posterStyle}
        />
      ) : null}

      {/* Gradient-mesh glows — layered radial gradients in the pulse accent. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(60% 50% at 18% 22%, rgba(34, 211, 238, 0.20), transparent 70%)',
            'radial-gradient(55% 45% at 82% 30%, rgba(14, 116, 144, 0.22), transparent 72%)',
            'radial-gradient(70% 60% at 50% 96%, rgba(92, 224, 242, 0.12), transparent 75%)',
          ].join(', '),
        }}
      />

      {/* Blueprint grid accents — faint fine + coarse line grid. */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: [
            'linear-gradient(to right, var(--mist-100) 1px, transparent 1px)',
            'linear-gradient(to bottom, var(--mist-100) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '64px 64px, 64px 64px',
          // Fade the grid toward the edges so it reads as an accent, not a wall.
          maskImage:
            'radial-gradient(80% 80% at 50% 45%, #000 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(80% 80% at 50% 45%, #000 40%, transparent 100%)',
        }}
      />

      {/* Grain texture for tactile depth over the flat gradients. */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_DATA_URI }}
      />

      {/* Bottom vignette so composed text keeps contrast against the mesh. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, transparent 40%, rgba(7, 10, 18, 0.65) 100%)',
        }}
      />
    </div>
  );
}

export default HeroFallback;
