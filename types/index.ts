/**
 * Archivo de índice para exportar todos los tipos
 * Facilita la importación en componentes usando:
 * import { UserRole, CampaignStatus, etc. } from '@/types';
 */

// Exportar enumeraciones (prioridad a las definiciones en enums.ts)
export * from './enums';

// Exportar DTOs de respuesta
export * from './responses';

// Exportar DTOs de solicitud
export * from './requests';

// Exportar interfaces de pago
export * from './payments';

// Exportar tipos existentes (compatibilidad hacia atrás)
// Exportamos selectivamente para evitar conflictos con enums.ts
import type { Campaign, CampaignFormData } from './campaign';
export type { Campaign, CampaignFormData };

// Exportar tipos de usuario
export * from './users.type';
