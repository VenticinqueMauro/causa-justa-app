'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import CampaignCard from '@/components/ui/CampaignCard';
import CategoryFilter from '@/components/campaigns/CategoryFilter';
import FilterModal from '@/components/campaigns/FilterModal';
import SearchBar from '@/components/campaigns/SearchBar';
import Pagination from '@/components/ui/Pagination';
import { Campaign } from '@/types/campaign';
import { CampaignCategory } from '@/types/enums';
import { getCategoryLabel } from '@/utils/campaign-categories';

interface CampaignsClientProps {
  initialCampaigns: Campaign[];
  initialMeta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
  availableCategories: CampaignCategory[];
}

const CampaignsClient = ({ 
  initialCampaigns, 
  initialMeta,
  availableCategories 
}: CampaignsClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Estado para los filtros y paginación
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [meta, setMeta] = useState(initialMeta);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Obtener valores iniciales de los parámetros de URL
  const initialCategory = searchParams.get('category') as CampaignCategory | null;
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  
  // Estado para los filtros
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Función para actualizar la URL con los filtros
  const updateUrlParams = (params: { 
    category?: string | null; 
    search?: string; 
    page?: number;
  }) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      
      // Actualizar categoría
      if (params.category === null) {
        newParams.delete('category');
      } else if (params.category !== undefined) {
        newParams.set('category', params.category);
      }
      
      // Actualizar búsqueda
      if (params.search !== undefined) {
        if (params.search) {
          newParams.set('search', params.search);
        } else {
          newParams.delete('search');
        }
      }
      
      // Actualizar página
      if (params.page !== undefined) {
        if (params.page === 1) {
          newParams.delete('page');
        } else {
          newParams.set('page', params.page.toString());
        }
      }
      
      // Actualizar URL sin recargar la página
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      router.push(newUrl, { scroll: false });
    });
  };
  
  // Función para cargar campañas con los filtros aplicados
  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      if (!apiUrl) {
        console.error('API URL no configurada');
        return;
      }
      
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      // Construir URL con parámetros
      const params = new URLSearchParams();
      params.append('status', 'VERIFIED');
      params.append('page', currentPage.toString());
      params.append('limit', '9'); // Mostrar 9 campañas por página
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`${baseUrl}campaigns?${params.toString()}`, {
        // No usar cache: 'no-store' en el cliente para permitir que el navegador cachee
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Error al obtener campañas:', response.status);
        return;
      }
      
      const data = await response.json();
      setCampaigns(data.items || []);
      setMeta(data.meta || initialMeta);
    } catch (error) {
      console.error('Error al obtener campañas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Efecto para cargar campañas cuando cambian los filtros
  // Solo se ejecuta cuando los filtros cambian, no en la carga inicial
  useEffect(() => {
    // Verificar si los parámetros actuales son diferentes de los iniciales
    const initialParams = new URLSearchParams(window.location.search);
    const initialCategoryParam = initialParams.get('category');
    const initialSearchParam = initialParams.get('search') || '';
    const initialPageParam = parseInt(initialParams.get('page') || '1', 10);
    
    const paramsChanged = 
      selectedCategory !== initialCategoryParam ||
      searchTerm !== initialSearchParam ||
      currentPage !== initialPageParam;
    
    // Solo hacer fetch si los parámetros han cambiado desde la carga inicial
    if (paramsChanged) {
      fetchCampaigns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm, currentPage]);
  
  // Manejadores de eventos
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateUrlParams({ category, page: 1 });
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    updateUrlParams({ search: term, page: 1 });
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams({ page });
    // Scroll al inicio de los resultados usando startTransition
    startTransition(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Barra de búsqueda */}
        <div className="flex-grow">
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        </div>
        
        {/* Botón de filtro para móvil */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 bg-white border-2 border-[#002C5B] shadow-[3px_3px_0px_0px_rgba(0,44,91,0.8)] font-bold"
        >
          <Filter size={18} />
          <span>Filtrar{selectedCategory ? ` (1)` : ''}</span>
        </button>
      </div>
      
      {/* Filtro de categorías (visible solo en desktop) */}
      <div className="hidden md:block">
        <CategoryFilter 
          categories={availableCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </div>
      
      {/* Modal de filtros para móvil */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={availableCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
      
      {/* Título de la sección con la categoría seleccionada */}
      {selectedCategory && (
        <h2 className="text-2xl font-bold mb-6 text-[#002C5B]">
          Campañas de {getCategoryLabel(selectedCategory as CampaignCategory)}
        </h2>
      )}
      
      {/* Estado de carga */}
      {(isLoading || isPending) ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002C5B]"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white border-2 border-[#002C5B] p-8 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] text-center">
          <p className="text-xl">No se encontraron campañas con los filtros seleccionados.</p>
          <p className="mt-2">Prueba con otros filtros o vuelve más tarde.</p>
        </div>
      ) : (
        <>
          {/* Grid de campañas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
          
          {/* Paginación */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={meta.totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      )}
    </div>
  );
};

export default CampaignsClient;
