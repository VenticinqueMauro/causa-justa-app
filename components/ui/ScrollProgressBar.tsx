'use client';

import React, { useState } from 'react';
import { useLenis } from 'lenis/react';

interface ScrollProgressBarProps {
  color?: string;
  height?: number;
  zIndex?: number;
}

export default function ScrollProgressBar({
  color = '#EDFCA7',
  height = 4,
  zIndex = 50,
}: ScrollProgressBarProps) {
  const [progress, setProgress] = useState(0);

  // Use Lenis for scroll tracking
  useLenis(({ scroll, limit, progress }) => {
    // Update progress based on scroll position
    setProgress(progress);
  });

  return (
    <div 
      className="fixed top-0 left-0 w-full pointer-events-none"
      style={{ zIndex }}
    >
      <div 
        className="h-full transition-transform duration-150 ease-out"
        style={{
          height: `${height}px`,
          backgroundColor: color,
          transform: `scaleX(${progress})`,
          transformOrigin: 'left',
        }}
      />
    </div>
  );
}
