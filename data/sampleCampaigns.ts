import { Campaign } from "@/types/campaign";
import { CampaignCategory, CampaignStatus } from "@/types/enums";

// Este archivo es solo para referencia y no se usa actualmente
// Para datos de muestra, usar sampleData.ts

// Nota: Este archivo no cumple completamente con la interfaz Campaign
// Se ha comentado para evitar errores de tipo durante el build

/* 
export const sampleCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Reconstrucción escuela rural",
    slug: "reconstruccion-escuela-rural",
    description: "Ayuda a reconstruir una escuela rural afectada por desastres naturales, brindando un espacio seguro para que los niños continúen su educación.",
    shortDescription: "Reconstrucción de escuela rural",
    category: CampaignCategory.EDUCATION,
    goalAmount: 25000,
    images: ["/campaigns/school.jpg"],
    location: {
      city: "Villa María",
      province: "Córdoba",
      country: "Argentina"
    },
    recipient: {
      name: "Escuela Rural N°25",
      age: undefined,
      condition: "Dañada por desastres naturales"
    },
    creator: {
      relation: "Director",
      contact: "director@fundacioneducativa.org"
    },
    tags: ["educación", "reconstrucción", "escuela"],
    status: CampaignStatus.VERIFIED,
    createdAt: "2025-03-01T10:00:00Z",
    updatedAt: "2025-03-02T14:30:00Z"
  },
  {
    id: "2",
    title: "Tratamiento médico para María",
    slug: "tratamiento-medico-maria",
    description: "María necesita un tratamiento médico especializado que no está cubierto por su seguro. Tu ayuda puede cambiar su vida.",
    shortDescription: "Tratamiento médico especializado",
    category: CampaignCategory.HEALTH,
    goalAmount: 15000,
    images: ["/campaigns/medical.jpg"],
    location: {
      city: "Buenos Aires",
      province: "Buenos Aires",
      country: "Argentina"
    },
    recipient: {
      name: "María Pérez",
      age: 35,
      condition: "Enfermedad crónica"
    },
    creator: {
      relation: "Familiar",
      contact: "familia@perez.com"
    },
    tags: ["salud", "tratamiento", "ayuda"],
    status: CampaignStatus.VERIFIED,
    createdAt: "2025-02-15T09:00:00Z",
    updatedAt: "2025-02-16T11:45:00Z"
  },
  {
    id: "3",
    title: "Alimentos para familias vulnerables",
    slug: "alimentos-familias-vulnerables",
    description: "Proporciona alimentos nutritivos a familias que enfrentan inseguridad alimentaria en nuestra comunidad local.",
    shortDescription: "Alimentos para familias vulnerables",
    category: CampaignCategory.FOOD,
    goalAmount: 10000,
    images: ["/campaigns/food.jpg"],
    location: {
      city: "Rosario",
      province: "Santa Fe",
      country: "Argentina"
    },
    recipient: {
      name: "Banco de Alimentos Regional",
      age: undefined,
      condition: "Asistencia alimentaria"
    },
    creator: {
      relation: "Coordinador",
      contact: "coordinador@bancoalimentos.org"
    },
    tags: ["alimentos", "familias", "ayuda"],
    status: CampaignStatus.VERIFIED,
    createdAt: "2025-01-20T14:00:00Z",
    updatedAt: "2025-01-21T16:30:00Z"
  }
];
*/

// Exportar un array vacío para evitar errores de compilación
export const sampleCampaigns: Campaign[] = [];
