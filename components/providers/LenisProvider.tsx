'use client';

import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

type Orientation = 'vertical' | 'horizontal';
type GestureOrientation = 'vertical' | 'horizontal' | 'both';

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  // Options for Lenis smooth scrolling
  const options = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical' as Orientation,
    gestureOrientation: 'vertical' as GestureOrientation,
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    autoResize: true,
  };

  return (
    <ReactLenis 
      root 
      options={options}
      className="scroll-smooth"
    >
      {children}
    </ReactLenis>
  );
}
