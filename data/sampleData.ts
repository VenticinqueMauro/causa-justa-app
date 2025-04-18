import React from "react";
import { Campaign, CampaignCategory, CampaignStatus } from "@/types/campaign";

export const campaigns: Campaign[] = [
  {
    id: "1",
    title: "Reconstrucción escuela rural",
    slug: "reconstruccion-escuela-rural",
    description: "Ayuda a reconstruir una escuela rural dañada por las inundaciones recientes en la provincia de Córdoba.",
    shortDescription: "Reconstrucción de escuela dañada por inundaciones",
    category: CampaignCategory.EDUCATION,
    goalAmount: 25000,
    images: ["/placeholder.svg?height=225&width=400"],
    location: {
      city: "Villa María",
      province: "Córdoba",
      country: "Argentina"
    },
    recipient: {
      name: "Escuela Rural N°25",
      age: undefined,
      condition: "Dañada por inundaciones"
    },
    creator: {
      relation: "Director",
      contact: "director@escuela25.edu.ar"
    },
    tags: ["educación", "reconstrucción", "inundaciones"],
    status: CampaignStatus.VERIFIED,
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-02T14:30:00Z"
  },
  {
    id: "2",
    title: "Equipamiento médico para hospital",
    slug: "equipamiento-medico-hospital",
    description: "Contribuye a la compra de equipamiento médico esencial para el Hospital Infantil de Buenos Aires.",
    shortDescription: "Equipamiento médico para Hospital Infantil",
    category: CampaignCategory.HEALTH,
    goalAmount: 30000,
    images: ["/placeholder.svg?height=225&width=400"],
    location: {
      city: "Buenos Aires",
      province: "Buenos Aires",
      country: "Argentina"
    },
    recipient: {
      name: "Hospital Infantil",
      age: undefined,
      condition: "Necesita equipamiento"
    },
    creator: {
      relation: "Jefe de Departamento",
      contact: "jefe@hospitalinfantil.org"
    },
    tags: ["salud", "niños", "equipamiento"],
    status: CampaignStatus.VERIFIED,
    createdAt: "2025-03-15T09:00:00Z",
    updatedAt: "2025-03-16T11:45:00Z"
  },
  {
    id: "3",
    title: "Comedores comunitarios",
    slug: "alimentos-comedores-comunitarios",
    description: "Tu donación ayudará a proveer alimentos a 10 comedores comunitarios que asisten a más de 500 niños diariamente.",
    shortDescription: "Alimentos para comedores comunitarios",
    category: CampaignCategory.FOOD,
    goalAmount: 20000,
    images: ["/placeholder.svg?height=225&width=400"],
    location: {
      city: "Rosario",
      province: "Santa Fe",
      country: "Argentina"
    },
    recipient: {
      name: "Red de Comedores Comunitarios",
      age: undefined,
      condition: "Asistencia alimentaria"
    },
    creator: {
      relation: "Coordinador",
      contact: "coordinador@redcomedores.org"
    },
    tags: ["alimentos", "niños", "comedores"],
    status: CampaignStatus.VERIFIED,
    createdAt: "2025-02-20T14:00:00Z",
    updatedAt: "2025-02-21T16:30:00Z"
  },
];

export const benefits = [
  {
    title: "100% Transparente",
    description: "Seguimiento detallado de cada donación y reportes periódicos sobre el uso de los fondos.",
    icon: "shield",
  },
  {
    title: "Causas verificadas",
    description: "Todas las organizaciones y causas pasan por un riguroso proceso de verificación.",
    icon: "check-circle",
  },
  {
    title: "Comunidad solidaria",
    description: "Forma parte de una comunidad comprometida con el cambio social positivo.",
    icon: "users",
  },
];

export const testimonials = [
  {
    name: "María González",
    role: "Directora de Escuela",
    quote:
      "Gracias a las donaciones recibidas a través de Causa Justa, pudimos reconstruir nuestra escuela después de las inundaciones. El proceso fue transparente y eficiente.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Carlos Rodríguez",
    role: "Donante recurrente",
    quote:
      "Me encanta la transparencia de Causa Justa. Puedo ver exactamente cómo se utilizan mis donaciones y el impacto que generan en la comunidad.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Laura Méndez",
    role: "Voluntaria",
    quote:
      "Como voluntaria, he visto de primera mano cómo las donaciones transforman vidas. Causa Justa hace que el proceso sea simple tanto para donantes como para organizaciones.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
];

export const steps = [
  {
    title: "Regístrate",
    description: "Crea una cuenta gratuita en nuestra plataforma en menos de 2 minutos.",
  },
  {
    title: "Elige una causa",
    description: "Explora las causas verificadas o inicia tu propia campaña de recaudación.",
  },
  {
    title: "Haz la diferencia",
    description: "Dona de forma segura y recibe actualizaciones sobre el impacto de tu contribución.",
  },
];
