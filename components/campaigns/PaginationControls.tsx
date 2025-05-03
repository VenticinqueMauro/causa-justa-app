'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  campaignSlug: string;
  seed?: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  campaignSlug,
  seed
}) => {
  const router = useRouter();
  
  // Determinar si mostrar los botones de navegación
  const showPrevButton = currentPage > 1;
  const showNextButton = currentPage < totalPages;
  
  // Función para navegar a una página específica
  const navigateToPage = (pageNum: number) => {
    // Mantener la misma semilla para todas las páginas para consistencia
    const seedParam = seed ? `&seed=${seed}` : '';
    
    // Usar window.location.href para forzar una recarga completa
    // Esto es necesario porque necesitamos que el servidor vuelva a obtener los datos
    window.location.href = `/campaigns/${campaignSlug}?page=${pageNum}${seedParam}`;
  };

  return (
    <div className="flex space-x-2">
      {showPrevButton ? (
        <button 
          onClick={() => navigateToPage(currentPage - 1)}
          className="p-2 border-2 border-[#002C5B] bg-white"
          aria-label="Página anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      ) : (
        <div className="p-2 border-2 border-[#002C5B] bg-white opacity-50 cursor-not-allowed">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </div>
      )}
      
      {showNextButton ? (
        <button 
          onClick={() => navigateToPage(currentPage + 1)}
          className="p-2 border-2 border-[#002C5B] bg-white"
          aria-label="Página siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      ) : (
        <div className="p-2 border-2 border-[#002C5B] bg-white opacity-50 cursor-not-allowed">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
