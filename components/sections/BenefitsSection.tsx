'use client';

import React from "react";
import { Shield, CheckCircle, Users, CreditCard } from "lucide-react";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import { benefits } from "@/data/sampleData";
import HorizontalScroll from "../animations/HorizontalScroll";
import RevealSection from "../animations/RevealSection";

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "shield":
      return <Shield className="h-8 w-8 text-[#002C5B]" />;
    case "check-circle":
      return <CheckCircle className="h-8 w-8 text-[#002C5B]" />;
    case "credit-card":
      return <CreditCard className="h-8 w-8 text-[#002C5B]" />;
    case "users":
      return <Users className="h-8 w-8 text-[#002C5B]" />;
    default:
      return <Shield className="h-8 w-8 text-[#002C5B]" />;
  }
};

const BenefitsSection = () => {
  return (
    <BrutalSection id="benefits">
      <div className="container mx-auto px-4">
        <RevealSection animation="fade-down" delay={100} duration={800}>
          <div className="mb-12 text-center">
            <BrutalHeading className="text-3xl md:text-4xl">¿Por qué elegir Causa Justa?</BrutalHeading>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
              Nuestra plataforma está diseñada para brindar la mejor experiencia tanto para donantes como para
              organizaciones
            </p>
          </div>
        </RevealSection>
        
        {/* Horizontal scroll container for benefits cards */}
        <div className="relative overflow-hidden py-8">
          {/* Optional scroll indicators */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-full bg-gradient-to-r from-[#ECECE2] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-full bg-gradient-to-l from-[#ECECE2] to-transparent z-10 pointer-events-none"></div>
          
          <HorizontalScroll 
            speed={0.8} 
            className="gap-8 px-4 pb-4"
            containerClassName="overflow-x-auto md:overflow-visible"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] md:w-[320px] flex flex-col items-center text-center p-3 md:p-6 border-2 border-[#002C5B] bg-white shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] transform transition-all duration-200"
                style={{
                  // Add a slight rotation to each card for visual interest
                  transform: `rotate(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                }}
              >
                <div className="flex h-16 w-16 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)]">
                  {getIconComponent(benefit.icon)}
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#002C5B] uppercase">{benefit.title}</h3>
                <p className="mt-2 text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </HorizontalScroll>
        </div>
      </div>
    </BrutalSection>
  );
};

export default BenefitsSection;
