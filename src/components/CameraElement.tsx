import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CameraElementProps {
  src: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
}

export const CameraElement: React.FC<CameraElementProps> = ({
  src,
  alt,
  x,
  y,
  width,
  height,
  zIndex = 10,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topBladeRef = useRef<HTMLDivElement>(null);
  const bottomBladeRef = useRef<HTMLDivElement>(null);
  const lcdFlashRef = useRef<HTMLDivElement>(null);
  const lensCoreRef = useRef<HTMLDivElement>(null);
  const lightBloomRef = useRef<HTMLDivElement>(null);
  const afterglowRef = useRef<HTMLDivElement>(null);

  const triggerShutterSequence = () => {
    if (
      !topBladeRef.current ||
      !bottomBladeRef.current ||
      !lcdFlashRef.current ||
      !lensCoreRef.current ||
      !lightBloomRef.current ||
      !afterglowRef.current
    ) {
      return;
    }

    gsap.killTweensOf([
      topBladeRef.current,
      bottomBladeRef.current,
      lcdFlashRef.current,
      lensCoreRef.current,
      lightBloomRef.current,
      afterglowRef.current,
    ]);

    const tl = gsap.timeline();

    // 1. Realistic mechanical camera shutter curtains close over the LCD viewfinder
    tl.to(
      [topBladeRef.current, bottomBladeRef.current],
      {
        height: '50.5%',
        duration: 0.055,
        ease: 'power3.in',
      },
      0
    )
      // 2. Shutter curtains snap open as the flash fires
      .to(
        [topBladeRef.current, bottomBladeRef.current],
        {
          height: '0%',
          duration: 0.09,
          ease: 'power2.out',
        },
        0.075
      )
      // 3. Lens illumination (intense xenon flash core on the optical viewfinder lens)
      .fromTo(
        lensCoreRef.current,
        { opacity: 0, scale: 0.4 },
        {
          opacity: 1,
          scale: 1.45,
          duration: 0.045,
          ease: 'power4.out',
        },
        0.04
      )
      // 4. Brief white flash across the camera & LCD
      .fromTo(
        lcdFlashRef.current,
        { opacity: 0 },
        {
          opacity: 0.92,
          duration: 0.04,
          ease: 'power4.out',
        },
        0.05
      )
      // 5. Expansive radial light bloom around the lens
      .fromTo(
        lightBloomRef.current,
        { opacity: 0, scale: 0.35 },
        {
          opacity: 0.95,
          scale: 2.35,
          duration: 0.08,
          ease: 'power3.out',
        },
        0.045
      )
      // 6. Warm/cyan optical afterglow decay
      .fromTo(
        afterglowRef.current,
        { opacity: 0, scale: 0.7 },
        {
          opacity: 0.78,
          scale: 1.75,
          duration: 0.14,
          ease: 'power2.out',
        },
        0.06
      )
      // Smooth recovery & dissipation
      .to(
        lcdFlashRef.current,
        {
          opacity: 0,
          duration: 0.38,
          ease: 'power2.out',
        },
        0.1
      )
      .to(
        lensCoreRef.current,
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.45,
          ease: 'power2.out',
        },
        0.11
      )
      .to(
        lightBloomRef.current,
        {
          opacity: 0,
          scale: 2.9,
          duration: 0.65,
          ease: 'power3.out',
        },
        0.12
      )
      .to(
        afterglowRef.current,
        {
          opacity: 0,
          scale: 2.2,
          duration: 1.15,
          ease: 'sine.out',
        },
        0.18
      );
  };

  // Autonomous periodic camera shutter + flash cycle (completely independent of the TV animation)
  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextFlash = () => {
      const nextDelay = 4200 + Math.random() * 3800;
      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        triggerShutterSequence();
        scheduleNextFlash();
      }, nextDelay);
    };

    const initialTimer = setTimeout(() => {
      if (!isMounted) return;
      triggerShutterSequence();
      scheduleNextFlash();
    }, 1900);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={triggerShutterSequence}
      onMouseEnter={triggerShutterSequence}
      title="Interactive Canon Camera — Click or hover to trigger shutter & flash"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        cursor: 'pointer',
      }}
    >
      {/* Original Unmodified Figma Camera Asset */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'fill',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Camera LCD Screen Aperture Overlay (Mechanical Shutter Curtains + Brief White Flash) */}
      <div
        style={{
          position: 'absolute',
          left: '23.8%',
          top: '21.2%',
          width: '45.8%',
          height: '43.4%',
          overflow: 'hidden',
          borderRadius: '2px',
          pointerEvents: 'none',
        }}
      >
        {/* Top Mechanical Shutter Blade */}
        <div
          ref={topBladeRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '0%',
            background: 'linear-gradient(to bottom, #090909 0%, #1c1c1c 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.22)',
            zIndex: 3,
          }}
        />

        {/* Bottom Mechanical Shutter Blade */}
        <div
          ref={bottomBladeRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '0%',
            background: 'linear-gradient(to top, #090909 0%, #1c1c1c 100%)',
            borderTop: '1px solid rgba(255,255,255,0.22)',
            zIndex: 3,
          }}
        />

        {/* Brief LCD White Flash */}
        <div
          ref={lcdFlashRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#ffffff',
            opacity: 0,
            mixBlendMode: 'screen',
            zIndex: 4,
          }}
        />
      </div>

      {/* Optical Viewfinder / Flash Lens Illumination & Light Bloom (Centered at x: 82.6%, y: 55.2% of camera node) */}
      <div
        style={{
          position: 'absolute',
          left: '76.3%',
          top: '50.5%',
          width: '12.6%',
          height: '9.4%',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Smooth Afterglow Halo */}
        <div
          ref={afterglowRef}
          style={{
            position: 'absolute',
            width: '280%',
            height: '280%',
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, rgba(255, 250, 220, 0.85) 0%, rgba(160, 235, 255, 0.45) 42%, rgba(255, 255, 255, 0) 74%)',
            opacity: 0,
            mixBlendMode: 'screen',
            filter: 'blur(4px)',
          }}
        />

        {/* Expansive Light Bloom */}
        <div
          ref={lightBloomRef}
          style={{
            position: 'absolute',
            width: '360%',
            height: '360%',
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.88) 28%, rgba(215,245,255,0.45) 55%, rgba(255,255,255,0) 76%)',
            boxShadow: '0 0 65px 25px rgba(255, 255, 255, 0.85)',
            opacity: 0,
          }}
        />

        {/* Direct Lens Illumination Core */}
        <div
          ref={lensCoreRef}
          style={{
            position: 'absolute',
            width: '105%',
            height: '105%',
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, #ffffff 0%, #ffffff 55%, rgba(255, 255, 255, 0) 100%)',
            boxShadow: '0 0 28px 10px rgba(255, 255, 255, 0.98)',
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
};
