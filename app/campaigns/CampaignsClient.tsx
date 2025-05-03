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
  
  // Obtener valores iniciales de los parámetros de URL de forma segura
  // En Next.js 15, searchParams puede ser asíncrono, así que usamos una función segura
  const getParamSafely = (name: string, defaultValue: string = ''): string => {
    try {
      const value = searchParams.get(name);
      return value !== null ? value : defaultValue;
    } catch (error) {
      console.error(`Error al obtener parámetro ${name}:`, error);
      return defaultValue;
    }
  };
  
  const initialCategory = getParamSafely('category') as CampaignCategory | null;
  const initialSearch = getParamSafely('search', '');
  const initialPage = parseInt(getParamSafely('page', '1'), 10);
  
  // Estado para los filtros
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Función para actualizar la URL con los filtros
  // Usamos un enfoque más directo para evitar problemas con searchParams en Next.js 15
  const updateUrlParams = (params: { 
    category?: string | null; 
    search?: string; 
    page?: number;
  }) => {
    startTransition(() => {
      // Crear un nuevo objeto URLSearchParams desde cero en lugar de usar searchParams
      // Esto evita cualquier problema con searchParams siendo asincrónico en Next.js 15
      const newParams = new URLSearchParams();
      
      // Copiar los parámetros actuales de la URL del navegador
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.forEach((value, key) => {
        newParams.set(key, value);
      });
      
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
      
      // Usar valores del estado local en lugar de leer searchParams
      // Esto evita problemas con searchParams en Next.js 15
      params.append('page', currentPage.toString());
      params.append('limit', '50'); // Aumentado a 50 para mostrar más campañas
      
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
  // Simplificamos este efecto para evitar problemas con searchParams en Next.js 15
  useEffect(() => {
    // Usamos una bandera para evitar la carga inicial
    const isInitialRender = selectedCategory === initialCategory && 
                           searchTerm === initialSearch && 
                           currentPage === initialPage;
    
    // Solo hacer fetch si no es la carga inicial (ya tenemos los datos iniciales de SSR)
    if (!isInitialRender) {
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
