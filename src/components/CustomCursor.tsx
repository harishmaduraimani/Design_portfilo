import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) {
      setIsTouchDevice(true);
      return;
    }

    const outer = cursorOuterRef.current;
    const dot = cursorDotRef.current;
    if (!outer || !dot) return;

    const xTo = gsap.quickTo(outer, 'x', { duration: 0.22, ease: 'power3.out' });
    const yTo = gsap.quickTo(outer, 'y', { duration: 0.22, ease: 'power3.out' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power2.out' });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('[data-cursor]');
      if (interactive) {
        setIsHovered(true);
        setCursorLabel(interactive.getAttribute('data-cursor') || '');
      } else if (target?.closest('button, a, [role="button"]')) {
        setIsHovered(true);
        setCursorLabel('');
      } else {
        setIsHovered(false);
        setCursorLabel('');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={cursorOuterRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 ${
          isHovered
            ? 'w-16 h-16 rounded-full border-2 border-[#00efb4] bg-black/75 text-[#00efb4] shadow-[0_0_20px_rgba(0,239,180,0.4)]'
            : 'w-8 h-8 rounded-full border border-black/50 bg-white/10 backdrop-blur-[1px]'
        }`}
      >
        {/* Viewfinder corner ticks when not showing text */}
        {!cursorLabel && (
          <div className="w-2.5 h-2.5 border border-black/40 rounded-[1px]" />
        )}
        {cursorLabel && (
          <span className="text-[9px] font-bold tracking-wider uppercase text-center leading-tight px-1 font-mono">
            {cursorLabel}
          </span>
        )}
      </div>
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-transform duration-150 ${
          isHovered ? 'scale-0 bg-[#00efb4]' : 'scale-100 bg-[#a200ff]'
        }`}
      />
    </>
  );
};
