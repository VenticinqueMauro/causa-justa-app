import { Campaign } from '@/types/campaign';
import { CampaignStatus } from '@/types/enums';

/**
 * Función para obtener los datos de la campaña por su slug o ID
 * Extraída para ser reutilizada en la generación de metadatos e imágenes OG
 */
/**
 * Función para obtener campañas aleatorias verificadas, excluyendo una campaña específica
 * @param excludeId ID o slug de la campaña a excluir
 * @param limit Número de campañas a obtener
 * @param page Página actual para paginación
 * @param seed Semilla para mantener consistencia entre páginas (opcional)
 */
export async function getRandomVerifiedCampaigns(
  excludeId: string, 
  limit: number = 3, 
  page: number = 1,
  seed?: string
): Promise<{ campaigns: Campaign[], totalPages: number }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
    if (!apiUrl) {
      console.error('API URL no configurada');
      return { campaigns: [], totalPages: 0 };
    }
    
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    
    // Usar una semilla aleatoria si no se proporciona una
    const seedValue = seed || Math.random().toString(36).substring(2, 15);
    
    // Calcular el offset basado en la página y el límite
    const offset = (page - 1) * limit;
    
    // Obtener campañas verificadas con paginación
    // Usamos un límite mayor para asegurarnos de tener suficientes campañas después de filtrar
    const fetchLimit = limit * 2;
    
    const response = await fetch(`${baseUrl}campaigns?status=VERIFIED&limit=${fetchLimit}&offset=${offset}&sort=random&seed=${seedValue}`, {
      next: { revalidate: 300 }, // Revalidar cada 5 minutos
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Error al obtener campañas aleatorias:', response.status);
      return { campaigns: [], totalPages: 0 };
    }
    
    const data = await response.json();
    
    // Filtrar la campaña actual
    const filteredCampaigns = (data.items || [])
      .filter((campaign: Campaign) => campaign.id !== excludeId && campaign.slug !== excludeId)
      .slice(0, limit);
    
    // Calcular el número total de páginas
    const totalItems = data.meta?.totalItems || filteredCampaigns.length;
    const totalPages = Math.ceil(totalItems / limit);
    
    return { 
      campaigns: filteredCampaigns,
      totalPages: totalPages > 0 ? totalPages : 1 // Al menos una página
    };
  } catch (error) {
    console.error('Error al obtener campañas aleatorias:', error);
    return { campaigns: [], totalPages: 0 };
  }
}

export async function getCampaignBySlug(slugOrId: string): Promise<Campaign | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
    if (!apiUrl) {
      console.error('API URL no configurada');
      return null;
    }
    
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    
    // Intentar primero obtener por ID directo (para casos donde el slug es en realidad un ID)
    let response = await fetch(`${baseUrl}campaigns/${slugOrId}`, {
      next: { revalidate: 60 }, // Revalidar cada hora
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Si no funciona, intentar con el endpoint de slug si está disponible
    if (!response.ok && response.status === 404) {
      console.log('Campaña no encontrada por ID, intentando por slug...');
      response = await fetch(`${baseUrl}campaigns?search=${encodeURIComponent(slugOrId)}&status=VERIFIED`, {
        next: { revalidate: 60 }, // Revalidar cada hora
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Si encontramos resultados, devolver el primero que coincida con el slug
        if (data.items && data.items.length > 0) {
          const matchingCampaign = data.items.find((c: Campaign) => 
            c.slug === slugOrId || c.id === slugOrId
          );
          if (matchingCampaign) {
            return matchingCampaign;
          }
          // Si no hay coincidencia exacta, devolver el primer resultado
          return data.items[0];
        }
      }
      return null;
    }

    if (!response.ok) {
      console.error('Error al obtener campaña:', response.status);
      return null;
    }

    const campaign = await response.json();
    return campaign;
  } catch (error) {
    console.error('Error al obtener campaña:', error);
    return null;
  }
}
