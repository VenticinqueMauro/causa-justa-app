import React from "react";
import Link from "next/link";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import CampaignCard from "../ui/CampaignCard";
import BrutalButton from "../ui/BrutalButton";
import { Campaign } from "@/types/campaign";

interface FeaturedCampaignsSectionProps {
  campaigns: Campaign[];
}

const FeaturedCampaignsSection = ({ campaigns }: FeaturedCampaignsSectionProps) => {
  // Asegurarnos de que siempre tengamos al menos 3 campañas para mostrar
  const displayCampaigns = campaigns.slice(0, 3);
  
  return (
    <BrutalSection id="campaigns" variant="alt" className="border-y-2 border-[#002C5B]">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <BrutalHeading className="text-3xl md:text-4xl">Causas destacadas</BrutalHeading>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
            Estas son algunas de las causas verificadas que necesitan tu apoyo ahora mismo
          </p>
        </div>
        
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Campaña principal destacada a la izquierda - determina la altura */}
            <div className="md:w-1/2 flex">
              <div className="w-full">
                <CampaignCard 
                  campaign={displayCampaigns[0]} 
                  featured={true} 
                  className="h-full"
                />
              </div>
            </div>
            
            {/* Contenedor de las dos campañas de la derecha - se adapta a la altura de la izquierda */}
            <div className="md:w-1/2 flex flex-col gap-6">
              {/* Primera campaña secundaria */}
              <div className="flex-1">
                <CampaignCard campaign={displayCampaigns[1]} className="h-full" />
              </div>
              
              {/* Segunda campaña secundaria */}
              <div className="flex-1">
                <CampaignCard campaign={displayCampaigns[2]} className="h-full" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Botón "Ver más" con estilo brutal */}
        <div className="text-center mt-8">
          <Link href="/campaigns" passHref>
            <BrutalButton variant="primary" size="lg" className="inline-flex items-center">
              Ver todas las causas
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </BrutalButton>
          </Link>
        </div>
      </div>
    </BrutalSection>
  );
};

export default FeaturedCampaignsSection;
