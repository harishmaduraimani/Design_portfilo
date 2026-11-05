import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';

interface HeroTVSectionProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onPlayStatic: () => void;
}

const TV_CHANNELS = [
  {
    id: 'CH-01',
    label: 'DIRECTOR CUT',
    src: '/assets/tv_screen_photo.png',
    filter: 'contrast(1.08) saturate(1.12)',
  },
  {
    id: 'CH-02',
    label: 'CYBER ARCHIVE',
    src: '/assets/camera_screen_photo.png',
    filter: 'contrast(1.2) saturate(1.35) hue-rotate(-10deg)',
  },
  {
    id: 'CH-03',
    label: 'BRAND REEL',
    src: '/assets/brand_card_boom.png',
    filter: 'contrast(1.15) sepia(0.22)',
  },
];

export const HeroTVSection: React.FC<HeroTVSectionProps> = ({
  isMuted,
  onToggleMute,
  onPlayStatic,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tvContainerRef = useRef<HTMLDivElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const portRef = useRef<HTMLHeadingElement>(null);
  const folioRef = useRef<HTMLHeadingElement>(null);

  const [channelIdx, setChannelIdx] = useState(0);
  const [isGlitching, setIsGlitching] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [dialRotation, setDialRotation] = useState(0);

  // Startup CRT power-on sequence
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 950);
    const glitchTimer = setTimeout(() => {
      setIsGlitching(false);
    }, 1500);

    // Random subtle periodic signal interference every 5.5s
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 260);
    }, 5500);

    return () => {
      clearTimeout(bootTimer);
      clearTimeout(glitchTimer);
      clearInterval(interval);
    };
  }, []);

  // Live CRT Static Noise Canvas
  useEffect(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const renderStatic = () => {
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
      animId = requestAnimationFrame(renderStatic);
    };

    renderStatic();
    return () => cancelAnimationFrame(animId);
  }, []);

  // GSAP Entrance Animation for PORT / TV / FOLIO
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        portRef.current,
        { x: -35, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo(
        folioRef.current,
        { x: 35, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo(
        tvContainerRef.current,
        { scale: 0.9, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.85, ease: 'back.out(1.4)' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSwitchChannel = () => {
    onPlayStatic();
    setIsGlitching(true);
    setDialRotation((r) => r + 45);
    setTimeout(() => {
      setChannelIdx((prev) => (prev + 1) % TV_CHANNELS.length);
    }, 120);
    setTimeout(() => {
      setIsGlitching(false);
    }, 420);
  };

  const currentChannel = TV_CHANNELS[channelIdx];

  return (
    <section
      ref={sectionRef}
      className="relative w-full pt-4 pb-10 sm:pt-5 sm:pb-12 px-4 sm:px-7 select-none overflow-visible"
    >
      {/* Top Bar: HARISH MM (left) & @mr__hmmz + Audio Toggle (right) */}
      <header className="relative z-20 flex items-center justify-between w-full mb-12 sm:mb-16">
        <a
          href="#top"
          className="font-portfolio-display text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-tight text-[#0d0d0d] leading-none hover:opacity-80 transition-opacity"
        >
          HARISH MM
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            data-cursor={isMuted ? 'UNMUTE' : 'MUTE'}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-black/25 bg-white/75 hover:bg-black hover:text-[#00efb4] transition-colors shadow-xs cursor-pointer"
            title={isMuted ? 'Enable retro sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <a
            href="#contact"
            data-cursor="CONTACT"
            className="font-typewriter text-[19px] sm:text-[23px] md:text-[25px] font-bold tracking-tight text-[#0d0d0d] leading-none hover:text-[#a200ff] transition-colors"
          >
            @mr__hmmz
          </a>
        </div>
      </header>

      {/* Main Hero Stage: PORT + CRT Television + FOLIO */}
      <div className="relative z-10 flex items-center justify-center w-full my-4 sm:my-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-[920px] mx-auto gap-1 sm:gap-2 md:gap-3">
          {/* Left: PORT */}
          <h1
            ref={portRef}
            className="font-portfolio-display text-[11vw] sm:text-[64px] md:text-[78px] lg:text-[86px] font-black text-[#090909] leading-none tracking-[-0.03em] text-right pr-1 sm:pr-2"
          >
            PORT
          </h1>

          {/* Center: 1970s Woodgrain CRT Television with Live Interactive Screen */}
          <div
            ref={tvContainerRef}
            onClick={handleSwitchChannel}
            data-cursor="TUNE TV"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSwitchChannel()}
            aria-label="Interactive Retro CRT Television - Click to tune channel"
            className="relative group cursor-pointer w-[41vw] min-w-[175px] max-w-[335px] sm:w-[295px] md:w-[335px] aspect-[203/128] mx-auto transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Base Woodgrain Television Frame Image */}
            <img
              src="/assets/tv_unit.png"
              alt="Vintage 1970s CRT Television"
              className="w-full h-full object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.32)] relative z-10 pointer-events-none"
            />

            {/* Interactive CRT Glass Tube Overlay positioned strictly over the TV screen aperture */}
            <div
              className={`absolute z-20 overflow-hidden rounded-[13%/16%] bg-[#080b10] crt-vignette ${
                isBooting ? 'crt-power-boot' : 'crt-live-glitch'
              }`}
              style={{
                left: '15.8%',
                top: '11.2%',
                width: '64.3%',
                height: '77.2%',
              }}
            >
              {/* Main RGB Channel Layer */}
              <div
                className={`relative w-full h-full transition-transform duration-75 ${
                  isGlitching ? 'scale-[1.04] translate-x-[3px] -skew-x-3' : 'scale-100'
                }`}
              >
                {/* Red / Cyan RGB Split Ghost Layers visible during glitch or hover */}
                <img
                  src={currentChannel.src}
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none transition-opacity duration-150 ${
                    isGlitching
                      ? 'opacity-85 translate-x-[5px] -translate-y-[1px]'
                      : 'opacity-0 group-hover:opacity-50 group-hover:translate-x-[2.5px]'
                  }`}
                  style={{ filter: 'hue-rotate(-45deg) saturate(3)' }}
                />
                <img
                  src={currentChannel.src}
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none transition-opacity duration-150 ${
                    isGlitching
                      ? 'opacity-85 -translate-x-[5px] translate-y-[1px]'
                      : 'opacity-0 group-hover:opacity-50 group-hover:-translate-x-[2.5px]'
                  }`}
                  style={{ filter: 'hue-rotate(140deg) saturate(3)' }}
                />

                {/* Primary Screen Photograph */}
                <img
                  src={currentChannel.src}
                  alt="Harish MM on CRT Screen"
                  className="w-full h-full object-cover"
                  style={{ filter: currentChannel.filter }}
                />

                {/* Horizontal displacement tear bar during glitch */}
                {isGlitching && (
                  <div
                    className="absolute inset-x-0 h-[18%] bg-white/25 mix-blend-overlay backdrop-invert"
                    style={{ top: `${20 + ((channelIdx * 29) % 55)}%`, transform: 'translateX(-8px)' }}
                  />
                )}
              </div>

              {/* Dynamic Static Noise Canvas Overlay */}
              <canvas
                ref={staticCanvasRef}
                width={96}
                height={72}
                className={`absolute inset-0 w-full h-full pointer-events-none mix-blend-screen transition-opacity duration-150 ${
                  isGlitching ? 'opacity-55' : 'opacity-[0.08] group-hover:opacity-[0.14]'
                }`}
              />

              {/* CRT Scanlines + Curved Glass Specular Reflection */}
              <div className="absolute inset-0 crt-scanlines pointer-events-none z-20" />
              <div
                className="absolute inset-0 pointer-events-none z-30"
                style={{
                  background:
                    'radial-gradient(circle at 26% 22%, rgba(255,255,255,0.22) 0%, transparent 45%), radial-gradient(circle at 50% 50%, transparent 58%, rgba(0,0,0,0.62) 100%)',
                }}
              />

              {/* Retro OSD Channel Indicator */}
              <div
                className={`absolute top-2 left-2.5 z-30 font-pixel text-[8px] sm:text-[9px] tracking-widest px-1.5 py-0.5 rounded bg-black/55 text-[#00ff66] drop-shadow-[0_0_4px_#00ff66] transition-opacity duration-300 ${
                  isGlitching ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {currentChannel.id} • {currentChannel.label}
              </div>
            </div>

            {/* Interactive Rotary Tuning Knob Indicator on top-right of TV */}
            <div
              className="absolute z-30 rounded-full pointer-events-none transition-transform duration-300"
              style={{
                right: '6.8%',
                top: '13.2%',
                width: '9.5%',
                height: '15%',
                transform: `rotate(${dialRotation}deg)`,
              }}
            />
          </div>

          {/* Right: FOLIO */}
          <h1
            ref={folioRef}
            className="font-portfolio-display text-[11vw] sm:text-[64px] md:text-[78px] lg:text-[86px] font-black text-[#090909] leading-none tracking-[-0.03em] text-left pl-1 sm:pl-2"
          >
            FOLIO
          </h1>
        </div>
      </div>

      {/* Decorative Collage Cutouts at bottom of Hero Section */}
      {/* 1. Half Sunflower on bottom-left edge */}
      <img
        src="/assets/sunflower_left.png"
        alt="Sunflower cutout"
        className="hero-parallax-left absolute -left-1 bottom-[-26px] sm:bottom-[-34px] w-[76px] sm:w-[98px] md:w-[112px] h-auto z-20 pointer-events-none select-none drop-shadow-[2px_6px_10px_rgba(0,0,0,0.2)]"
      />

      {/* 2. Newspaper Wildflower Bouquet on right edge (overlaps the black ticker bar) */}
      <img
        src="/assets/bouquet_right.png"
        alt="Wildflower newspaper bouquet"
        className="hero-parallax-right absolute right-0 bottom-[-52px] sm:bottom-[-68px] w-[108px] sm:w-[138px] md:w-[156px] h-auto z-30 pointer-events-none select-none drop-shadow-[-4px_8px_12px_rgba(0,0,0,0.22)]"
      />
    </section>
  );
};
