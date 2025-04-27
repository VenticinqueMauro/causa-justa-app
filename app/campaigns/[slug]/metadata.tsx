import { Metadata } from 'next';
import { getCampaignBySlug } from './utils';
import { CampaignCategory } from '@/types/enums';
import { getCategoryLabel } from '@/utils/campaign-categories';

// Función para generar los metadatos dinámicamente basados en el slug de la campaña
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Obtener los datos de la campaña
  const campaign = await getCampaignBySlug(params.slug);
  
  // Si no se encuentra la campaña, usar metadatos por defecto
  if (!campaign) {
    return {
      title: 'Campaña no encontrada | Causa Justa',
      description: 'Esta campaña no está disponible o ha sido eliminada.',
    };
  }

  // Obtener la categoría formateada
  const categoryLabel = getCategoryLabel(campaign.category as CampaignCategory);
  
  // Construir la URL absoluta para la imagen OG
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://causa-justa-app.vercel.app';
  const ogImageUrl = `${baseUrl}/campaigns/${params.slug}/opengraph-image`;

  // Construir la URL absoluta para la campaña
  const campaignUrl = `${baseUrl}/campaigns/${params.slug}`;
  
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

  // Calcular el progreso de la campaña
  const progress = campaign.goalAmount && campaign.currentAmount !== undefined
    ? Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100)
    : 0;

  // Crear una descripción enriquecida
  const description = `${campaign.shortDescription} | Categoría: ${categoryLabel} | Recaudado: ${formatCurrency(campaign.currentAmount)} (${progress}% de la meta)`;

  // Retornar los metadatos completos
  return {
    title: `${campaign.title} | Causa Justa`,
    description: description,
    openGraph: {
      title: campaign.title,
      description: description,
      url: campaignUrl,
      siteName: 'Causa Justa',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Campaña: ${campaign.title} - ${description}`,
        },
        // Agregar también la primera imagen de la campaña si existe
        ...(campaign.images && campaign.images.length > 0
          ? [
              {
                url: campaign.images[0],
                width: 800,
                height: 600,
                alt: `Imagen de la campaña: ${campaign.title}`,
              },
            ]
          : []),
      ],
      locale: 'es_AR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: campaign.title,
      description: description,
      images: [ogImageUrl],
      creator: '@causajusta',
      site: '@causajusta',
    },
    alternates: {
      canonical: campaignUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
