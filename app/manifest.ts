import { MetadataRoute } from 'next';

/**
 * Genera el archivo manifest.json para PWA y mejorar SEO
 * @returns Configuración del manifest para Next.js
 */
export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://causa-justa-app.vercel.app';
  
  return {
    name: 'Por una Causa Justa',
    short_name: 'Causa Justa',
    description: 'Plataforma de recaudación de fondos para todo tipo de causas: viajes, estudios, emergencias o proyectos solidarios',
    start_url: '/',
    display: 'standalone',
    background_color: '#ECECE2',
    theme_color: '#002C5B',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
