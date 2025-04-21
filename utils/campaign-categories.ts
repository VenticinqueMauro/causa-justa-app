/**
 * Utilidades para manejar las categorías de campañas
 * Proporciona etiquetas amigables en español para las categorías
 */

import { CampaignCategory } from '@/types';

/**
 * Mapeo de categorías a etiquetas en español
 */
export const categoryLabels: Record<CampaignCategory, string> = {
  // Categorías existentes
  [CampaignCategory.HEALTH]: 'Salud y Bienestar',
  [CampaignCategory.EDUCATION]: 'Educación',
  [CampaignCategory.FOOD]: 'Alimentación y Nutrición',
  [CampaignCategory.PEOPLE]: 'Personas',
  
  // Nuevas categorías
  [CampaignCategory.HOUSING]: 'Vivienda',
  [CampaignCategory.EMERGENCY]: 'Emergencias y Desastres',
  [CampaignCategory.CHILDREN]: 'Infancia y Juventud',
  [CampaignCategory.ELDERLY]: 'Adultos Mayores',
  [CampaignCategory.DISABILITY]: 'Discapacidad e Inclusión',
  [CampaignCategory.ANIMALS]: 'Animales y Mascotas',
  [CampaignCategory.ENVIRONMENT]: 'Medio Ambiente',
  [CampaignCategory.SOCIAL_ENTERPRISE]: 'Emprendimiento Social',
  [CampaignCategory.ARTS]: 'Arte y Cultura',
  [CampaignCategory.SPORTS]: 'Deporte e Inclusión',
  [CampaignCategory.OTHERS]: 'Otras Causas'
};

/**
 * Obtiene la etiqueta amigable para una categoría
 * @param category Categoría de campaña
 * @returns Etiqueta en español
 */
export const getCategoryLabel = (category: CampaignCategory): string => {
  return categoryLabels[category] || 'Desconocida';
};

/**
 * Obtiene todas las categorías como opciones para un selector
 * @returns Array de objetos {value, label} para usar en selectores
 */
export const getCategoryOptions = () => {
  return Object.entries(categoryLabels).map(([value, label]) => ({
    value,
    label
  }));
};

/**
 * Obtiene un color asociado a cada categoría para uso en UI
 * @param category Categoría de campaña
 * @returns Código de color hexadecimal
 */
export const getCategoryColor = (category: CampaignCategory): string => {
  const colorMap: Record<CampaignCategory, string> = {
    [CampaignCategory.HEALTH]: '#FF5A5F',        // Rojo suave
    [CampaignCategory.EDUCATION]: '#007AFF',     // Azul
    [CampaignCategory.FOOD]: '#FF9500',          // Naranja
    [CampaignCategory.PEOPLE]: '#5856D6',        // Púrpura
    [CampaignCategory.HOUSING]: '#8E8E93',       // Gris
    [CampaignCategory.EMERGENCY]: '#FF3B30',     // Rojo
    [CampaignCategory.CHILDREN]: '#5AC8FA',      // Azul claro
    [CampaignCategory.ELDERLY]: '#9C8E75',       // Marrón claro
    [CampaignCategory.DISABILITY]: '#34C759',    // Verde
    [CampaignCategory.ANIMALS]: '#AF52DE',       // Morado
    [CampaignCategory.ENVIRONMENT]: '#30D158',   // Verde brillante
    [CampaignCategory.SOCIAL_ENTERPRISE]: '#64D2FF', // Azul cielo
    [CampaignCategory.ARTS]: '#FF2D55',          // Rosa
    [CampaignCategory.SPORTS]: '#5AC8FA',        // Azul claro
    [CampaignCategory.OTHERS]: '#8E8E93'         // Gris
  };
  
  return colorMap[category] || '#8E8E93'; // Gris por defecto
};
