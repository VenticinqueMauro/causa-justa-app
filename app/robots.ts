import { MetadataRoute } from 'next';

/**
 * Genera dinámicamente el archivo robots.txt para mejorar el SEO
 * @returns Configuración de robots para Next.js
 */
export default function robots(): MetadataRoute.Robots {
  // URL base de la aplicación
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://causajusta.org';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Rutas que no deberían ser indexadas
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/campaigns/payment-error/',
        '/campaigns/thank-you/',
        '/_next/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
