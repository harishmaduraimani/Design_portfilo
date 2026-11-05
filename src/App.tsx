import { useEffect, useRef, useState } from 'react';
import figmaSpecData from './data/figmaDesignSpec.json';
import { FigmaFrameCanvas, type FigmaFrameSpec } from './components/FigmaFrameCanvas';

const spec = figmaSpecData as {
  desktop: FigmaFrameSpec;
  tablet: FigmaFrameSpec;
  mobile: FigmaFrameSpec;
};

export function App() {
  const mainRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(() =>
    typeof window !== 'undefined'
      ? document.documentElement.clientWidth || window.innerWidth
      : 1440
  );

  useEffect(() => {
    const updateWidth = () => {
      if (mainRef.current && mainRef.current.clientWidth > 0) {
        setContainerWidth(mainRef.current.clientWidth);
      } else {
        setContainerWidth(document.documentElement.clientWidth || window.innerWidth);
      }
    };

    updateWidth();

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateWidth())
        : null;

    if (observer && mainRef.current) {
      observer.observe(mainRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Select the authentic Figma frame designed for the current breakpoint:
  // - >= 1024px: Main Desktop Frame (1440 x 5552)
  // - 600px .. 1023px: Tablet — 768px (768 x 5943)
  // - < 600px: Mobile — 375px (375 x 7332)
  let activeFrame: FigmaFrameSpec = spec.desktop;
  if (containerWidth < 600) {
    activeFrame = spec.mobile;
  } else if (containerWidth < 1024) {
    activeFrame = spec.tablet;
  }

  // Proportionally scale the active Figma frame to occupy 100% of the available container width,
  // eliminating left/right empty margins on all screen sizes while preserving 100% of the
  // original Figma design proportions, internal element coordinates, and aspect ratios.
  const scale = containerWidth > 0 ? containerWidth / activeFrame.width : 1;

  return (
    <main ref={mainRef} className="main-container">
      <FigmaFrameCanvas frame={activeFrame} scale={scale} />
    </main>
  );
}

export default App;
