import { Metadata } from 'next';

interface MetadataProps {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
}

/**
 * Genera metadatos para páginas con valores predeterminados para SEO
 */
export function generateMetadata({
  title,
  description,
  image = '/images/og-image.jpg', // Imagen por defecto para compartir en redes sociales
  keywords = ['causa justa', 'donaciones', 'campañas solidarias', 'ayuda social', 'argentina'],
}: MetadataProps): Metadata {
  // URL base para rutas absolutas
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://causajusta.org';
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      images: [
        {
          url: image.startsWith('http') ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'es_AR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
    },
    metadataBase: new URL(baseUrl),
  };
}
