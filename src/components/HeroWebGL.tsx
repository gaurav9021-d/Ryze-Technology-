/**
 * HeroWebGL — PLACEHOLDER lazily-imported animated hero scene.
 *
 * NOTE: This is a minimal placeholder created for task 11.2 so that the
 * `React.lazy(() => import('./HeroWebGL'))` target in {@link Hero} resolves and
 * the build passes. Task 11.3 replaces this with the real R3F (react-three-
 * fiber) particle→lattice instanced scene. The real implementation is the ONLY
 * module permitted to import `three` / `@react-three/fiber`, keeping those
 * heavy dependencies out of the entry chunk and isolated to this lazy chunk.
 *
 * Until then this renders a lightweight animated CSS layer so the cross-fade
 * machinery in {@link Hero} (Requirement 19.5, 19.6) has a real component to
 * mount and fade in. It intentionally uses NO canvas and NO Three.js.
 *
 * _Requirements: 19.5 (placeholder for 11.3)_
 */

export interface HeroWebGLProps {
  /** When true the scene's render loop should be paused (offscreen / hidden). */
  paused: boolean;
}

export function HeroWebGL({ paused }: HeroWebGLProps): JSX.Element {
  return (
    <div
      aria-hidden="true"
      data-testid="hero-webgl"
      data-paused={paused ? 'true' : 'false'}
      className="absolute inset-0 h-full w-full"
      style={{
        backgroundImage:
          'radial-gradient(60% 60% at 50% 40%, rgba(34, 211, 238, 0.28), transparent 70%)',
      }}
    />
  );
}

export default HeroWebGL;
