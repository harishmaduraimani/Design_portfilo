import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const MarqueeTicker: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        duration: 22,
        ease: 'none',
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  const items = Array.from({ length: 8 });

  return (
    <div className="relative z-20 w-full bg-[#0e0e0e] text-[#f5f4ef] py-1.5 sm:py-2 overflow-hidden border-y border-black shadow-md select-none">
      <div ref={trackRef} className="flex w-max items-center whitespace-nowrap">
        {items.map((_, idx) => (
          <div key={idx} className="flex items-center">
            <span className="font-portfolio-display text-[17px] sm:text-[21px] md:text-[23px] font-bold tracking-wide mx-3 sm:mx-4">
              HARISH MM
            </span>
            <span className="font-portfolio-display text-[17px] sm:text-[21px] md:text-[23px] font-bold tracking-wide mx-2 sm:mx-3 text-[#f0efe9]">
              Designer
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
