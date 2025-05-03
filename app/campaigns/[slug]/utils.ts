import { Campaign } from '@/types/campaign';

/**
 * Función para obtener los datos de la campaña por su slug o ID
 * Extraída para ser reutilizada en la generación de metadatos e imágenes OG
 */
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
