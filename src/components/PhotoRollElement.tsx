import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PhotoRollElementProps {
  nodeId: string;
  name: string;
  rawImageUrl: string;
  renderedPng: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
}

/**
 * PhotoRollElement
 *
 * Renders and animates the authentic Figma photo roll / 35mm filmstrip elements:
 * - Desktop: 15:160 (Projects_Filmstrip_Divider_01), 15:162 (Projects_Contact_Filmstrip_Transition)
 * - Tablet:  30:495 (Projects_Filmstrip_Divider_01), 30:540 (Projects_Contact_Filmstrip_Transition)
 * - Mobile:  30:628 (Projects_Filmstrip_Divider_01), 30:673 (Projects_Contact_Filmstrip_Transition)
 *
 * In Figma, each photo roll is the vertical 35mm filmstrip asset (`/figma/raw_3653be790cc76aab7127e93311639248094b0de4.png`)
 * with crop matrix `[[0.52266651, 0, 0.20759955], [0, 1, 0]]` and rotation `89.5975deg` (so it lies horizontally
 * with a -0.4025deg tilt across the portfolio).
 *
 * Rotating the raw image +90deg Clockwise inside the -0.4025deg tilted film gate matches the exact Figma
 * orientation and frame sequence (left-to-right: full frame 1, half-frame 2, and full frames 3..9) while keeping
 * every segment strictly horizontal along the track so consecutive segments join with zero vertical step or gap.
 */
export const PhotoRollElement: React.FC<PhotoRollElementProps> = ({
  nodeId,
  name,
  rawImageUrl,
  x,
  y,
  width,
  height,
  zIndex = 10,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const carriageRef = useRef<HTMLDivElement>(null);

  // Divider 01 (between Logo & Brand) scrolls left; Transition 02 (between Brand & Contact) scrolls right
  const isReverse = name.includes('Transition');

  // Unrotated strip dimensions from Figma node geometry:
  // size = (189.06346, 1458.3075) inside renderBox = (1459.5996, 199.3029)
  const stripThickness = height * 0.9486238;
  const stripLength = width * 0.99911475;

  // Figma's horizontal X crop on the vertical raw image is x0 = 0.20759955, width = 0.52266651.
  // When rotated +90deg Clockwise (`rotate(90deg)`):
  // - The raw image's vertical Y axis (bottom to top) becomes the horizontal X axis (left to right, length = stripLength).
  // - The raw image's horizontal X axis (left to right) becomes the vertical Y axis (top to bottom):
  const uncroppedThickness = stripThickness / 0.52266651;
  const cropOffsetTop = -uncroppedThickness * 0.20759955;

  // Trim 0.82% off the top/bottom ends of the raw image (which become the left/right ends of each horizontal segment)
  // so that the transparent margin in the raw asset is completely eliminated and segments join directly on the dark brown frame divider.
  const trimEndPct = 0.0082;
  const effectiveLength = stripLength * (1 + trimEndPct * 2);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !trackRef.current || !carriageRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Continuous seamless looping along the filmstrip's axis
      gsap.fromTo(
        trackRef.current,
        { xPercent: isReverse ? -50 : 0 },
        {
          xPercent: isReverse ? 0 : -50,
          duration: 30,
          ease: 'none',
          repeat: -1,
          force3D: true,
        }
      );

      // 2. Subtle mechanical film-gate transport micro-movement
      gsap.to(carriageRef.current, {
        y: 0.4,
        duration: 0.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        force3D: true,
      });
    });

    return () => ctx.revert();
  }, [isReverse]);

  const renderFilmSegment = (segmentKey: string) => (
    <div
      key={segmentKey}
      style={{
        position: 'relative',
        width: `${stripLength}px`,
        height: `${stripThickness}px`,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: `${cropOffsetTop + uncroppedThickness / 2}px`,
          width: `${uncroppedThickness}px`,
          height: `${effectiveLength}px`,
          transform: 'translate(-50%, -50%) rotate(90deg)',
          transformOrigin: 'center center',
          pointerEvents: 'none',
        }}
      >
        <img
          src={rawImageUrl}
          alt={name}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'fill',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      data-node-id={nodeId}
      data-node-name={name}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Filmstrip Gate oriented at Figma's exact -0.4025deg (89.5975deg CCW) angle */}
      <div
        ref={carriageRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${stripLength}px`,
          height: `${stripThickness}px`,
          transform: 'translate(-50%, -50%) rotate(-0.4025deg)',
          transformOrigin: 'center center',
          overflow: 'hidden',
          willChange: 'transform',
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: `${stripLength * 2}px`,
            height: `${stripThickness}px`,
            willChange: 'transform',
          }}
        >
          {renderFilmSegment('seg-1')}
          {renderFilmSegment('seg-2')}
        </div>

        {/* Subtle physical film roll edge depth inside the original boundaries */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 4%, rgba(255,250,235,0.04) 50%, rgba(0,0,0,0) 96%, rgba(0,0,0,0.12) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};
