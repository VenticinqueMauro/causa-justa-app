'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out';

type ScrollRevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
  duration?: number;
  easing?: string;
  animation?: AnimationType;
  distance?: number;
};

export default function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true,
    delay = 0,
    duration = 800,
    easing = 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    animation = 'fade-up',
    distance = 30,
  } = options;
  
  const ref = useRef<T>(null);
  
  // Use Lenis for scroll tracking to ensure animations are in sync with scroll
  useLenis(({ scroll, velocity }) => {
    // The hook connects with Lenis to ensure animations are in sync with smooth scrolling
    // We don't need to do anything here as IntersectionObserver handles the reveal timing
  });

  // Get initial and animated transform values based on animation type
  const getTransforms = () => {
    switch (animation) {
      case 'fade-up':
        return {
          initial: `translateY(${distance}px)`,
          animated: 'translateY(0)',
        };
      case 'fade-down':
        return {
          initial: `translateY(-${distance}px)`,
          animated: 'translateY(0)',
        };
      case 'fade-left':
        return {
          initial: `translateX(${distance}px)`,
          animated: 'translateX(0)',
        };
      case 'fade-right':
        return {
          initial: `translateX(-${distance}px)`,
          animated: 'translateX(0)',
        };
      case 'zoom-in':
        return {
          initial: 'scale(0.9)',
          animated: 'scale(1)',
        };
      case 'zoom-out':
        return {
          initial: 'scale(1.1)',
          animated: 'scale(1)',
        };
      default:
        return {
          initial: `translateY(${distance}px)`,
          animated: 'translateY(0)',
        };
    }
  };

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const { initial, animated } = getTransforms();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation when element is in view
            setTimeout(() => {
              currentRef.style.transitionProperty = 'opacity, transform';
              currentRef.style.transitionDuration = `${duration}ms`;
              currentRef.style.transitionTimingFunction = easing;
              currentRef.style.transitionDelay = `${delay}ms`;
              currentRef.style.opacity = '1';
              currentRef.style.transform = animated;
            }, 100);
            
            if (once) {
              observer.unobserve(currentRef);
            }
          } else if (!once) {
            // Reset animation when element is out of view (if not once)
            currentRef.style.opacity = '0';
            currentRef.style.transform = initial;
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Set initial styles
    currentRef.style.opacity = '0';
    currentRef.style.transform = initial;
    currentRef.style.willChange = 'opacity, transform';
    
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, once, delay, duration, easing, animation, distance]);

  return ref;
}
