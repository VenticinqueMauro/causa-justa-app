'use client';

import React, { ReactNode } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out';

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  animation?: AnimationType;
  distance?: number;
}

export default function RevealSection({
  children,
  className = '',
  threshold = 0.1,
  delay = 0,
  duration = 800,
  once = true,
  animation = 'fade-up',
  distance = 30,
}: RevealSectionProps) {
  const ref = useScrollReveal<HTMLDivElement>({
    threshold,
    delay,
    duration,
    once,
    animation,
    distance,
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
