import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface FilmStripRollProps {
  direction?: 'left' | 'right';
  speed?: number;
}

const FILM_FRAMES = [
  { id: '01A', label: 'BOOM IDENTITY', preview: '/assets/logo_card_boom.png' },
  { id: '02A', label: 'KING KITCHEN', preview: '/assets/brand_card_b.png' },
  { id: '03A', label: 'STUDIO PORTRAIT', preview: '/assets/tv_screen_photo.png' },
  { id: '04A', label: 'BOOM STOREFRONT', preview: '/assets/brand_card_boom.png' },
  { id: '05A', label: 'KiCK 100% NATURAL', preview: '/assets/brand_card_kick.png' },
  { id: '06A', label: 'EATERBUCKS 1999', preview: '/assets/logo_card_eaterbucks.png' },
  { id: '07A', label: 'HMM DEZ!N CAM', preview: '/assets/camera_screen_photo.png' },
  { id: '08A', label: 'KiCK EMBLEM', preview: '/assets/logo_card_kick.png' },
];

export const FilmStripRoll: React.FC<FilmStripRollProps> = ({
  direction = 'left',
  speed = 26,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      if (direction === 'left') {
        tweenRef.current = gsap.fromTo(
          track,
          { xPercent: 0 },
          {
            xPercent: -50,
            duration: speed,
            ease: 'none',
            repeat: -1,
          }
        );
      } else {
        tweenRef.current = gsap.fromTo(
          track,
          { xPercent: -50 },
          {
            xPercent: 0,
            duration: speed,
            ease: 'none',
            repeat: -1,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [direction, speed]);

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0.12, duration: 0.6, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    setHoveredFrame(null);
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6, ease: 'power2.inOut' });
    }
  };

  // Duplicate frames twice for a seamless 50% loop
  const seamlessFrames = [...FILM_FRAMES, ...FILM_FRAMES];

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="FILM REEL"
      className="relative z-20 w-full bg-[#e6dfd1] py-0.5 overflow-hidden select-none shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
      style={{
        perspective: '900px',
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max items-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(2deg)',
        }}
      >
        {seamlessFrames.map((frame, index) => {
          const uniqueKey = `${frame.id}-${index}`;
          const isHovered = hoveredFrame === uniqueKey;
          return (
            <div
              key={uniqueKey}
              onMouseEnter={() => setHoveredFrame(uniqueKey)}
              className="relative w-[108px] sm:w-[126px] md:w-[138px] aspect-[66/62] shrink-0 group cursor-pointer transition-transform duration-300"
              style={{
                transform: isHovered ? 'translateZ(14px) scale(1.05)' : 'translateZ(0px) scale(1)',
              }}
            >
              {/* Exact Vintage Sepia 35mm Film Frame Tile with Sprocket Holes */}
              <img
                src="/assets/film_frame_tile.png"
                alt={`35mm Film Frame ${frame.id}`}
                className="w-full h-full object-fill pointer-events-none select-none"
              />

              {/* Subtle Embedded Photographic Negative inside the Amber Film Window */}
              <div
                className="absolute overflow-hidden rounded-[6px] pointer-events-none flex items-center justify-center"
                style={{
                  left: '7.5%',
                  top: '15.5%',
                  width: '85%',
                  height: '69%',
                }}
              >
                <img
                  src={frame.preview}
                  alt={frame.label}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isHovered
                      ? 'opacity-85 sepia-[0.25] contrast-125 scale-105'
                      : 'opacity-[0.18] sepia contrast-125 mix-blend-multiply scale-100'
                  }`}
                />
                {/* Film Frame Numbering along bottom edge */}
                <span className="absolute bottom-0.5 right-1.5 font-mono text-[6px] sm:text-[7px] text-[#5e3a14]/70 font-bold tracking-widest">
                  {frame.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
