import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface BrandStampCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  src: string;
}

const BRAND_CARDS: BrandStampCard[] = [
  {
    id: 'brand-b',
    title: 'KING OF KITCHEN',
    subtitle: 'Architectural Storefront & Retail Identity',
    description:
      'Illuminated 3D dimensional facade signage and flagship store branding engineered for high-footfall retail corridors.',
    src: '/assets/brand_card_b.png',
  },
  {
    id: 'brand-boom',
    title: 'THE NEW BOOM',
    subtitle: 'Flagship Boutique Exterior & Interior System',
    description:
      'Warm gold backlit fascia typography paired with monolithic dark steel framing for a contemporary fashion flagship.',
    src: '/assets/brand_card_boom.png',
  },
  {
    id: 'brand-kick',
    title: 'KiCK 100% NATURAL',
    subtitle: 'Beverage Can Packaging & Outdoor Wayfinding',
    description:
      'Botanical strawberry-illustrated aluminum can series and minimalist street-level hanging blade signage.',
    src: '/assets/brand_card_kick.png',
  },
];

interface BrandDesignSectionProps {
  onPlayClick: () => void;
}

export const BrandDesignSection: React.FC<BrandDesignSectionProps> = ({
  onPlayClick,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const balloonRef = useRef<HTMLImageElement>(null);
  const rickshawRef = useRef<HTMLImageElement>(null);
  const ticketsRef = useRef<HTMLImageElement>(null);
  const [activeBrand, setActiveBrand] = useState<BrandStampCard | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.brand-stamp-item',
        { y: 40, opacity: 0, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 76%',
          },
        }
      );

      // Continuous gentle floating animation for Hot Air Balloon
      if (balloonRef.current) {
        gsap.to(balloonRef.current, {
          y: -12,
          rotation: 3,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Subtle scroll parallax for Auto Rickshaw & Cinema Tickets
      if (rickshawRef.current) {
        gsap.fromTo(
          rickshawRef.current,
          { x: -18 },
          {
            x: 18,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      if (ticketsRef.current) {
        gsap.fromTo(
          ticketsRef.current,
          { rotate: -6, y: 10 },
          {
            rotate: 6,
            y: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="branding"
      className="relative w-full bg-[#0d0d0d] pt-3 pb-3 px-1.5 sm:px-3 select-none overflow-hidden"
    >
      {/* Rounded Crumpled Paper Container matching Image 2 bottom half */}
      <div className="crumpled-paper-surface relative w-full rounded-[34px] sm:rounded-[44px] pt-7 pb-16 sm:pt-10 sm:pb-20 px-4 sm:px-8 overflow-visible shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
        {/* Top Row: "bRAND Design" (left) & Red Cinema Tickets (top-right) */}
        <div className="relative z-20 flex items-start justify-between">
          <div className="inline-flex flex-col items-start ml-6 sm:ml-12 mt-1 sm:mt-2">
            <h2 className="sticker-mint text-[42px] sm:text-[52px] md:text-[58px] leading-[0.88] tracking-tight">
              bRAND
            </h2>
            <span className="font-calligraphy text-[38px] sm:text-[46px] md:text-[52px] text-[#0d0d0d] leading-[0.9] ml-14 sm:ml-20 -mt-1">
              Design
            </span>
          </div>

          {/* Red Vintage Cinema Ticket Stubs on top-right */}
          <img
            ref={ticketsRef}
            src="/assets/cinema_tickets.png"
            alt="Vintage Cinema Tickets"
            className="w-[140px] sm:w-[185px] md:w-[205px] h-auto object-contain z-20 -mt-2 sm:-mt-3 mr-1 sm:mr-4 pointer-events-none drop-shadow-[0_10px_16px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* 3 Staggered Perforated Postage-Stamp Black Frames */}
        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-7 sm:gap-5 md:gap-8 items-start mt-4 sm:-mt-10 px-2 sm:px-6">
          {/* LEFT CARD: B Storefront (positioned lower) */}
          <div className="brand-stamp-item flex flex-col items-center sm:mt-24">
            <div
              onClick={() => {
                onPlayClick();
                setActiveBrand(BRAND_CARDS[0]);
              }}
              data-cursor="VIEW BRAND"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveBrand(BRAND_CARDS[0])}
              className="relative group cursor-pointer w-[178px] sm:w-[172px] md:w-[196px] shadow-[0_16px_30px_rgba(0,0,0,0.38)] transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            >
              <img
                src={BRAND_CARDS[0].src}
                alt={BRAND_CARDS[0].title}
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>

          {/* CENTER CARD: BOOM Storefront (positioned higher + Hot Air Balloon overlapping bottom-right) */}
          <div className="brand-stamp-item relative flex flex-col items-center sm:-mt-4">
            <div
              onClick={() => {
                onPlayClick();
                setActiveBrand(BRAND_CARDS[1]);
              }}
              data-cursor="VIEW BRAND"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveBrand(BRAND_CARDS[1])}
              className="relative group cursor-pointer w-[178px] sm:w-[172px] md:w-[196px] shadow-[0_16px_30px_rgba(0,0,0,0.38)] transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            >
              <img
                src={BRAND_CARDS[1].src}
                alt={BRAND_CARDS[1].title}
                className="w-full h-auto object-contain block"
              />
            </div>

            {/* Vintage Hot Air Balloon overlapping between Center and Right cards */}
            <img
              ref={balloonRef}
              src="/assets/hot_air_balloon.png"
              alt="Vintage hot air balloon cutout"
              className="hidden sm:block absolute -right-11 md:-right-14 -bottom-16 md:-bottom-20 w-[98px] md:w-[116px] h-auto z-30 pointer-events-none drop-shadow-[0_12px_18px_rgba(0,0,0,0.28)]"
            />
          </div>

          {/* RIGHT CARD: KiCK Cans & Sign (positioned lower) */}
          <div className="brand-stamp-item flex flex-col items-center sm:mt-24">
            <div
              onClick={() => {
                onPlayClick();
                setActiveBrand(BRAND_CARDS[2]);
              }}
              data-cursor="VIEW BRAND"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveBrand(BRAND_CARDS[2])}
              className="relative group cursor-pointer w-[178px] sm:w-[172px] md:w-[196px] shadow-[0_16px_30px_rgba(0,0,0,0.38)] transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            >
              <img
                src={BRAND_CARDS[2].src}
                alt={BRAND_CARDS[2].title}
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>
        </div>

        {/* Bottom Collage Cutouts: Hand-painted Indian Auto-Rickshaw (center) & Tilted Cassette (bottom-right) */}
        <img
          ref={rickshawRef}
          src="/assets/auto_rickshaw.png"
          alt="Hand-painted Indian Auto Rickshaw"
          className="absolute left-1/2 -translate-x-[45%] -bottom-8 sm:-bottom-10 w-[210px] sm:w-[255px] md:w-[280px] h-auto z-30 pointer-events-none drop-shadow-[0_12px_20px_rgba(0,0,0,0.35)]"
        />

        <img
          src="/assets/cassette_corner.png"
          alt="Retro cassette corner cutout"
          className="absolute -right-2 -bottom-5 sm:-bottom-6 w-[110px] sm:w-[138px] md:w-[150px] h-auto z-30 pointer-events-none drop-shadow-[-4px_8px_14px_rgba(0,0,0,0.35)]"
        />
      </div>

      {/* Brand Case Study Modal */}
      {activeBrand && (
        <div
          onClick={() => setActiveBrand(null)}
          className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="crumpled-paper-surface relative max-w-md w-full rounded-3xl p-6 sm:p-8 border-2 border-[#00efb4] shadow-2xl flex flex-col items-center text-center"
          >
            <button
              onClick={() => setActiveBrand(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#a200ff] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={activeBrand.src}
              alt={activeBrand.title}
              className="w-52 sm:w-60 h-auto object-contain mb-4 shadow-xl"
            />
            <span className="marker-yellow text-xs mb-2">{activeBrand.subtitle}</span>
            <h3 className="font-portfolio-display text-2xl font-bold text-black">
              {activeBrand.title}
            </h3>
            <p className="text-sm text-black/80 mt-2 leading-relaxed">
              {activeBrand.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
