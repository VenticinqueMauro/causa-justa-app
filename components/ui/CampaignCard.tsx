import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Campaign } from "@/types/campaign";
import BrutalButton from "./BrutalButton";
import { getCategoryLabel } from "@/utils/campaign-categories";

interface CampaignCardProps {
  campaign: Campaign;
  featured?: boolean; // Indica si la campaña debe mostrarse destacada (para el bento grid)
  className?: string; // Permite añadir clases personalizadas
}

const CampaignCard = ({ campaign, featured = false, className = '' }: CampaignCardProps) => {
  // Usar el monto actual si está disponible, de lo contrario calcular un valor de ejemplo
  const raised = campaign.currentAmount !== undefined ? campaign.currentAmount :
    (campaign.goalAmount ? Math.floor(campaign.goalAmount * 0.6) : 0); // 60% de la meta como fallback

  const campaignUrl = `/campaigns/${campaign.slug || campaign.id || ''}`;

  return (
    <Link href={campaignUrl} passHref className={`block cursor-pointer ${className}`}>
      <div className={`group relative overflow-hidden border-2 border-[#002C5B] bg-white transition-all transform shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]  w-full flex flex-col h-full ${!featured && 'max-w-2xl'} mx-auto`}>
        {/* Contenedor de imagen con mayor altura y efecto de zoom al pasar el cursor */}
        <div className={`overflow-hidden border-b-2 border-[#002C5B] relative ${featured ? 'h-[260px]' : 'h-[180px]'}`}>
          <Image
            src={campaign.images && campaign.images.length > 0 ?
              (campaign.images[0].startsWith('http') ? campaign.images[0] : `/placeholder.svg`) :
              "/placeholder.svg"}
            alt={campaign.title}
            width={600}
            height={350}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority={true}
          />
          {/* Overlay con gradiente para mejorar la legibilidad del título */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Etiqueta de categoría */}
          <div className="absolute top-3 left-3 bg-white border border-dashed border-[#002C5B] text-[#002C5B] text-xs font-bold px-2 py-1">
            {campaign.category ? getCategoryLabel(campaign.category) : 'OTHERS'}
          </div>
        </div>
        <div className="p-2 flex flex-col flex-grow">
          <h3 className={`text-lg font-bold text-[#002C5B] uppercase ${featured ? 'mb-1' : 'line-clamp-2'}`}>{campaign.title}</h3>

          {featured ? (
            <>
              <p className="text-base md:text-lg line-clamp-2 text-gray-600">{campaign.shortDescription}</p>
              <p className="text-sm md:text-base text-gray-600 line-clamp-none flex-grow mt-4">"{campaign.description}"</p>
              <p className="text-xs text-gray-500 italic mt-1">→ Haz clic para ver más detalles</p>
            </>
          ) : (
            <p className="text-base line-clamp-2 text-gray-600">{campaign.shortDescription}</p>
          )}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase">${raised.toLocaleString()} recaudados</span>
              <span className="text-gray-500">Meta: ${campaign.goalAmount?.toLocaleString()}</span>
            </div>

            {/* Barra de progreso con estilo brutal */}
            <div className="h-3 w-full border border-[#002C5B] bg-white">
              <div
                className="h-full bg-[#002C5B]"
                style={{ width: `${campaign.goalAmount ? Math.min((raised / campaign.goalAmount) * 100, 100) : 0}%` }}
              ></div>
            </div>

            {/* Porcentaje completado */}
            <div className="text-xs text-gray-600 text-right">
              {campaign.goalAmount ? Math.round((raised / campaign.goalAmount) * 100) : 0}% completado
            </div>
          </div>

          <div className="mt-auto pt-2">
            <BrutalButton variant="secondary" size="sm" className="w-full inline-flex items-center justify-center">
              Donar ahora
              <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </BrutalButton>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
