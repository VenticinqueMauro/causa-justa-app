'use client';

import React, { ReactNode, useRef, useEffect } from 'react';
import { useLenis } from 'lenis/react';

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  containerClassName?: string;
}

export default function HorizontalScroll({
  children,
  className = '',
  speed = 1,
  containerClassName = '',
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  
  // Use Lenis for scroll tracking
  useLenis(({ scroll, limit, velocity, direction, progress }) => {
    if (!containerRef.current || !scrollRef.current) return;
    
    // Calculate how much we should scroll horizontally based on vertical scroll
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Only apply horizontal scroll when the container is in view
    if (containerRect.bottom > 0 && containerRect.top < window.innerHeight) {
      // Calculate how far through the section we've scrolled (0-1)
      const viewportHeight = window.innerHeight;
      const sectionHeight = containerRef.current.offsetHeight;
      const sectionTop = containerRect.top;
      
      // Improved calculation that works better on all screen sizes
      // This ensures the animation progresses based on the container's position in the viewport
      const sectionProgress = Math.min(
        Math.max(
          (viewportHeight - sectionTop) / (viewportHeight + sectionHeight * 0.8),
          0
        ),
        1
      );
      
      // Apply smoother easing to the progress
      progressRef.current += (sectionProgress - progressRef.current) * 0.08;
      
      // Calculate the horizontal scroll position
      const scrollWidth = scrollRef.current.scrollWidth;
      const containerWidth = scrollRef.current.offsetWidth;
      
      // Ensure we have content that needs scrolling
      const maxScroll = Math.max(0, scrollWidth - containerWidth);
      
      // Adjust speed based on screen width to ensure consistent experience
      const adjustedSpeed = speed * (Math.min(1920, window.innerWidth) / 1200);
      
      // Only apply scrolling if there's content that overflows
      if (maxScroll > 0) {
        const scrollPos = maxScroll * progressRef.current * adjustedSpeed;
        
        // Apply the transform with hardware acceleration
        scrollRef.current.style.transform = `translate3d(${-scrollPos}px, 0, 0)`;
      }
    }
  });

  useEffect(() => {
    if (!scrollRef.current) return;
    
    // Set initial styles for better performance
    scrollRef.current.style.willChange = 'transform';
    
    return () => {
      if (scrollRef.current) {
        scrollRef.current.style.willChange = '';
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${containerClassName}`}>
      <div 
        ref={scrollRef} 
        className={`flex flex-nowrap ${className}`}
        style={{ 
          display: 'flex',
          flexWrap: 'nowrap',
          transition: 'transform 0.05s linear',
        }}
      >
        {children}
      </div>
    </div>
  );
}
