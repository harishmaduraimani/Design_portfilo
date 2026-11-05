import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Copy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ThankYouSectionProps {
  onPlayClick: () => void;
}

export const ThankYouSection: React.FC<ThankYouSectionProps> = ({
  onPlayClick,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const boothRef = useRef<HTMLImageElement>(null);
  const [tapePlaying, setTapePlaying] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        boothRef.current,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
          },
        }
      );

      gsap.fromTo(
        '.thank-you-stagger',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 74%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    onPlayClick();
    navigator.clipboard?.writeText('harishmaduraimani@gmail.com').catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleToggleTape = () => {
    onPlayClick();
    setTapePlaying((prev) => !prev);
  };

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#0d0d0d] pt-3 pb-6 px-2.5 sm:px-5 select-none overflow-hidden"
    >
      {/* Rounded Crumpled Paper Card matching Image 3 */}
      <div className="crumpled-paper-surface relative w-full rounded-[38px] sm:rounded-[48px] pt-6 pb-8 sm:pt-8 sm:pb-10 px-4 sm:px-10 overflow-visible shadow-[0_18px_40px_rgba(0,0,0,0.75)]">
        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-[42%_58%] items-center gap-6 sm:gap-2">
          {/* LEFT: Red British Watercolor Telephone Booth with Harish inside */}
          <div className="flex justify-center sm:justify-start items-end">
            <img
              ref={boothRef}
              src="/assets/telephone_booth.png"
              alt="Red Telephone Booth with Harish on the phone"
              className="w-[215px] sm:w-[245px] md:w-[268px] h-auto object-contain -mt-2 -mb-6 sm:-mb-8 drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)] hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          {/* RIGHT: "Thank you" + DENON DX1/90 Cassette + @mr__hmmz & email */}
          <div className="flex flex-col items-center text-center pt-2 sm:pt-4 pr-0 sm:pr-4">
            <h2 className="thank-you-stagger font-portfolio-display text-[56px] sm:text-[68px] md:text-[76px] font-black text-[#090909] leading-[0.98] tracking-tight">
              Thank
              <br />
              you
            </h2>

            {/* Interactive DENON DX1/90 Cassette Tape with Spinning Reels */}
            <div
              onClick={handleToggleTape}
              data-cursor={tapePlaying ? 'PAUSE TAPE' : 'PLAY TAPE'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleToggleTape()}
              aria-label="Interactive Denon DX1/90 Cassette Tape - Click to toggle reel spin"
              className="thank-you-stagger relative group cursor-pointer w-[170px] sm:w-[192px] md:w-[205px] mt-5 mb-5 transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/assets/denon_cassette.png"
                alt="DENON DX1/90 Audio Cassette Tape"
                className="w-full h-auto object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.28)]"
              />

              {/* Left Spinning Cassette Spool */}
              <div
                className={`absolute rounded-full border border-dashed border-white/65 pointer-events-none ${
                  tapePlaying ? 'animate-spin' : ''
                }`}
                style={{
                  left: '24.5%',
                  top: '39.5%',
                  width: '13.5%',
                  height: '20.5%',
                  animationDuration: '3.2s',
                }}
              />

              {/* Right Spinning Cassette Spool */}
              <div
                className={`absolute rounded-full border border-dashed border-white/65 pointer-events-none ${
                  tapePlaying ? 'animate-spin' : ''
                }`}
                style={{
                  left: '61.5%',
                  top: '39.5%',
                  width: '13.5%',
                  height: '20.5%',
                  animationDuration: '3.2s',
                }}
              />
            </div>

            {/* Social Handle: @mr__hmmz */}
            <a
              href="https://instagram.com/mr__hmmz"
              target="_blank"
              rel="noreferrer"
              data-cursor="INSTAGRAM"
              className="thank-you-stagger font-portfolio-display text-[21px] sm:text-[24px] md:text-[26px] font-bold text-[#0b0b0b] hover:text-[#a200ff] transition-colors leading-tight"
            >
              @mr__hmmz
            </a>

            {/* Email Address with Click-to-Copy Interaction */}
            <button
              onClick={handleCopyEmail}
              data-cursor="COPY EMAIL"
              className="thank-you-stagger group inline-flex items-center gap-1.5 mt-1 font-portfolio-display text-[17px] sm:text-[21px] md:text-[23px] font-bold text-[#0b0b0b] hover:text-[#00b88a] transition-colors cursor-pointer"
            >
              <span>harishmaduraimani@gmail.com</span>
              {copiedEmail ? (
                <Check className="w-4 h-4 text-[#00b88a] shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-opacity shrink-0" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
