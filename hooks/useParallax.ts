'use client';

import { useRef, useEffect } from 'react';
import { useLenis } from 'lenis/react';

type ParallaxOptions = {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  maxMovement?: number;
  ease?: number;
};

export default function useParallax<T extends HTMLElement>(
  options: ParallaxOptions = {}
) {
  const {
    speed = 0.1,
    direction = 'up',
    maxMovement = 100,
    ease = 0.1, // Smoothing factor for the parallax effect
  } = options;
  
  const ref = useRef<T>(null);
  const initialPositionRef = useRef<number | null>(null);
  const currentMovementRef = useRef<number>(0); // Store current movement for smooth transitions
  
  // Calculate movement based on direction
  const calculateTransform = (scrollPos: number, elementPos: number, viewportHeight: number) => {
    // Calculate element's position relative to the viewport center
    const windowCenter = viewportHeight / 2;
    const elementCenter = elementPos - scrollPos + (ref.current?.offsetHeight || 0) / 2;
    const distanceFromCenter = elementCenter - windowCenter;
    
    // Calculate movement based on distance from center (more movement when closer to center)
    const movement = distanceFromCenter * speed;
    
    // Apply easing to the movement for smoother transitions
    currentMovementRef.current += (movement - currentMovementRef.current) * ease;
    
    // Limit maximum movement
    const limitedMovement = Math.min(Math.max(currentMovementRef.current, -maxMovement), maxMovement);
    
    switch (direction) {
      case 'up':
        return `translateY(${-limitedMovement}px)`;
      case 'down':
        return `translateY(${limitedMovement}px)`;
      case 'left':
        return `translateX(${-limitedMovement}px)`;
      case 'right':
        return `translateX(${limitedMovement}px)`;
      default:
        return `translateY(${-limitedMovement}px)`;
    }
  };

  useLenis(({ scroll }) => {
    const element = ref.current;
    if (!element) return;

    // Get the element's position relative to the document
    const rect = element.getBoundingClientRect();
    const elementPos = rect.top + scroll;
    const viewportHeight = window.innerHeight;
    
    // Store initial position if not already stored
    if (initialPositionRef.current === null) {
      initialPositionRef.current = elementPos;
    }
    
    // Apply parallax effect with will-change for better performance
    if (!element.style.willChange) {
      element.style.willChange = 'transform';
    }
    
    // Apply the transform
    element.style.transform = calculateTransform(scroll, elementPos, viewportHeight);
  });

  useEffect(() => {
    // Reset transform and will-change on unmount
    return () => {
      if (ref.current) {
        ref.current.style.transform = '';
        ref.current.style.willChange = '';
      }
    };
  }, []);

  return ref;
}
