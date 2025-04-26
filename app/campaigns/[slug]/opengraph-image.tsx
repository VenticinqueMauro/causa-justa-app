import { ImageResponse } from 'next/og';
import { getCategoryLabel } from '@/utils/campaign-categories';
import { CampaignCategory } from '@/types/enums';
import { getCampaignBySlug } from './utils';

// Configuración de la imagen
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Configuración de revalidación
export const revalidate = 3600; // Revalidar cada hora

// Configuración de runtime - fundamental para que funcione correctamente
export const runtime = 'edge';

// Función para generar la imagen OG dinámicamente
/**
 * Genera dinámicamente la imagen OpenGraph para una campaña específica
 * Esta imagen se mostrará cuando se comparta la URL de la campaña en redes sociales
 * @param params - Parámetros de la ruta dinámica, incluyendo el slug de la campaña
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  // En Next.js 15, los parámetros son ahora asincónicos y deben ser await
  // Ver: https://nextjs.org/docs/app/guides/upgrading/version-15#params--searchparams
  const { slug } = await params;
  
  // Obtener los datos de la campaña
  const campaign = await getCampaignBySlug(slug);
  
  // Si no se encuentra la campaña, usar una imagen por defecto
  if (!campaign) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: '#ECECE2',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#002C5B',
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: '20px' }}>
            Por una Causa Justa
          </div>
          <div>Campaña no encontrada</div>
        </div>
      ),
      { 
        ...size,
        // Optimizaciones para mejorar la calidad y rendimiento
        emoji: 'twemoji', // Soporte para emojis consistentes
        debug: false, // Deshabilitar en producción
        headers: {
          'Cache-Control': 'public, max-age=86400, immutable'
        }
      }
    );
  }

  // Obtener la categoría formateada
  const categoryLabel = getCategoryLabel(campaign.category as CampaignCategory);
  
  // Calcular el progreso de la campaña
  const progress = campaign.goalAmount && campaign.currentAmount !== undefined
    ? Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100)
    : 0;
  
  // Formatear el monto recaudado
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Obtener la primera imagen de la campaña o usar una por defecto
  const imageUrl = campaign.images && campaign.images.length > 0
    ? campaign.images[0]
    : '/images/default-campaign.jpg';
  
  // Generar la imagen OG
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: '#ECECE2',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Encabezado con logo y categoría */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ 
            fontSize: 36, 
            fontWeight: 'bold', 
            color: '#002C5B',
          }}>
            Causa Justa
          </div>
          <div style={{ 
            backgroundColor: '#002C5B', 
            color: 'white', 
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: 24,
          }}>
            {categoryLabel}
          </div>
        </div>
        
        {/* Contenido principal */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flex: 1, 
          gap: '40px',
          background: 'white',
          border: '3px solid #002C5B',
          padding: '30px',
          boxShadow: '8px 8px 0px 0px rgba(0,44,91,0.8)',
        }}>
          {/* Imagen de la campaña */}
          <div style={{ 
            width: '45%', 
            height: 'auto',
            position: 'relative',
            border: '2px solid #002C5B',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
          }}>
            {/* No podemos usar next/image aquí, así que usamos un placeholder */}
            <div style={{ 
              fontSize: 24, 
              color: '#002C5B',
              textAlign: 'center',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}>
              {/* Mostrar texto del título con emojis que representen la categoría */}
              {getCategoryEmoji(campaign.category as CampaignCategory)} {campaign.title}
            </div>
          </div>
          
          {/* Información de la campaña */}
          <div style={{ 
            width: '55%', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            {/* Título y descripción */}
            <div>
              <div style={{ 
                fontSize: 48, 
                fontWeight: 'bold', 
                color: '#002C5B',
                marginBottom: '20px',
                lineHeight: 1.2,
              }}>
                {campaign.title}
              </div>
              <div style={{ 
                fontSize: 28, 
                color: '#4A4A4A',
                marginBottom: '30px',
                lineHeight: 1.4,
              }}>
                {campaign.shortDescription.length > 120
                  ? campaign.shortDescription.substring(0, 120) + '...'
                  : campaign.shortDescription
                }
              </div>
            </div>
            
            {/* Progreso y meta */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}>
                <div style={{ fontWeight: 'bold', fontSize: 36, color: '#002C5B' }}>
                  {formatCurrency(campaign.currentAmount)}
                </div>
                <div style={{ fontSize: 24, color: '#4A4A4A' }}>
                  Meta: {formatCurrency(campaign.goalAmount)}
                </div>
              </div>
              
              {/* Barra de progreso */}
              <div style={{ 
                width: '100%', 
                height: '24px',
                border: '2px solid #002C5B',
                marginBottom: '10px',
                position: 'relative',
              }}>
                <div style={{ 
                  width: `${progress}%`, 
                  height: '100%',
                  backgroundColor: '#002C5B',
                }} />
              </div>
              
              <div style={{ 
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 24,
                color: '#002C5B',
              }}>
                {progress}% recaudado
              </div>
            </div>
          </div>
        </div>
        
        {/* Pie de página */}
        <div style={{ 
          marginTop: '20px',
          fontSize: 24,
          color: '#002C5B',
          textAlign: 'center',
        }}>
          causajusta.org/campaigns/{campaign.slug}
        </div>
      </div>
    ),
    { 
      ...size,
      // Optimizaciones para mejorar la calidad y rendimiento
      emoji: 'twemoji', // Soporte para emojis consistentes
      debug: false, // Deshabilitar en producción
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600' // Caché por 1 hora
      }
    }
  );
}

/**
 * Función auxiliar para obtener un emoji representativo de cada categoría
 */
function getCategoryEmoji(category: CampaignCategory): string {
  const emojiMap: Record<CampaignCategory, string> = {
    HEALTH: '🏥',
    EDUCATION: '📚',
    FOOD: '🍲',
    PEOPLE: '👪',
    HOUSING: '🏠',
    EMERGENCY: '🚨',
    CHILDREN: '👶',
    ELDERLY: '👵',
    DISABILITY: '♿',
    ANIMALS: '🐾',
    ENVIRONMENT: '🌳',
    SOCIAL_ENTERPRISE: '🤝',
    ARTS: '🎨',
    SPORTS: '⚽',
    OTHERS: '✨',
  };
  
  return emojiMap[category] || '✨';
}
