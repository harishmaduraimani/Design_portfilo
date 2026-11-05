import { useCallback, useRef, useState } from 'react';

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (isMuted) return null;
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, [isMuted]);

  /** Realistic mechanical DSLR/compact camera shutter + flash capacitor whine */
  const playShutterSound = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. White noise burst for mirror/curtain snap
    const bufferSize = ctx.sampleRate * 0.085;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.018));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(1.4, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    whiteNoise.start(now);

    // 2. Second curtain click (45ms later)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(920, now + 0.045);
    clickOsc.frequency.exponentialRampToValueAtTime(180, now + 0.085);

    clickGain.gain.setValueAtTime(0.35, now + 0.045);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now + 0.045);
    clickOsc.stop(now + 0.095);

    // 3. Subtle Canon digital focus beep before shutter
    const beepOsc = ctx.createOscillator();
    const beepGain = ctx.createGain();
    beepOsc.type = 'sine';
    beepOsc.frequency.setValueAtTime(3200, now);
    beepGain.gain.setValueAtTime(0.08, now);
    beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    beepOsc.connect(beepGain);
    beepGain.connect(ctx.destination);
    beepOsc.start(now);
    beepOsc.stop(now + 0.04);
  }, [getContext]);

  /** Retro CRT TV channel knob click + static burst */
  const playTVStaticBurst = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.16;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25 * Math.exp(-i / (ctx.sampleRate * 0.06));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1200, now);

    noise.connect(bandpass);
    bandpass.connect(ctx.destination);
    noise.start(now);
  }, [getContext]);

  /** Tactile mechanical click for cassette tape or Polaroid inspection */
  const playTactileClick = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.03);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }, [getContext]);

  return {
    isMuted,
    toggleMute: () => setIsMuted((m) => !m),
    playShutterSound,
    playTVStaticBurst,
    playTactileClick,
  };
}
