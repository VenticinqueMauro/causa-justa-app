'use client';

import React, { useState, useRef, useEffect } from "react";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import BrutalButton from "../ui/BrutalButton";
import { ArrowRight, TrendingUp, Users, DollarSign, Award } from "lucide-react";
import { useLenis } from "lenis/react";
import useParallax from "@/hooks/useParallax";
import RevealSection from "../animations/RevealSection";

interface Stat {
  value: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  {
    value: "250+",
    label: "Causas financiadas",
    description: "Proyectos verificados y completados exitosamente",
    icon: <TrendingUp className="h-6 w-6 text-[#002C5B]" />
  },
  {
    value: "$1.2M",
    label: "Recaudados",
    description: "Fondos entregados a beneficiarios verificados",
    icon: <DollarSign className="h-6 w-6 text-[#002C5B]" />
  },
  {
    value: "15K+",
    label: "Donantes activos",
    description: "Personas comprometidas con el cambio social",
    icon: <Users className="h-6 w-6 text-[#002C5B]" />
  },
  {
    value: "98%",
    label: "Satisfacción",
    description: "De beneficiarios y donantes con nuestra plataforma",
    icon: <Award className="h-6 w-6 text-[#002C5B]" />
  },
];

const StatsSection = () => {
  // Refs for animations and interactions
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [animated, setAnimated] = useState(false);
  const [displayedValues, setDisplayedValues] = useState<string[]>(stats.map(() => "0"));
  const [visibleStats, setVisibleStats] = useState<boolean[]>(stats.map(() => false));

  // Parallax effect for the title section
  const titleRef = useParallax<HTMLDivElement>({
    speed: 0.05,
    direction: 'up',
    maxMovement: 20,
  });

  // Set section as visible when it comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          setAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [animated]);

  // Set up individual observers for each stat card
  useEffect(() => {
    if (!animated) return;
    
    const observers: IntersectionObserver[] = [];
    
    statsRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !visibleStats[index]) {
            // Mark this stat as visible
            setVisibleStats(prev => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
            
            // Start counter animation for this stat
            animateCounter(index);
            
            // Unobserve after it's visible
            observer.unobserve(ref);
          }
        },
        { threshold: 0.7, rootMargin: '0px 0px -50px 0px' }
      );
      
      observer.observe(ref);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach((observer, index) => {
        if (statsRefs.current[index]) {
          observer.unobserve(statsRefs.current[index]!);
        }
      });
    };
  }, [animated, visibleStats]);

  // Animate a single counter
  const animateCounter = (index: number) => {
    // Start with 0
    let startValue = 0;
    let currentValue = 0;
    
    // Extract the numeric part for animation
    let endValue = 0;
    let prefix = '';
    let suffix = '';
    
    // Parse the value string to get numeric part and any prefix/suffix
    const valueStr = stats[index].value;
    const numericMatch = valueStr.match(/[0-9.]+/);
    
    if (numericMatch) {
      // Find where the number starts and ends
      const numStart = valueStr.indexOf(numericMatch[0]);
      const numEnd = numStart + numericMatch[0].length;
      
      // Extract prefix and suffix
      prefix = valueStr.substring(0, numStart);
      suffix = valueStr.substring(numEnd);
      
      // Parse the numeric value
      endValue = parseFloat(numericMatch[0]);
    }
    
    // Duration in ms
    const duration = 2000;
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;
    
    // Update function for animation
    const updateCounter = () => {
      if (frame === totalFrames) {
        // Animation complete, set final value
        setDisplayedValues(prev => {
          const newValues = [...prev];
          newValues[index] = stats[index].value;
          return newValues;
        });
        return;
      }
      
      frame++;
      
      // Calculate current value with easing
      const progress = frame / totalFrames;
      const easedProgress = easeOutExpo(progress);
      currentValue = Math.min(endValue, startValue + (endValue - startValue) * easedProgress);
      
      // Format the value
      let formattedValue;
      if (endValue < 10 && endValue % 1 !== 0) {
        // Handle decimal values
        formattedValue = currentValue.toFixed(1);
      } else {
        // Handle integer values
        formattedValue = Math.floor(currentValue).toString();
      }
      
      // Update state with formatted value including prefix/suffix
      setDisplayedValues(prev => {
        const newValues = [...prev];
        newValues[index] = `${prefix}${formattedValue}${suffix}`;
        return newValues;
      });
      
      // Continue animation
      requestAnimationFrame(updateCounter);
    };
    
    // Start animation
    requestAnimationFrame(updateCounter);
  };
  
  // Animate all counters at once (no longer used directly)
  const animateCounters = () => {
    stats.forEach((_, index) => {
      animateCounter(index);
    });
  };
  
  // Easing function for smoother animation
  const easeOutExpo = (x: number): number => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  };

  // Use Lenis for scroll-based interactions
  useLenis(({ scroll, progress }) => {
    // Apply subtle rotation to stats cards based on scroll position
    statsRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const cardRect = ref.getBoundingClientRect();
      if (cardRect.top < window.innerHeight && cardRect.bottom > 0) {
        // Calculate rotation based on position in viewport
        const centerY = cardRect.top + cardRect.height / 2;
        const viewportCenterY = window.innerHeight / 2;
        const distanceFromCenter = (centerY - viewportCenterY) / viewportCenterY;
        
        // Apply subtle rotation (max 2 degrees) and scale based on position
        const rotation = distanceFromCenter * 2 * (index % 2 === 0 ? 1 : -1);
        
        ref.style.transform = `perspective(1000px) rotateX(${rotation}deg) rotateY(${rotation * 0.5}deg)`;
        ref.style.transition = 'transform 0.3s ease-out';
      }
    });
  });


  return (
    <BrutalSection variant="alt" className="py-12 border-t-2 border-[#002C5B] overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="mb-12 text-center">
          <RevealSection animation="fade-down" duration={1000}>
            <BrutalHeading className="text-3xl md:text-4xl">Nuestro Impacto</BrutalHeading>
          </RevealSection>
          <RevealSection animation="fade-up" delay={200} duration={800}>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
              Cifras que demuestran nuestro compromiso con la transparencia y el cambio social
            </p>
          </RevealSection>
        </div>
        
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <RevealSection 
              key={index} 
              animation={index % 2 === 0 ? "zoom-in" : "zoom-in"} 
              delay={300 + index * 100} 
              duration={800}
              once={false}
              threshold={0.7}
              className={`transition-all duration-700 ${!visibleStats[index] ? 'opacity-0 translate-y-16' : 'opacity-100 translate-y-0'}`}
            >
              <div
                ref={(el) => { statsRefs.current[index] = el; }}
                className={`
                  flex flex-col items-center border-2 border-[#002C5B] bg-white p-3 md:p-6 text-center 
                  shadow-[5px_5px_0_0_rgba(0,44,91,0.3)] transition-all duration-300`}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)]">
                  {stat.icon}
                </div>
                <div className="relative">
                  <span className="text-4xl font-bold text-[#002C5B] counter-value">
                    {visibleStats[index] ? displayedValues[index] : "0"}
                  </span>
                </div>
                <span className="mt-2 text-sm uppercase text-gray-600 font-bold">{stat.label}</span>
                {stat.description && (
                  <span className="mt-2 text-xs text-gray-500">{stat.description}</span>
                )}
                
                {/* Decorative elements */}
                <div className={`absolute -z-10 ${index % 2 === 0 ? '-left-2' : '-right-2'} -bottom-2 h-12 w-12 bg-[#EDFCA7] opacity-20 rounded-full blur-xl`} />
              </div>
            </RevealSection>
          ))}
        </div>
        
        <RevealSection animation="fade-up" delay={700} duration={1000}>
          <div className="mt-10 text-center">
            <p className="text-[#002C5B] mb-4 max-w-2xl mx-auto border-2 border-dashed border-[#002C5B] bg-white p-3 rotate-[0.3deg] transform">
              Publicamos informes trimestrales de impacto y mantenemos un seguimiento transparente de todas las causas financiadas.
            </p>
            <BrutalButton 
              variant="outline" 
              className="text-sm inline-flex items-center transition-all duration-300" 
              href="/impact-reports"
            >
              Ver informes de impacto
              <ArrowRight className="ml-2 h-4 w-4" />
            </BrutalButton>
          </div>
        </RevealSection>
      </div>
    </BrutalSection>
  );
};

export default StatsSection;
