'use client';

import React from 'react';
import Link from 'next/link';
import './slider.css';
import { Campaign } from '@/types/campaign';
import CampaignCard from '@/components/ui/CampaignCard';
import BrutalHeading from '@/components/ui/BrutalHeading';

interface RelatedCampaignsSliderProps {
  campaigns: Campaign[];
  currentPage: number;
  totalPages: number;
  campaignSlug: string;
  seed?: string;
  title?: string;
}

const RelatedCampaignsSlider: React.FC<RelatedCampaignsSliderProps> = ({
  campaigns,
  currentPage,
  totalPages,
  campaignSlug,
  seed,
  title = 'También podría interesarte'
}) => {
  // No mostrar el componente si no hay campañas relacionadas
  if (!campaigns || campaigns.length === 0) {
    return null;
  }
  
  // Generar enlaces para la paginación
  const getPageUrl = (pageNum: number) => {
    // Mantener la misma semilla para todas las páginas para consistencia
    const seedParam = seed ? `&seed=${seed}` : '';
    return `/campaigns/${campaignSlug}?page=${pageNum}${seedParam}`;
  };
  
  // Determinar si mostrar los botones de navegación
  const showPrevButton = currentPage > 1;
  const showNextButton = currentPage < totalPages;

  return (
    <div className="w-full py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <BrutalHeading className="text-2xl md:text-3xl">{title}</BrutalHeading>
          <div className="hidden md:inline-flex space-x-2">
            {showPrevButton ? (
              <Link 
                href={getPageUrl(currentPage - 1)}
                className="p-2 border-2 border-[#002C5B] bg-white"
                aria-label="Página anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </Link>
            ) : (
              <div className="p-2 border-2 border-[#002C5B] bg-white opacity-50 cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </div>
            )}
            
            {showNextButton ? (
              <Link 
                href={getPageUrl(currentPage + 1)}
                className="p-2 border-2 border-[#002C5B] bg-white"
                aria-label="Página siguiente"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            ) : (
              <div className="p-2 border-2 border-[#002C5B] bg-white opacity-50 cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            )}
          </div>
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

export default RelatedCampaignsSlider;
