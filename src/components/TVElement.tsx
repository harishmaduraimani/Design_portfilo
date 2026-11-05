import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TVElementProps {
  src: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
}

export const TVElement: React.FC<TVElementProps> = ({
  src,
  alt,
  x,
  y,
  width,
  height,
  zIndex = 10,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const redGhostRef = useRef<HTMLDivElement>(null);
  const cyanGhostRef = useRef<HTMLDivElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const tearBarRef = useRef<HTMLDivElement>(null);
  const scanlineBarRef = useRef<HTMLDivElement>(null);
  const flickerOverlayRef = useRef<HTMLDivElement>(null);

  // Render live 60fps CRT static interference noise onto canvas
  useEffect(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const drawNoise = () => {
      frame++;
      if (frame % 2 === 0) {
        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.createImageData(w, h);
        const buf = new Uint32Array(imgData.data.buffer);
        for (let i = 0; i < buf.length; i++) {
          const v = (Math.random() * 255) | 0;
          buf[i] = (255 << 24) | (v << 16) | (v << 8) | v;
        }
        ctx.putImageData(imgData, 0, 0);
      }
      animId = requestAnimationFrame(drawNoise);
    };

    drawNoise();
    return () => cancelAnimationFrame(animId);
  }, []);

  // GSAP realistic CRT glitch, RGB separation, static burst, flicker, and natural signal recovery
  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const triggerGlitchSequence = (intensity = 1) => {
      if (!isMounted || !screenRef.current) return;

      const tl = gsap.timeline();

      // 1. Sudden horizontal sync loss & RGB channel separation
      tl.to(
        redGhostRef.current,
        {
          opacity: 0.85 * intensity,
          x: 7 * intensity,
          y: -1.5 * intensity,
          skewX: -6 * intensity,
          duration: 0.04,
          ease: 'steps(1)',
        },
        0
      )
        .to(
          cyanGhostRef.current,
          {
            opacity: 0.85 * intensity,
            x: -7 * intensity,
            y: 1.5 * intensity,
            skewX: 6 * intensity,
            duration: 0.04,
            ease: 'steps(1)',
          },
          0
        )
        // Brief static interference spike
        .to(
          staticCanvasRef.current,
          {
            opacity: 0.58 * intensity,
            duration: 0.05,
            ease: 'steps(2)',
          },
          0
        )
        // Horizontal tear bar jump
        .set(
          tearBarRef.current,
          {
            top: `${15 + Math.random() * 65}%`,
            height: `${10 + Math.random() * 18}%`,
            opacity: 0.75 * intensity,
            x: (Math.random() > 0.5 ? 12 : -12) * intensity,
          },
          0
        )
        // Screen flicker spike
        .to(
          flickerOverlayRef.current,
          {
            opacity: 0.35 * intensity,
            duration: 0.03,
            yoyo: true,
            repeat: 3,
          },
          0
        )
        // Secondary jitter
        .to(redGhostRef.current, {
          x: -5 * intensity,
          y: 2 * intensity,
          skewX: 4 * intensity,
          duration: 0.05,
          ease: 'steps(1)',
        })
        .to(
          cyanGhostRef.current,
          {
            x: 5 * intensity,
            y: -2 * intensity,
            skewX: -4 * intensity,
            duration: 0.05,
            ease: 'steps(1)',
          },
          '<'
        )
        .set(tearBarRef.current, {
          top: `${20 + Math.random() * 55}%`,
          x: -8 * intensity,
          opacity: 0.5,
        })
        // 2. Natural signal recovery (damped horizontal lock & static fadeout)
        .to(redGhostRef.current, {
          opacity: 0,
          x: 0,
          y: 0,
          skewX: 0,
          duration: 0.28,
          ease: 'elastic.out(1.2, 0.35)',
        })
        .to(
          cyanGhostRef.current,
          {
            opacity: 0,
            x: 0,
            y: 0,
            skewX: 0,
            duration: 0.28,
            ease: 'elastic.out(1.2, 0.35)',
          },
          '<'
        )
        .to(
          staticCanvasRef.current,
          {
            opacity: 0.07,
            duration: 0.32,
            ease: 'power2.out',
          },
          '<'
        )
        .to(
          tearBarRef.current,
          {
            opacity: 0,
            x: 0,
            duration: 0.14,
            ease: 'power2.out',
          },
          '<'
        )
        .to(
          flickerOverlayRef.current,
          {
            opacity: 0,
            duration: 0.2,
          },
          '<'
        );
    };

    // Continuous random scanline roll
    const scanCtx = gsap.context(() => {
      if (scanlineBarRef.current) {
        gsap.fromTo(
          scanlineBarRef.current,
          { top: '-18%' },
          {
            top: '115%',
            duration: 3.6,
            ease: 'none',
            repeat: -1,
          }
        );
      }
    }, containerRef);

    // Schedule autonomous organic CRT glitch bursts
    const scheduleNext = () => {
      const nextDelay = 2600 + Math.random() * 3400;
      timeoutId = setTimeout(() => {
        triggerGlitchSequence(0.75 + Math.random() * 0.45);
        scheduleNext();
      }, nextDelay);
    };

    // Initial startup glitch after 600ms
    const initTimer = setTimeout(() => {
      triggerGlitchSequence(1.1);
      scheduleNext();
    }, 600);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      clearTimeout(timeoutId);
      scanCtx.revert();
    };
  }, []);

  const handleManualGlitch = () => {
    if (!redGhostRef.current || !cyanGhostRef.current || !staticCanvasRef.current) return;
    gsap.killTweensOf([redGhostRef.current, cyanGhostRef.current, staticCanvasRef.current, tearBarRef.current]);
    const tl = gsap.timeline();
    tl.to(redGhostRef.current, { opacity: 0.95, x: 9, y: -2, skewX: -8, duration: 0.04 })
      .to(cyanGhostRef.current, { opacity: 0.95, x: -9, y: 2, skewX: 8, duration: 0.04 }, 0)
      .to(staticCanvasRef.current, { opacity: 0.72, duration: 0.05 }, 0)
      .set(tearBarRef.current, { top: '38%', height: '22%', opacity: 0.85, x: -14 }, 0)
      .to(redGhostRef.current, { opacity: 0, x: 0, y: 0, skewX: 0, duration: 0.36, ease: 'elastic.out(1.2, 0.3)' }, 0.12)
      .to(cyanGhostRef.current, { opacity: 0, x: 0, y: 0, skewX: 0, duration: 0.36, ease: 'elastic.out(1.2, 0.3)' }, 0.12)
      .to(staticCanvasRef.current, { opacity: 0.07, duration: 0.38, ease: 'power2.out' }, 0.12)
      .to(tearBarRef.current, { opacity: 0, x: 0, duration: 0.18 }, 0.12);
  };

  // Exact geometry mapping the full TV image inside the screen aperture so the screen content matches 100%
  // Screen aperture is left: 17.5%, top: 10.5%, width: 61.5%, height: 75.5%
  const innerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${(-17.5 / 61.5) * 100}%`,
    top: `${(-10.5 / 75.5) * 100}%`,
    width: `${(100 / 61.5) * 100}%`,
    height: `${(100 / 75.5) * 100}%`,
    maxWidth: 'none',
    pointerEvents: 'none',
  };

  return (
    <div
      ref={containerRef}
      onClick={handleManualGlitch}
      onMouseEnter={handleManualGlitch}
      title="Interactive CRT Television — Click or hover for signal interference"
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
      {/* Original Unmodified Figma TV Asset */}
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

      {/* CRT Glass Screen Aperture Overlay (Strictly clipped to CRT tube boundaries) */}
      <div
        ref={screenRef}
        style={{
          position: 'absolute',
          left: '17.5%',
          top: '10.5%',
          width: '61.5%',
          height: '75.5%',
          borderRadius: '11% / 14%',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Red Chromatic Aberration / RGB Separation Layer */}
        <div
          ref={redGhostRef}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            mixBlendMode: 'screen',
            filter: 'hue-rotate(-45deg) saturate(3.5) contrast(1.25)',
          }}
        >
          <img src={src} alt="" style={innerStyle} />
        </div>

        {/* Cyan Chromatic Aberration / RGB Separation Layer */}
        <div
          ref={cyanGhostRef}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            mixBlendMode: 'screen',
            filter: 'hue-rotate(145deg) saturate(3.5) contrast(1.25)',
          }}
        >
          <img src={src} alt="" style={innerStyle} />
        </div>

        {/* Horizontal Signal Tear Slice */}
        <div
          ref={tearBarRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '35%',
            height: '14%',
            opacity: 0,
            overflow: 'hidden',
            mixBlendMode: 'hard-light',
            filter: 'contrast(1.6) brightness(1.35) invert(0.12)',
            background: 'rgba(255,255,255,0.18)',
          }}
        />

        {/* Live CRT Static Interference Canvas */}
        <canvas
          ref={staticCanvasRef}
          width={110}
          height={84}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.07,
            mixBlendMode: 'screen',
          }}
        />

        {/* Fine CRT Phosphor Scanlines */}
        <div
          className="crt-scanlines"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.52,
            mixBlendMode: 'multiply',
          }}
        />

        {/* Rolling Vertical Refresh Scanline Bar */}
        <div
          ref={scanlineBarRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '16%',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Occasional Screen Flicker Layer */}
        <div
          ref={flickerOverlayRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(220, 245, 255, 0.5)',
            mixBlendMode: 'overlay',
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
};
