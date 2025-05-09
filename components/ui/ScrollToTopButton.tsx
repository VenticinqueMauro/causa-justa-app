'use client';

import React, { useState, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  threshold?: number;
  className?: string;
}

export default function ScrollToTopButton({
  threshold = 300,
  className = '',
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Use Lenis for scroll tracking and smooth scrolling
  const lenis = useLenis(({ scroll }) => {
    // Show button when scroll position is beyond threshold
    setIsVisible(scroll > threshold);
  });

  const scrollToTop = () => {
    // Use Lenis smooth scrolling to go to top
    lenis?.scrollTo(0, { 
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 bg-[#002C5B] text-white rounded-full shadow-lg border-2 border-[#EDFCA7] z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      } ${className}`}
      aria-label="Volver al inicio"
    >
      <ArrowUp size={20} />
    </button>
  );
}
