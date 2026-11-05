import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AboutCameraSectionProps {
  onTriggerCameraFlash: () => void;
}

const CAMERA_PHOTOS = [
  {
    counter: '100-0021',
    title: 'HMM Dez!N',
    src: '/assets/camera_screen_photo.png',
    timestamp: '2026/11/05 15:42',
  },
  {
    counter: '100-0022',
    title: 'STUDIO CUT',
    src: '/assets/tv_screen_photo.png',
    timestamp: '2026/11/05 16:08',
  },
  {
    counter: '100-0023',
    title: 'KING KITCHEN',
    src: '/assets/brand_card_b.png',
    timestamp: '2026/11/05 17:19',
  },
  {
    counter: '100-0024',
    title: 'KICK NATURAL',
    src: '/assets/brand_card_kick.png',
    timestamp: '2026/11/05 18:04',
  },
];

const SKILLS_LIST = [
  { name: 'LOGO', path: 'M 0 12 L 56 12 L 72 2 L 105 2 L 125 14' },
  { name: 'Banding', path: 'M 0 14 L 46 22 L 74 4 L 100 4 L 125 18' },
  { name: 'Packaging', path: 'M 0 12 L 38 22 L 64 6 L 98 6' },
  { name: 'Billboard', path: 'M 0 12 L 42 20 L 68 4 L 98 4' },
  { name: 'Print', path: 'M 0 12 L 48 18 L 74 2 L 105 2' },
];

export const AboutCameraSection: React.FC<AboutCameraSectionProps> = ({
  onTriggerCameraFlash,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cameraWrapRef = useRef<HTMLDivElement>(null);
  const bioTextRef = useRef<HTMLParagraphElement>(null);
  const skillsColRef = useRef<HTMLDivElement>(null);
  const clapperRef = useRef<HTMLImageElement>(null);

  const [photoIdx, setPhotoIdx] = useState(0);
  const [shutterClosing, setShutterClosing] = useState(false);
  const [localFlash, setLocalFlash] = useState(false);
  const [clapperSnap, setClapperSnap] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cameraWrapRef.current,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.about-stagger',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 76%',
          },
        }
      );

      gsap.fromTo(
        '.skill-row-item',
        { x: 25, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.09,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: skillsColRef.current,
            start: 'top 82%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCapturePhoto = () => {
    // 1. Trigger shutter curtain close
    setShutterClosing(true);
    // 2. Trigger synchronized camera flash + sound
    setLocalFlash(true);
    onTriggerCameraFlash();

    // Camera recoil physics
    if (cameraWrapRef.current) {
      gsap.fromTo(
        cameraWrapRef.current,
        { scale: 0.96, rotate: -1.5 },
        { scale: 1, rotate: 0, duration: 0.45, ease: 'elastic.out(1.2, 0.4)' }
      );
    }

    setTimeout(() => {
      setPhotoIdx((prev) => (prev + 1) % CAMERA_PHOTOS.length);
    }, 95);

    setTimeout(() => {
      setShutterClosing(false);
    }, 240);

    setTimeout(() => {
      setLocalFlash(false);
    }, 500);
  };

  const handleClapperClick = () => {
    setClapperSnap(true);
    onTriggerCameraFlash();
    setTimeout(() => setClapperSnap(false), 350);
  };

  const currentPhoto = CAMERA_PHOTOS[photoIdx];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full pt-7 pb-12 sm:pt-9 sm:pb-14 px-2 sm:px-5 overflow-hidden select-none"
    >
      {/* 3-Column Editorial Grid matching Image 1 bottom half */}
      <div className="grid grid-cols-1 md:grid-cols-[33.5%_37.5%_29%] gap-6 md:gap-2 items-start relative z-10">
        {/* =======================================================
            LEFT COLUMN: INTERACTIVE CANON DIGITAL CAMERA + DAISIES
           ======================================================= */}
        <div className="relative flex flex-col items-center md:items-start">
          <div
            ref={cameraWrapRef}
            onClick={handleCapturePhoto}
            data-cursor="SNAP PHOTO"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCapturePhoto()}
            aria-label="Interactive Canon PowerShot Camera - Click to snap photo and trigger flash"
            className="relative group cursor-pointer w-[240px] sm:w-[265px] md:w-full max-w-[275px] aspect-[155/224] -ml-1 sm:-ml-2 transition-transform duration-300 hover:scale-[1.015]"
          >
            {/* Base Canon Digital Camera Body */}
            <img
              src="/assets/canon_camera.png"
              alt="Canon Digital Camera"
              className="w-full h-full object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.28)] relative z-10 pointer-events-none"
            />

            {/* Optical Viewfinder Flash Burst Lens (right of LCD screen) */}
            <div
              className={`absolute z-30 rounded-full pointer-events-none transition-all duration-200 ${
                localFlash
                  ? 'bg-white shadow-[0_0_55px_28px_rgba(255,255,255,0.98)] scale-150 opacity-100'
                  : 'bg-cyan-300/20 group-hover:bg-white/40 opacity-75'
              }`}
              style={{
                left: '78%',
                top: '41.5%',
                width: '13%',
                height: '9.5%',
              }}
            />

            {/* Blinking AF / Recording LED Indicator */}
            <div
              className="absolute z-30 w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66] camera-led-pulse pointer-events-none"
              style={{ left: '78.5%', top: '53.8%' }}
            />

            {/* Interactive LCD Screen Overlay positioned strictly over the camera display */}
            <div
              className="absolute z-20 overflow-hidden rounded-[2px] bg-[#101820] shadow-inner"
              style={{
                left: '12.9%',
                top: '7.6%',
                width: '57.4%',
                height: '50.4%',
              }}
            >
              {/* Current Camera LCD Frame */}
              <img
                src={currentPhoto.src}
                alt={currentPhoto.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Camera Viewfinder HUD (PLAY ▶, 100-0021, Battery, Focus Brackets) */}
              <div className="absolute inset-0 p-1.5 flex flex-col justify-between pointer-events-none font-mono text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between text-[7px] sm:text-[8px] tracking-tighter opacity-90">
                  <span className="bg-black/45 px-1 py-0.2 rounded-[1px]">PLAY ▶</span>
                  <span>{currentPhoto.counter}</span>
                </div>

                {/* Center Focus Crosshair on Hover */}
                <div className="self-center my-auto w-8 h-6 border border-[#00efb4]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#00efb4]" />
                </div>

                <div className="flex items-center justify-between text-[6.5px] sm:text-[7.5px] opacity-90">
                  <span>{currentPhoto.timestamp.split(' ')[0]}</span>
                  <span className="px-1 bg-[#00efb4]/80 text-black font-bold rounded-[1px]">
                    FULL
                  </span>
                </div>
              </div>

              {/* Mechanical Aperture / Shutter Blades Animation */}
              <div
                className={`absolute inset-0 z-30 pointer-events-none flex flex-col transition-opacity duration-75 ${
                  shutterClosing ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div
                  className={`w-full bg-[#0a0a0a] border-b border-white/20 transition-all duration-100 ${
                    shutterClosing ? 'h-1/2' : 'h-0'
                  }`}
                />
                <div
                  className={`w-full bg-[#0a0a0a] border-t border-white/20 mt-auto transition-all duration-100 ${
                    shutterClosing ? 'h-1/2' : 'h-0'
                  }`}
                />
              </div>
            </div>

            {/* Tactile D-Pad Center Shutter Button Highlight */}
            <div
              className="absolute z-30 rounded-full border border-white/40 group-hover:border-[#00efb4] group-hover:shadow-[0_0_12px_rgba(0,239,180,0.75)] flex items-center justify-center transition-all"
              style={{
                left: '37.2%',
                top: '77.8%',
                width: '14.5%',
                height: '10.2%',
              }}
              title="Click to snap photo"
            >
              <Camera className="w-3 h-3 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* White Chamomile Daisy Bouquet overlapping bottom-left + circuit traces */}
          <div className="relative w-full h-[90px] sm:h-[115px] -mt-10 flex items-end">
            <img
              src="/assets/daisy_bottom_left.png"
              alt="White chamomile daisy bouquet"
              className="w-[155px] sm:w-[180px] h-auto object-contain z-20 -ml-3 pointer-events-none drop-shadow-[2px_6px_12px_rgba(0,0,0,0.18)]"
            />
            {/* Decorative Technical Circuit Lines extending down from camera */}
            <svg
              viewBox="0 0 80 120"
              className="w-16 h-28 -ml-4 mb-1 opacity-75 pointer-events-none"
              fill="none"
            >
              <path
                d="M 28 0 L 28 32 L 16 48 L 16 84 L 6 118"
                stroke="#222"
                strokeWidth="1.2"
              />
              <path
                d="M 34 0 L 34 34 L 22 50 L 22 86 L 12 118"
                stroke="#222"
                strokeWidth="1.2"
              />
              <circle cx="28" cy="32" r="2" fill="#222" />
              <circle cx="16" cy="84" r="2" fill="#222" />
            </svg>
          </div>
        </div>

        {/* =======================================================
            CENTER COLUMN: "hello I'm Harish" + BIO + CLAPPERBOARD
           ======================================================= */}
        <div className="flex flex-col items-start pt-1 sm:pt-2 px-2 md:px-1 relative z-20">
          {/* Heading: hello (purple outline) + I'm (italic serif) */}
          <div className="about-stagger flex items-baseline gap-2.5 sm:gap-3 flex-wrap leading-none mb-1">
            <span className="sticker-purple text-[44px] sm:text-[52px] md:text-[54px] tracking-tight">
              hello
            </span>
            <span className="font-editorial-serif italic font-normal text-[44px] sm:text-[52px] md:text-[54px] text-[#090909]">
              I’m
            </span>
          </div>

          {/* Subheading: Harish (neon mint/teal outline) */}
          <h2 className="about-stagger sticker-mint text-[48px] sm:text-[56px] md:text-[58px] leading-[1.05] mb-3 sm:mb-4">
            Harish
          </h2>

          {/* Editorial Bio Copy matching the exact text in Image 1 */}
          <p
            ref={bioTextRef}
            className="about-stagger font-sans text-[13.5px] sm:text-[14.5px] md:text-[14.2px] leading-[1.42] text-[#141414] font-medium max-w-[340px] tracking-[-0.01em]"
          >
            I make brands impossible to ignore. As a graphic designer specializing
            in brand identity, logo design, posters, and large-format outdoor
            media, I create visuals built to command attention across any space. My
            work spans the entire spectrum of scale—from crafting sharp, memorable
            logos that anchor a company’s identity to designing high-impact
            billboards and campaign posters that stop people in their tracks. By
            combining bold typography, intentional composition, and clear visual
            hierarchy, I translate concepts into striking visual systems that leave
            an undeniable, lasting mark.
          </p>

          {/* Clapperboard ("MY LIFE", Scene 32) at bottom-center */}
          <div className="about-stagger w-full flex justify-end pr-2 sm:pr-6 mt-3 sm:mt-4">
            <img
              ref={clapperRef}
              onClick={handleClapperClick}
              data-cursor="ACTION!"
              src="/assets/clapperboard.png"
              alt="Director Clapperboard MY LIFE Scene 32"
              className={`w-[125px] sm:w-[142px] h-auto object-contain cursor-pointer transition-transform duration-200 drop-shadow-[0_8px_14px_rgba(0,0,0,0.22)] ${
                clapperSnap ? 'rotate-[-14deg] scale-95' : 'rotate-[-4deg] hover:rotate-0 hover:scale-105'
              }`}
            />
          </div>
        </div>

        {/* =======================================================
            RIGHT COLUMN: "Skills" + Ps/Ai/Procreate + YELLOW TAGS + TOOLBAR
           ======================================================= */}
        <div
          ref={skillsColRef}
          className="relative flex flex-col items-start pt-3 sm:pt-4 pl-2 md:pl-3 min-h-[430px]"
        >
          {/* Skills Heading (purple sticker outline) */}
          <h3 className="about-stagger sticker-purple text-[40px] sm:text-[46px] md:text-[48px] leading-none mb-3.5">
            Skills
          </h3>

          {/* Software Icons Row: Photoshop (Ps), Illustrator (Ai), Procreate */}
          <div className="about-stagger flex items-center gap-2.5 sm:gap-3 mb-5">
            {/* Adobe Photoshop Badge */}
            <div
              data-cursor="PHOTOSHOP"
              className="w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-[11px] bg-[#001e36] border-2 border-[#31a8ff]/40 shadow-md flex items-center justify-center text-[#31a8ff] font-sans font-extrabold text-[22px] tracking-tighter hover:scale-110 hover:-rotate-3 transition-transform"
            >
              Ps
            </div>

            {/* Adobe Illustrator Badge */}
            <div
              data-cursor="ILLUSTRATOR"
              className="w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-[11px] bg-[#330000] border-2 border-[#ff9a00]/40 shadow-md flex items-center justify-center text-[#ff9a00] font-sans font-extrabold text-[22px] tracking-tighter hover:scale-110 hover:rotate-3 transition-transform"
            >
              Ai
            </div>

            {/* Procreate Badge (Cropped high-res icon) */}
            <div
              data-cursor="PROCREATE"
              className="w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-[11px] overflow-hidden shadow-md hover:scale-110 hover:-rotate-3 transition-transform bg-[#161616]"
            >
              <img
                src="/assets/procreate_icon.png"
                alt="Procreate"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Yellow Highlighter Skill Items + Technical Circuit Trace Lines */}
          <div className="flex flex-col gap-3.5 sm:gap-4 w-full relative z-10 pr-12">
            {SKILLS_LIST.map((skill) => (
              <div
                key={skill.name}
                className="skill-row-item flex items-center gap-1.5 group"
              >
                <span className="marker-yellow text-[18px] sm:text-[20px] md:text-[21px] leading-tight group-hover:scale-105 transition-transform">
                  {skill.name}
                </span>

                {/* Double-line technical circuit trace extending to the right */}
                <svg
                  viewBox="0 0 130 26"
                  className="w-[95px] sm:w-[115px] h-[22px] overflow-visible opacity-80 group-hover:opacity-100 transition-opacity"
                  fill="none"
                >
                  <path
                    d={skill.path}
                    stroke="#1a1a1a"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                  />
                  <path
                    d={skill.path}
                    transform="translate(0, 3.2)"
                    stroke="#1a1a1a"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                  />
                  <circle cx="2" cy="12" r="1.6" fill="#1a1a1a" />
                </svg>
              </div>
            ))}
          </div>

          {/* Tilted Photoshop Toolbar Strip on bottom-right edge */}
          <img
            src="/assets/ps_toolbar.png"
            alt="Photoshop Tools Palette"
            className="absolute -right-2 sm:-right-4 -bottom-10 w-[68px] sm:w-[78px] md:w-[82px] h-auto object-contain z-20 pointer-events-none drop-shadow-[-4px_6px_12px_rgba(0,0,0,0.28)]"
          />
        </div>
      </div>
    </section>
  );
};
