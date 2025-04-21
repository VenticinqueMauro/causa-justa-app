/**
 * Enumeraciones compartidas entre frontend y backend
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  DONOR = 'DONOR',
  BENEFICIARY = 'BENEFICIARY',
  USER = 'USER'
}

export enum CampaignStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Categorías de campañas
 * Actualizado según las nuevas categorías proporcionadas por el backend
 */
export enum CampaignCategory {
  // Categorías existentes (renombradas para mayor claridad)
  HEALTH = 'HEALTH',                       // Salud y Bienestar
  EDUCATION = 'EDUCATION',                 // Educación
  FOOD = 'FOOD',                           // Alimentación y Nutrición
  PEOPLE = 'PEOPLE',                       // Personas (General)
  
  // Nuevas categorías
  HOUSING = 'HOUSING',                     // Vivienda
  EMERGENCY = 'EMERGENCY',                 // Emergencias y Desastres
  CHILDREN = 'CHILDREN',                   // Infancia y Juventud
  ELDERLY = 'ELDERLY',                     // Adultos Mayores
  DISABILITY = 'DISABILITY',               // Discapacidad e Inclusión
  ANIMALS = 'ANIMALS',                     // Animales y Mascotas
  ENVIRONMENT = 'ENVIRONMENT',             // Medio Ambiente
  SOCIAL_ENTERPRISE = 'SOCIAL_ENTERPRISE', // Emprendimiento Social
  ARTS = 'ARTS',                           // Arte y Cultura
  SPORTS = 'SPORTS',                       // Deporte e Inclusión
  OTHERS = 'OTHERS'                        // Otras Causas
}
