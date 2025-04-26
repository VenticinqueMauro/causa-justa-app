'use client';

import React, { useState } from 'react';
import { CampaignCategory } from '@/types/enums';
import { getCategoryLabel } from '@/utils/campaign-categories';
import {
  Heart, GraduationCap, Utensils, Users, Home,
  AlertTriangle, Baby, UserPlus, AccessibilityIcon,
  Cat, Leaf, Store, Paintbrush, Activity, MoreHorizontal
} from 'lucide-react';

interface CategoryFilterProps {
  categories: CampaignCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// Mapeo de categorías a iconos
const categoryIcons: Record<CampaignCategory, React.ReactNode> = {
  [CampaignCategory.HEALTH]: <Heart size={16} />,
  [CampaignCategory.EDUCATION]: <GraduationCap size={16} />,
  [CampaignCategory.FOOD]: <Utensils size={16} />,
  [CampaignCategory.PEOPLE]: <Users size={16} />,
  [CampaignCategory.HOUSING]: <Home size={16} />,
  [CampaignCategory.EMERGENCY]: <AlertTriangle size={16} />,
  [CampaignCategory.CHILDREN]: <Baby size={16} />,
  [CampaignCategory.ELDERLY]: <UserPlus size={16} />,
  [CampaignCategory.DISABILITY]: <AccessibilityIcon size={16} />,
  [CampaignCategory.ANIMALS]: <Cat size={16} />,
  [CampaignCategory.ENVIRONMENT]: <Leaf size={16} />,
  [CampaignCategory.SOCIAL_ENTERPRISE]: <Store size={16} />,
  [CampaignCategory.ARTS]: <Paintbrush size={16} />,
  [CampaignCategory.SPORTS]: <Activity size={16} />,
  [CampaignCategory.OTHERS]: <MoreHorizontal size={16} />,
};

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  // Determinar cuántas categorías mostrar inicialmente en móvil
  const initialCategoriesToShow = 4;
  
  // Dividir las categorías para mostrar/ocultar en móvil
  const visibleCategories = showAllCategories ? categories : categories.slice(0, initialCategoriesToShow);
  const hasMoreCategories = categories.length > initialCategoriesToShow;
  
  return (
    <div className="pb-4 mb-6">
      {/* Filtros principales */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1.5 text-sm border-2 border-[#002C5B] font-bold transition-all ${
            selectedCategory === null 
              ? 'bg-[#002C5B] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]' 
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          Todas
        </button>
        
        {visibleCategories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1.5 text-sm border-2 border-[#002C5B] font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === category 
                ? 'bg-[#002C5B] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <span className="md:block">{categoryIcons[category as CampaignCategory]}</span>
            <span className="md:inline">{getCategoryLabel(category as CampaignCategory)}</span>
          </button>
        ))}
        
        {/* Botón para mostrar más categorías en móvil */}
        {hasMoreCategories && (
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="px-3 py-1.5 text-sm border-2 border-[#002C5B] font-bold transition-all bg-white hover:bg-gray-100 flex items-center gap-1.5"
          >
            <span>
              {showAllCategories ? 
                <MoreHorizontal size={16} /> : 
                <MoreHorizontal size={16} />}
            </span>
            <span>{showAllCategories ? 'Ver menos' : 'Ver más'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
