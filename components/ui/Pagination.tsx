'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) return null;

  // Calcular rango de páginas a mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      {/* Botón Anterior */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 border-2 border-[#002C5B] font-bold ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100 transition-colors'
        }`}
      >
        &laquo; Anterior
      </button>
      
      {/* Números de página */}
      {getPageNumbers().map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-10 h-10 flex items-center justify-center border-2 border-[#002C5B] font-bold ${
            currentPage === number
              ? 'bg-[#002C5B] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]'
              : 'bg-white hover:bg-gray-100 transition-colors'
          }`}
        >
          {number}
        </button>
      ))}
      
      {/* Botón Siguiente */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 border-2 border-[#002C5B] font-bold ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100 transition-colors'
        }`}
      >
        Siguiente &raquo;
      </button>
    </div>
  );
};

export default Pagination;
