import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface LogoCardItem {
  id: string;
  title: string;
  client: string;
  category: string;
  src: string;
  rotation: string;
  topOffset: string;
  wirePath: string;
  wireHeight: number;
}

const INITIAL_LOGOS: LogoCardItem[] = [
  {
    id: 'boom',
    title: 'THE NEW BOOM',
    client: 'Boom Streetwear & Retail',
    category: 'Custom Wordmark & Geometric Identity',
    src: '/assets/logo_card_boom.png',
    rotation: '-4.5deg',
    topOffset: 'mt-16 sm:mt-20',
    wirePath: 'M 38 0 L 22 65 L 14 115 L 48 142',
    wireHeight: 144,
  },
  {
    id: 'king-kitchen',
    title: 'B — KING OF KITCHEN',
    client: 'King of Kitchen Culinary',
    category: 'Negative Space Monogram',
    src: '/assets/logo_card_b.png',
    rotation: '-3.5deg',
    topOffset: 'mt-12 sm:mt-16',
    wirePath: 'M 42 0 L 42 56 L 48 92 L 42 132',
    wireHeight: 132,
  },
  {
    id: 'kick',
    title: 'KiCK 100% NATURAL',
    client: 'KiCK Beverage Co.',
    category: 'Circular Emblem & Packaging Mark',
    src: '/assets/logo_card_kick.png',
    rotation: '0.5deg',
    topOffset: 'mt-2 sm:mt-4',
    wirePath: 'M 45 0 L 45 96',
    wireHeight: 96,
  },
  {
    id: 'eaterbucks',
    title: 'EATERBUCKS INDIAN',
    client: 'Eaterbucks Since 1999',
    category: 'Heritage QSR Badge Identity',
    src: '/assets/logo_card_eaterbucks.png',
    rotation: '0deg',
    topOffset: 'mt-24 sm:mt-32',
    wirePath: 'M 78 0 L 66 56 L 42 82 L 32 132 L 45 168',
    wireHeight: 168,
  },
];

interface LogoDesignSectionProps {
  onPlayClick: () => void;
}

export const LogoDesignSection: React.FC<LogoDesignSectionProps> = ({
  onPlayClick,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedLogo, setSelectedLogo] = useState<LogoCardItem | null>(null);
  const [showArchiveRow, setShowArchiveRow] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.logo-card-reveal',
        { y: -35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleToggleMore = () => {
    onPlayClick();
    setShowArchiveRow((prev) => !prev);
  };

  return (
    <section
      ref={sectionRef}
      id="logos"
      className="relative w-full bg-[#0d0d0d] pt-3 pb-3 px-1.5 sm:px-3 select-none overflow-hidden"
    >
      {/* Rounded Crumpled Paper Card inside Dark Frame (matching Image 2 top half) */}
      <div className="crumpled-paper-surface relative w-full rounded-[34px] sm:rounded-[44px] pt-6 pb-10 sm:pt-8 sm:pb-12 px-4 sm:px-8 overflow-visible shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
        {/* Top-left Flying Dove Cutout overlapping the card corner */}
        <img
          src="/assets/dove_top_left.png"
          alt="Flying dove cutout"
          className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3 w-[68px] sm:w-[82px] h-auto z-30 pointer-events-none drop-shadow-[2px_6px_8px_rgba(0,0,0,0.3)]"
        />

        {/* Section Title: LOGO (neon mint sticker outline) + Design (calligraphic script) */}
        <div className="relative z-20 inline-flex flex-col items-start ml-8 sm:ml-14 mt-2 sm:mt-4">
          <h2 className="sticker-mint text-[44px] sm:text-[54px] md:text-[60px] leading-[0.88] tracking-tight uppercase">
            LOGO
          </h2>
          <span className="font-calligraphy text-[38px] sm:text-[46px] md:text-[52px] text-[#0d0d0d] leading-[0.9] ml-16 sm:ml-24 -mt-1">
            Design
          </span>
        </div>

        {/* 4 Hanging Polaroid / Vintage Parchment Logo Frames */}
        <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 md:gap-7 items-start mt-2 sm:-mt-8 px-1 sm:px-3">
          {INITIAL_LOGOS.map((logo, index) => (
            <div
              key={logo.id}
              className={`logo-card-reveal relative flex flex-col items-center ${logo.topOffset}`}
            >
              {/* Double-line technical hanging wire from top of card */}
              <svg
                viewBox={`0 0 96 ${logo.wireHeight}`}
                className="hidden sm:block absolute bottom-[96%] left-1/2 -translate-x-1/2 w-[96px] pointer-events-none opacity-75"
                style={{ height: `${logo.wireHeight}px` }}
                fill="none"
              >
                <path
                  d={logo.wirePath}
                  stroke="#222"
                  strokeWidth="1.15"
                />
                <path
                  d={logo.wirePath}
                  transform="translate(4, 0)"
                  stroke="#222"
                  strokeWidth="1.15"
                />
              </svg>

              {/* Hanging Parchment Frame */}
              <div
                onClick={() => {
                  onPlayClick();
                  setSelectedLogo(logo);
                }}
                data-cursor="INSPECT"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedLogo(logo)}
                style={{ '--base-rot': logo.rotation } as React.CSSProperties}
                className="hanging-card relative cursor-pointer w-[130px] sm:w-[138px] md:w-[152px] group"
              >
                <img
                  src={logo.src}
                  alt={logo.title}
                  className="w-full h-auto object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.22)]"
                />

                {/* Second Flying Dove overlapping the 4th card (Eaterbucks) exactly as in Image 2 */}
                {index === 3 && (
                  <img
                    src="/assets/dove_right.png"
                    alt="Flying dove"
                    className="absolute -left-10 sm:-left-12 top-5 sm:top-6 w-[76px] sm:w-[92px] h-auto z-30 pointer-events-none drop-shadow-[2px_6px_8px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Extra Archive Drawer when "Loading more.." is clicked */}
        {showArchiveRow && (
          <div className="relative z-20 mt-8 pt-6 border-t border-black/15 grid grid-cols-1 sm:grid-cols-3 gap-4 px-2 sm:px-6 animate-fadeIn">
            {[
              {
                title: 'BOOM — Monograph Spec',
                desc: 'Custom wide-stance display logotype engineered for storefront signage & luxury tags.',
                tag: 'TYPOGRAPHIC SYSTEM',
              },
              {
                title: 'KING OF KITCHEN — Iconography',
                desc: 'Dual-meaning B monogram integrating a stockpot lid and tasting spoon in negative space.',
                tag: 'CULINARY IDENTITY',
              },
              {
                title: 'KiCK & EATERBUCKS — Badges',
                desc: 'High-contrast geometric emblems crafted for beverage cans and QSR packaging.',
                tag: 'PACKAGING & EMBLEM',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/80 backdrop-blur-xs border border-black/20 rounded-xl p-4 shadow-sm hover:border-[#00efb4] transition-colors"
              >
                <span className="inline-block font-pixel text-[9px] px-2 py-0.5 bg-[#fff200] text-black font-bold rounded mb-1.5">
                  {item.tag}
                </span>
                <h4 className="font-portfolio-display text-base font-bold text-black mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-black/75 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Bar: Pink Lotus (left) + "Loading more.." (center) + Twin Sunflowers (right) */}
        <div className="relative z-30 flex items-center justify-center mt-10 sm:mt-12 min-h-[48px]">
          {/* Pink Lotus Flower on bottom-left */}
          <img
            src="/assets/lotus_flower.png"
            alt="Pink lotus flower cutout"
            className="absolute -left-5 sm:-left-8 -bottom-14 sm:-bottom-16 w-[145px] sm:w-[185px] md:w-[205px] h-auto z-30 pointer-events-none drop-shadow-[0_10px_16px_rgba(0,0,0,0.28)]"
          />

          {/* Interactive "Loading more.." button matching the retro pixel/mono typography */}
          <button
            onClick={handleToggleMore}
            data-cursor={showArchiveRow ? 'HIDE SPECS' : 'LOAD SPECS'}
            className="font-pixel text-[15px] sm:text-[18px] md:text-[19px] font-bold tracking-tight text-[#0d0d0d] hover:text-[#a200ff] transition-colors cursor-pointer px-4 py-1.5 rounded-lg hover:bg-black/5 active:scale-95"
          >
            {showArchiveRow ? 'Showing specs ▲' : 'Loading more..'}
          </button>

          {/* Twin Sunflowers on bottom-right */}
          <img
            src="/assets/sunflowers_right.png"
            alt="Sunflowers cutout"
            className="absolute -right-4 sm:-right-8 -bottom-14 sm:-bottom-16 w-[75px] sm:w-[95px] md:w-[105px] h-auto z-30 pointer-events-none drop-shadow-[-4px_8px_14px_rgba(0,0,0,0.28)]"
          />
        </div>
      </div>

      {/* Lightbox Modal when clicking any hanging Polaroid Logo Card */}
      {selectedLogo && (
        <div
          onClick={() => setSelectedLogo(null)}
          className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="crumpled-paper-surface relative max-w-md w-full rounded-3xl p-6 sm:p-8 border-2 border-[#00efb4] shadow-2xl flex flex-col items-center text-center"
          >
            <button
              onClick={() => setSelectedLogo(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#a200ff] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={selectedLogo.src}
              alt={selectedLogo.title}
              className="w-48 sm:w-56 h-auto object-contain mb-4 drop-shadow-xl"
            />
            <span className="marker-yellow text-xs mb-2">{selectedLogo.category}</span>
            <h3 className="font-portfolio-display text-2xl font-bold text-black">
              {selectedLogo.title}
            </h3>
            <p className="text-sm text-black/75 mt-1">{selectedLogo.client}</p>
          </div>
        </div>
      )}
    </section>
  );
};
