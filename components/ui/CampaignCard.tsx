import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Campaign } from "@/types/campaign";
import BrutalButton from "./BrutalButton";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  // Usar el monto actual si está disponible, de lo contrario calcular un valor de ejemplo
  const raised = campaign.currentAmount !== undefined ? campaign.currentAmount : 
                (campaign.goalAmount ? Math.floor(campaign.goalAmount * 0.6) : 0); // 60% de la meta como fallback
  
  const campaignUrl = `/campaigns/${campaign.slug || campaign.id || ''}`;

  return (
    <Link href={campaignUrl} passHref className="block cursor-pointer">
      <div className="group relative overflow-hidden border-2 border-[#002C5B] bg-white transition-all transform shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] h-[450px] w-full flex flex-col">
        {/* Contenedor de imagen con mayor altura y efecto de zoom al pasar el cursor */}
        <div className="overflow-hidden border-b-2 border-[#002C5B] h-[250px] relative">
          <Image
            src={campaign.images && campaign.images.length > 0 ? 
                (campaign.images[0].startsWith('http') ? campaign.images[0] : `/placeholder.svg`) : 
                "/placeholder.svg"}
            alt={campaign.title}
            width={600}
            height={350}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            priority={true}
          />
          {/* Overlay con gradiente para mejorar la legibilidad del título */}
          <div className="absolute inset-0 "></div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-[#002C5B] uppercase h-14 line-clamp-2">{campaign.title}</h3>
          <p className="mt-2 line-clamp-2 text-gray-600 h-12">{campaign.shortDescription}</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold uppercase">${raised.toLocaleString()} recaudados</span>
              <span className="text-gray-500">Meta: ${campaign.goalAmount?.toLocaleString()}</span>
            </div>
            <div className="h-4 w-full border-2 border-[#002C5B] bg-white">
              <div
                className="h-full bg-[#002C5B]"
                style={{ width: `${campaign.goalAmount ? (raised / campaign.goalAmount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <BrutalButton variant="secondary" className="w-full">
              Donar ahora
            </BrutalButton>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
