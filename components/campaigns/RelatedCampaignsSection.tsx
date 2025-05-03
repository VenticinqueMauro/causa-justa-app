'use client';

import React from 'react';
import { Campaign } from '@/types/campaign';
import CampaignCard from '@/components/ui/CampaignCard';
import BrutalHeading from '@/components/ui/BrutalHeading';

interface RelatedCampaignsSectionProps {
  campaigns: Campaign[];
  campaignSlug: string;
  title?: string;
}

const RelatedCampaignsSection: React.FC<RelatedCampaignsSectionProps> = ({
  campaigns,
  campaignSlug,
  title = 'También podría interesarte'
}) => {
  // Filtrar la campaña actual por si acaso
  const filteredCampaigns = campaigns
    .filter(campaign => campaign.id !== campaignSlug && campaign.slug !== campaignSlug)
    .slice(0, 4); // Limitar a 4 campañas
  
  return (
    <div className="w-full py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <BrutalHeading className="text-center md:text-start text-xl md:text-3xl">{title}</BrutalHeading>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {filteredCampaigns.length > 0 ? (
            // Campañas reales
            filteredCampaigns.map((campaign) => (
              <div key={campaign.id}>
                <CampaignCard campaign={campaign} />
              </div>
            ))
          ) : (
            // Mensaje cuando no hay campañas relacionadas
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-600">No hay campañas relacionadas disponibles en este momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedCampaignsSection;
