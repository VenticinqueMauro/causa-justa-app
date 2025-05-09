'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import BrutalSection from "../ui/BrutalSection";
import BrutalButton from "../ui/BrutalButton";
import StartCauseButton from "../actions/StartCauseButton";
import useParallax from "@/hooks/useParallax";
import RevealSection from "../animations/RevealSection";

const HeroSection = () => {
  const parallaxRef = useParallax<HTMLDivElement>({
    speed: 0.05,
    direction: 'up',
    maxMovement: 50,
  });

  return (
    <BrutalSection className="relative overflow-hidden py-20 md:py-28">
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <RevealSection animation="fade-down" delay={100} duration={1000}>
          <h1 className="max-w-3xl text-4xl font-bold uppercase tracking-tight text-[#002C5B] sm:text-5xl md:text-6xl border-b-4 border-[#EDFCA7] pb-2 mb-2">
            Por una Causa Justa
          </h1>
        </RevealSection>
        
        <RevealSection animation="fade-up" delay={300} duration={1000}>
          <h2 className="max-w-3xl text-2xl font-bold tracking-tight text-[#002C5B] sm:text-3xl mt-2">
            Conectando corazones con causas que importan
          </h2>
        </RevealSection>
        
        <RevealSection animation="zoom-in" delay={500} duration={1000}>
          <p className="mt-6 max-w-2xl text-lg text-[#002C5B] border-2 border-[#002C5B] bg-white p-4 shadow-[5px_5px_0_0_rgba(0,44,91,0.3)]">
            Ayuda a transformar vidas a través de donaciones seguras y transparentes. Cada contribución marca la
            diferencia en nuestra comunidad, con la seguridad de MercadoPago y verificación completa de cada causa.
          </p>
        </RevealSection>
        
        <RevealSection animation="fade-up" delay={700} duration={1000}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <StartCauseButton
              variant="secondary"
              size="md"
              className="text-base"
              text="Iniciar una causa"
              showIcon={true}
              iconPosition="left"
            />
            <BrutalButton variant="outline" className="text-base" href="/campaigns">
              Explorar causas
            </BrutalButton>
          </div>
        </RevealSection>
      </div>
      
      <div ref={parallaxRef} className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#000000]">
        <Image
          src="/banner2.png"
          alt="Personas ayudando en comunidad"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
    </BrutalSection>
  );
};

export default HeroSection;
