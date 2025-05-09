'use client';

import React, { ReactNode } from 'react';
import useParallax from '@/hooks/useParallax';

interface ParallaxBackgroundProps {
  children?: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  maxMovement?: number;
}

export default function ParallaxBackground({
  children,
  className = '',
  speed = 0.1,
  direction = 'up',
  maxMovement = 100,
}: ParallaxBackgroundProps) {
  const ref = useParallax<HTMLDivElement>({
    speed,
    direction,
    maxMovement,
  });

  return (
    <div ref={ref} className={`${className} overflow-hidden`}>
      {children}
    </div>
  );
}
