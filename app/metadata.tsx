import { Metadata } from 'next';

// Metadatos para la página principal
export const metadata: Metadata = {
  title: 'Causa Justa - Plataforma de recaudación de fondos',
  description: 'Plataforma de recaudación de fondos para todo tipo de causas: viajes, estudios, emergencias o proyectos personales y solidarios',
  
  // Configuración de Open Graph para compartir en redes sociales
  openGraph: {
    title: 'Causa Justa - Plataforma de recaudación de fondos',
    description: 'Plataforma de recaudación de fondos para todo tipo de causas: viajes, estudios, emergencias o proyectos personales y solidarios',
    url: 'https://causa-justa-app.vercel.app/',
    siteName: 'Causa Justa',
    images: [
      {
        // Imagen generada dinámicamente
        url: 'https://causa-justa-app.vercel.app/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Causa Justa - Plataforma de recaudación de fondos para todo tipo de causas',
      },
      // También podemos incluir una imagen estática como respaldo
      {
        url: 'https://causa-justa-app.vercel.app/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Causa Justa - Plataforma de recaudación de fondos',
      }
    ],
    locale: 'es_AR',
    type: 'website',
  },
  
  // Configuración específica para Twitter/X
  twitter: {
    card: 'summary_large_image',
    title: 'Causa Justa - Plataforma de recaudación de fondos',
    description: 'Plataforma de recaudación de fondos para todo tipo de causas',
    images: ['https://causa-justa-app.vercel.app/opengraph-image'],
    creator: '@causajusta',
    site: '@causajusta',
  },
  
  // Configuración para robots y rastreo
  robots: {
    index: true,
    follow: true,
  },
  
  // Configuración de enlaces alternativos
  alternates: {
    canonical: 'https://causa-justa-app.vercel.app/',
  },
  
  // Metadatos adicionales
  keywords: 'recaudación de fondos, crowdfunding, causas, proyectos, donaciones, Argentina',
  authors: [{ name: 'Causa Justa', url: 'https://causa-justa-app.vercel.app/' }],
  category: 'Crowdfunding',
  metadataBase: new URL('https://causa-justa-app.vercel.app/'),
};
