import { MetadataRoute } from 'next';
import { CampaignCategory } from '@/types/enums';

/**
 * Genera dinámicamente el sitemap.xml para mejorar el SEO
 * @returns Configuración del sitemap para Next.js
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // URL base de la aplicación
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://causajusta.org';
  
  // Rutas estáticas principales
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/campaigns`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Obtener campañas populares para incluirlas en el sitemap
  let campaignRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
    if (apiUrl) {
      const baseApiUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      const response = await fetch(`${baseApiUrl}campaigns?status=VERIFIED&limit=50&sort=currentAmount:desc`, {
        next: { revalidate: 86400 }, // Revalidar diariamente
      });
      
      if (response.ok) {
        const data = await response.json();
        
        campaignRoutes = (data.items || []).map((campaign: any) => ({
          url: `${baseUrl}/campaigns/${campaign.slug || campaign.id}`,
          lastModified: new Date(campaign.updatedAt || campaign.createdAt),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error('Error al obtener campañas para el sitemap:', error);
  }
  
  // Rutas para páginas de categorías
  const categoryRoutes = Object.values(CampaignCategory).map((category) => ({
    url: `${baseUrl}/campaigns?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...campaignRoutes, ...categoryRoutes];
}
