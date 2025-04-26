import React from "react";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import CampaignCard from "../ui/CampaignCard";
import { Campaign } from "@/types/campaign";

interface FeaturedCampaignsSectionProps {
  campaigns: Campaign[];
}

const FeaturedCampaignsSection = ({ campaigns }: FeaturedCampaignsSectionProps) => {
  return (
    <BrutalSection variant="alt" className="border-y-2 border-[#002C5B]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <BrutalHeading className="text-3xl md:text-4xl">Causas destacadas</BrutalHeading>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
            Estas son algunas de las causas verificadas que necesitan tu apoyo ahora mismo
          </p>
        </div>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, index) => (
            <CampaignCard key={index} campaign={campaign} />
          ))}
        </div>
      </div>
    </BrutalSection>
  );
};

export default FeaturedCampaignsSection;
