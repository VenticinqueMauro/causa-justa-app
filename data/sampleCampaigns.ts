import { Campaign } from "@/types/campaign";

export const sampleCampaigns: Campaign[] = [
  {
    title: "Reconstrucción escuela rural",
    description:
      "Ayuda a reconstruir una escuela rural afectada por desastres naturales, brindando un espacio seguro para que los niños continúen su educación.",
    image: "/campaigns/school.jpg",
    raised: 12500,
    goal: 25000,
    category: "Educación",
    organizer: "Fundación Educativa",
  },
  {
    title: "Tratamiento médico para María",
    description:
      "María necesita un tratamiento médico especializado que no está cubierto por su seguro. Tu ayuda puede cambiar su vida.",
    image: "/campaigns/medical.jpg",
    raised: 8750,
    goal: 15000,
    category: "Salud",
    organizer: "Familia Pérez",
  },
  {
    title: "Alimentos para familias vulnerables",
    description:
      "Proporciona alimentos nutritivos a familias que enfrentan inseguridad alimentaria en nuestra comunidad local.",
    image: "/campaigns/food.jpg",
    raised: 5200,
    goal: 10000,
    category: "Alimentación",
    organizer: "Banco de Alimentos Regional",
  },
  {
    title: "Refugio para animales abandonados",
    description:
      "Ayuda a construir un nuevo refugio para animales abandonados y maltratados, brindándoles un hogar temporal seguro.",
    image: "/campaigns/animals.jpg",
    raised: 18000,
    goal: 30000,
    category: "Animales",
    organizer: "Protectora Animal",
  },
  {
    title: "Equipamiento deportivo para jóvenes",
    description:
      "Proporciona equipamiento deportivo a jóvenes de barrios desfavorecidos para fomentar hábitos saludables y trabajo en equipo.",
    image: "/campaigns/sports.jpg",
    raised: 3500,
    goal: 7500,
    category: "Deportes",
    organizer: "Club Deportivo Comunitario",
  },
  {
    title: "Reforestación de bosque local",
    description:
      "Contribuye a la reforestación de un área boscosa afectada por incendios, restaurando el ecosistema y la biodiversidad local.",
    image: "/campaigns/forest.jpg",
    raised: 9800,
    goal: 12000,
    category: "Medio Ambiente",
    organizer: "Asociación Ecológica",
  }
];
