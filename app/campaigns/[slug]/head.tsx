import { getCampaignBySlug } from './utils';

// Este componente agrega metadatos específicos para WhatsApp
// WhatsApp a veces ignora las etiquetas meta generadas por Next.js metadata API
export default async function Head({ params }: { params: { slug: string } }) {
  // Obtener los datos de la campaña
  const campaign = await getCampaignBySlug(params.slug);
  
  // Si no se encuentra la campaña, usar valores por defecto
  if (!campaign) {
    return null;
  }

  // Construir la URL base para URLs absolutas
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://causa-justa-app.vercel.app';
  
  // Obtener la URL de la imagen real de la campaña (si existe)
  const campaignImageUrl = campaign.images && campaign.images.length > 0
    ? campaign.images[0]
    : null;
    
  // Convertir a URL absoluta si es necesario
  const absoluteCampaignImageUrl = campaignImageUrl
    ? (campaignImageUrl.startsWith('http')
        ? campaignImageUrl
        : `${baseUrl}${campaignImageUrl}`)
    : null;

  // URL de la imagen OG generada dinámicamente como fallback
  const ogImageUrl = `${baseUrl}/campaigns/${params.slug}/opengraph-image`;
  
  // Usar la imagen real de la campaña si existe, de lo contrario usar la imagen OG generada
  const finalImageUrl = absoluteCampaignImageUrl || ogImageUrl;
  
  // Descripción corta para compartir
  const shortDescription = campaign.shortDescription && campaign.shortDescription.length > 100
    ? campaign.shortDescription.substring(0, 100) + '...'
    : campaign.shortDescription;

  return (
    <>
      {/* Metadatos específicos para WhatsApp */}
      <meta property="og:image" content={finalImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:title" content={campaign.title} />
      <meta property="og:description" content={shortDescription} />
      <meta property="og:url" content={`${baseUrl}/campaigns/${params.slug}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Causa Justa" />
      
      {/* Metadatos específicos para Twitter/X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={finalImageUrl} />
      <meta name="twitter:title" content={campaign.title} />
      <meta name="twitter:description" content={shortDescription} />
    </>
  );
}
