import React from 'react';
import { Campaign } from '@/types/campaign';
import CampaignCard from '@/components/ui/CampaignCard';
import BrutalHeading from '@/components/ui/BrutalHeading';
import PaginationControls from '@/components/campaigns/PaginationControls';

interface ServerRelatedCampaignsProps {
  campaigns: Campaign[];
  currentPage: number;
  totalPages: number;
  campaignSlug: string;
  seed?: string;
  title?: string;
}

// Este es un componente de servidor (no necesita 'use client')
const ServerRelatedCampaigns = ({
  campaigns,
  currentPage,
  totalPages,
  campaignSlug,
  seed,
  title = 'También podría interesarte'
}: ServerRelatedCampaignsProps) => {
  // No mostrar el componente si no hay campañas relacionadas
  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <BrutalHeading className="text-center md:text-start text-xl md:text-3xl">{title}</BrutalHeading>
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            campaignSlug={campaignSlug}
            seed={seed}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id}>
              <CampaignCard campaign={campaign} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServerRelatedCampaigns;
