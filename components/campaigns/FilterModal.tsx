'use client';

import { CampaignCategory } from '@/types/enums';
import { getCategoryLabel } from '@/utils/campaign-categories';
import { AccessibilityIcon, Activity, AlertTriangle, Baby, Cat, GraduationCap, Heart, Home, Leaf, MoreHorizontal, Paintbrush, Store, UserPlus, Users, Utensils, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CampaignCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// Mapeo de categorías a iconos
const categoryIcons: Record<CampaignCategory, React.ReactNode> = {
  [CampaignCategory.HEALTH]: <Heart size={18} />,
  [CampaignCategory.EDUCATION]: <GraduationCap size={18} />,
  [CampaignCategory.FOOD]: <Utensils size={18} />,
  [CampaignCategory.PEOPLE]: <Users size={18} />,
  [CampaignCategory.HOUSING]: <Home size={18} />,
  [CampaignCategory.EMERGENCY]: <AlertTriangle size={18} />,
  [CampaignCategory.CHILDREN]: <Baby size={18} />,
  [CampaignCategory.ELDERLY]: <UserPlus size={18} />,
  [CampaignCategory.DISABILITY]: <AccessibilityIcon size={18} />,
  [CampaignCategory.ANIMALS]: <Cat size={18} />,
  [CampaignCategory.ENVIRONMENT]: <Leaf size={18} />,
  [CampaignCategory.SOCIAL_ENTERPRISE]: <Store size={18} />,
  [CampaignCategory.ARTS]: <Paintbrush size={18} />,
  [CampaignCategory.SPORTS]: <Activity size={18} />,
  [CampaignCategory.OTHERS]: <MoreHorizontal size={18} />,
};

const FilterModal = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory
}: FilterModalProps) => {
  // Usar useRef para evitar problemas con hooks condicionales
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    // Solo ejecutar este efecto si isOpen cambia a true
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Función para manejar clics fuera del modal
      const handleOutsideClick = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      };
      
      // Agregar event listener
      document.addEventListener('mousedown', handleOutsideClick);
      
      // Cleanup
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    } else {
      // Restaurar overflow cuando el modal se cierra
      document.body.style.overflow = '';
      return () => {};
    }
  }, [isOpen, onClose]);
  
  // Manejador para seleccionar categoría
  const handleCategorySelect = (category: string | null) => {
    onSelectCategory(category);
    onClose();
  };
  
  // No renderizar nada si el modal está cerrado
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50">
      <div 
        ref={modalRef}
        className="bg-white border-2 border-[#002C5B] shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] w-[90%] max-w-md max-h-[90vh] flex flex-col">
        <div className="sticky top-0 flex items-center justify-between p-4 border-b-2 border-[#002C5B] bg-white z-10">
          <h2 className="text-lg font-bold text-[#002C5B]">Filtrar por categoría</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 70px)' }}>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`px-4 py-2 text-sm border-2 border-[#002C5B] font-bold transition-all flex items-center gap-2 ${
                selectedCategory === null 
                  ? 'bg-[#002C5B] text-white' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              Todas las categorías
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 text-sm border-2 border-[#002C5B] font-bold transition-all flex items-center gap-2 ${
                  selectedCategory === category 
                    ? 'bg-[#002C5B] text-white' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <span>{categoryIcons[category as CampaignCategory]}</span>
                <span>{getCategoryLabel(category as CampaignCategory)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
