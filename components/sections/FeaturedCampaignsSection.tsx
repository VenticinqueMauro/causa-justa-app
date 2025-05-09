'use client';

import React from "react";
import Link from "next/link";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import CampaignCard from "../ui/CampaignCard";
import BrutalButton from "../ui/BrutalButton";
import { Campaign } from "@/types/campaign";
import BrutalLink from "../ui/BrutalLink";
import RevealSection from "../animations/RevealSection";
import useParallax from "@/hooks/useParallax";

interface FeaturedCampaignsSectionProps {
  campaigns: Campaign[];
}

const FeaturedCampaignsSection = ({ campaigns }: FeaturedCampaignsSectionProps) => {
  const parallaxBgRef = useParallax<HTMLDivElement>({
    speed: 0.03,
    direction: 'down',
    maxMovement: 30,
  });
  // Encontrar la campaña destacada (isFeatured=true) o usar la primera si no hay ninguna
  const featuredCampaign = campaigns.find(campaign => campaign.isFeatured) || campaigns[0];

  // Obtener el resto de campañas (excluyendo la destacada)
  const otherCampaigns = campaigns.filter(campaign => campaign !== featuredCampaign).slice(0, 2);

  // Si no hay suficientes campañas adicionales, rellenar con la destacada repetida (solo para evitar errores)
  const secondaryCampaigns = otherCampaigns.length >= 2 ? otherCampaigns :
    [...otherCampaigns, ...Array(2 - otherCampaigns.length).fill(featuredCampaign)];

  return (
    <BrutalSection id="campaigns" variant="alt" className="border-y-2 border-[#002C5B] relative overflow-hidden">
      {/* Subtle parallax background pattern */}
      <div 
        ref={parallaxBgRef} 
        className="absolute inset-0 opacity-5 z-0 pointer-events-none" 
        style={{
          backgroundImage: 'url("/pattern-dots.png")',
          backgroundRepeat: 'repeat',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Aumentamos el threshold a 0.5 para que la animación comience cuando la mitad del elemento sea visible */}
        <RevealSection animation="fade-down" delay={100} duration={800} threshold={0.5}>
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <BrutalHeading className="text-3xl md:text-4xl">Causas destacadas</BrutalHeading>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
              Estas son algunas de las causas verificadas que necesitan tu apoyo ahora mismo
            </p>
          </div>
        </RevealSection>
        
        {/* Aumentamos el threshold a 0.5 para que la animación comience cuando la mitad del elemento sea visible */}
        <RevealSection animation="fade-right" delay={200} duration={800} threshold={0.5}>
          <div className="text-start my-8">
              <BrutalLink className="inline-flex items-center" href="/campaigns">
                Ver todas las causas
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </BrutalLink>
          </div>
        </RevealSection>
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Campaña principal destacada a la izquierda - aparece primero */}
            <RevealSection 
              animation="fade-right" 
              delay={300} 
              duration={1000} 
              className="md:w-1/2 flex" 
              threshold={0.6}
            >
              <div className="w-full">
                <CampaignCard
                  campaign={featuredCampaign}
                  featured={true}
                  className="h-full"
                />
              </div>
            </RevealSection>

            {/* Contenedor de las dos campañas de la derecha - aparecen después */}
            <div className="md:w-1/2 flex flex-col gap-6">
              {/* Primera campaña secundaria */}
              <RevealSection 
                animation="fade-left" 
                delay={400} 
                duration={1000} 
                className="flex-1" 
                threshold={0.6}
              >
                <CampaignCard campaign={secondaryCampaigns[0]} className="h-full" />
              </RevealSection>

              {/* Segunda campaña secundaria */}
              <RevealSection 
                animation="fade-left" 
                delay={500} 
                duration={1000} 
                className="flex-1" 
                threshold={0.6}
              >
                <CampaignCard campaign={secondaryCampaigns[1]} className="h-full" />
              </RevealSection>
            </div>
          </div>
        </div>
      </div>
    </BrutalSection>
  );
};

export default FeaturedCampaignsSection;
