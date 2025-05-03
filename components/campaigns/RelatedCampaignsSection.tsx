'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Campaign } from '@/types/campaign';
import CampaignCard from '@/components/ui/CampaignCard';
import BrutalHeading from '@/components/ui/BrutalHeading';

interface RelatedCampaignsSectionProps {
  initialCampaigns: Campaign[];
  initialTotalPages: number;
  campaignSlug: string;
  initialSeed?: string;
  title?: string;
}

const RelatedCampaignsSection: React.FC<RelatedCampaignsSectionProps> = ({
  initialCampaigns,
  initialTotalPages,
  campaignSlug,
  initialSeed,
  title = 'También podría interesarte'
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Estado local para las campañas y la paginación
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  
  // Obtener la página actual de los parámetros de búsqueda
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
  const seed = searchParams.get('seed') || initialSeed;
  
  // Determinar si mostrar los botones de navegación
  const showPrevButton = page > 1 && !loading;
  const showNextButton = page < totalPages && !loading;
  
  // Función para cambiar de página sin recargar toda la página
  const changePage = async (newPage: number) => {
    setLoading(true);
    
    try {
      // Crear una nueva URL con los parámetros actualizados
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      if (seed) params.set('seed', seed);
      
      // Actualizar la URL sin recargar la página
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      
      // Obtener nuevos datos para las campañas relacionadas
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      if (!apiUrl) {
        console.error('API URL no configurada');
        return;
      }
      
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      const fetchLimit = 8; // Obtener más campañas para poder filtrar
      const offset = (newPage - 1) * 4;
      const seedParam = seed ? `&seed=${seed}` : '';
      
      const response = await fetch(
        `${baseUrl}campaigns?status=VERIFIED&limit=${fetchLimit}&offset=${offset}&sort=random${seedParam}`,
        { cache: 'no-store' }
      );
      
      if (!response.ok) {
        console.error('Error al obtener campañas:', response.status);
        return;
      }
      
      const data = await response.json();
      
      // Filtrar la campaña actual
      const filteredCampaigns = (data.items || [])
        .filter((campaign: Campaign) => campaign.id !== campaignSlug && campaign.slug !== campaignSlug)
        .slice(0, 4);
      
      // Actualizar el estado con las nuevas campañas
      setCampaigns(filteredCampaigns);
      
      // Actualizar el total de páginas si está disponible
      if (data.meta?.totalItems) {
        const newTotalPages = Math.ceil(data.meta.totalItems / 4);
        setTotalPages(newTotalPages > 0 ? newTotalPages : 1);
      }
    } catch (error) {
      console.error('Error al cambiar de página:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Efecto para cargar nuevos datos cuando cambia la página en la URL
  useEffect(() => {
    // No cargar datos en el montaje inicial, ya tenemos los datos iniciales
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
    if (currentPage !== 1 && !loading) {
      changePage(currentPage);
    }
  }, [searchParams.get('page')]);
  
  return (
    <div className="w-full py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <BrutalHeading className="text-2xl md:text-3xl">{title}</BrutalHeading>
          <div className="flex space-x-2">
            <button
              onClick={() => changePage(page - 1)}
              className={`p-2 border-2 border-[#002C5B] bg-white ${
                showPrevButton ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!showPrevButton || loading}
              aria-label="Página anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              onClick={() => changePage(page + 1)}
              className={`p-2 border-2 border-[#002C5B] bg-white ${
                showNextButton ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!showNextButton || loading}
              aria-label="Página siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {loading ? (
            // Skeleton loader con 4 tarjetas
            [...Array(4)].map((_, index) => (
              <div key={`skeleton-${index}`} className="border-2 border-[#002C5B] bg-white shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
                {/* Skeleton para la imagen */}
                <div className="h-[180px] bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  {/* Skeleton para el título */}
                  <div className="h-6 bg-gray-200 animate-pulse w-3/4 mb-2"></div>
                  {/* Skeleton para la descripción */}
                  <div className="h-4 bg-gray-200 animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-5/6"></div>
                  {/* Skeleton para la barra de progreso */}
                  <div className="h-3 bg-gray-200 animate-pulse w-full mt-4"></div>
                  {/* Skeleton para el botón */}
                  <div className="h-10 bg-gray-200 animate-pulse w-full mt-4"></div>
                </div>
              </div>
            ))
          ) : (
            // Campañas reales
            campaigns.map((campaign) => (
              <div key={campaign.id}>
                <CampaignCard campaign={campaign} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedCampaignsSection;
