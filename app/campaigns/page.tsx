import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrutalSection from '@/components/ui/BrutalSection';
import BrutalHeading from '@/components/ui/BrutalHeading';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CampaignsClient from './CampaignsClient';
import { Campaign } from '@/types/campaign';
import { CampaignStatus, CampaignCategory } from '@/types/enums';
import { getCategoryLabel } from '@/utils/campaign-categories';

export async function generateMetadata(): Promise<Metadata> {
  // Obtener las campañas destacadas para enriquecer la descripción
  const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
  let featuredCampaignsCount = 0;
  let categories: string[] = [];
  
  if (apiUrl) {
    try {
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      const response = await fetch(`${baseUrl}campaigns?status=VERIFIED&isFeatured=true&limit=5`, {
        next: { revalidate: 60 },
      });
      
      if (response.ok) {
        const data = await response.json();
        featuredCampaignsCount = data.items?.length || 0;
        
        // Extraer categorías únicas para keywords
        const uniqueCategories = new Set<string>();
        data.items?.forEach((campaign: Campaign) => {
          if (campaign.category) {
            uniqueCategories.add(getCategoryLabel(campaign.category as CampaignCategory).toLowerCase());
          }
        });
        categories = Array.from(uniqueCategories);
      }
    } catch (error) {
      console.error('Error al obtener campañas destacadas para metadatos:', error);
    }
  }
  
  // URL base para rutas absolutas
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://causa-justa-app.vercel.app';
  
  // Descripción enriquecida con datos dinámicos
  const description = featuredCampaignsCount > 0
    ? `Explora ${featuredCampaignsCount}+ campañas activas en Causa Justa. Ayuda a quienes más lo necesitan con causas de ${categories.join(', ')}.`
    : 'Explora todas las campañas activas en Causa Justa y ayuda a quienes más lo necesitan.';
  
  return {
    title: 'Campañas | Por una Causa Justa',
    description,
    keywords: [
      'causa justa', 
      'donaciones', 
      'campañas solidarias',
      'ayuda social',
      'argentina',
      ...categories
    ].join(', '),
    openGraph: {
      title: 'Campañas | Por una Causa Justa',
      description,
      url: `${baseUrl}/campaigns`,
      siteName: 'Por una Causa Justa',
      images: [
        {
          url: '/opengraph-image', // Usar la misma imagen que la página principal para consistencia
          width: 1200,
          height: 630,
          alt: 'Campañas activas en Causa Justa',
          type: 'image/jpeg', // Especificar el tipo de imagen para mejor compatibilidad
        },
      ],
      locale: 'es_AR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Campañas | Por una Causa Justa',
      description,
      creator: '@PorUnaCausaJusta',
      images: ['/opengraph-image'], // Usar la misma imagen que OpenGraph para consistencia
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/campaigns',
      languages: {
        'es-AR': '/campaigns',
      },
    },
  };
}

interface CampaignsResponse {
  items: Campaign[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

async function getCampaigns(searchParams: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>): Promise<CampaignsResponse> {
  // Asegurarse de que searchParams esté resuelto
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
    if (!apiUrl) {
      console.error('API URL no configurada');
      return { items: [], meta: { totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 9 } };
    }
    
    // Construir parámetros de consulta
    const params = new URLSearchParams();
    params.append('status', 'VERIFIED');
    
    // Agregar parámetros de búsqueda si existen
    const page = typeof resolvedParams.page === 'string' ? resolvedParams.page : '1';
    const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
    const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;
    const limit = typeof resolvedParams.limit === 'string' ? resolvedParams.limit : '50'; // Aumentado a 50 para mostrar más campañas
    
    params.append('page', page);
    params.append('limit', limit); // Usar el límite proporcionado o 50 por defecto
    
    if (category) {
      params.append('category', category);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    const response = await fetch(`${baseUrl}campaigns?${params.toString()}`, {
      next: { revalidate: 60 }, // Revalidar cada hora
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error al obtener campañas:', response.status);
      return { items: [], meta: { totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 9 } };
    }

    const data = await response.json();
    return {
      items: data.items || [],
      meta: data.meta || { totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 9 }
    };
  } catch (error) {
    console.error('Error al obtener campañas:', error);
    return { items: [], meta: { totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 9 } };
  }
}

async function getAvailableCategories(): Promise<CampaignCategory[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
    if (!apiUrl) {
      console.error('API URL no configurada');
      return Object.values(CampaignCategory);
    }
    
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    
    // Idealmente, el backend tendría un endpoint para obtener categorías con campañas
    // Como alternativa, obtenemos todas las campañas y extraemos las categorías únicas
    const response = await fetch(`${baseUrl}campaigns/categories`, {
      next: { revalidate: 86400 }, // Revalidar cada día (las categorías cambian con menos frecuencia)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Si el endpoint no existe, devolvemos todas las categorías
      if (response.status === 404) {
        return Object.values(CampaignCategory);
      }
      console.error('Error al obtener categorías:', response.status);
      return Object.values(CampaignCategory);
    }

    const data = await response.json();
    return data.categories || Object.values(CampaignCategory);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return Object.values(CampaignCategory);
  }
}



export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidar cada hora

export default async function CampaignsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // En Next.js 15, searchParams es ahora asincrónico y debe ser await
  // Pasamos searchParams directamente a getCampaigns, que se encargará de resolverlo
  
  // Obtener campañas con los parámetros de búsqueda
  const { items: campaigns, meta } = await getCampaigns(searchParams);
  
  // Obtener categorías disponibles
  const availableCategories = await getAvailableCategories();
  
  return (
    <div className="flex min-h-screen flex-col bg-[#ECECE2]">
      <Header />
      <main className="flex-1">
        <BrutalSection className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Campañas', href: '/campaigns', isCurrent: true }
              ]}
              className="mb-6"
            />
            
            <BrutalHeading className="text-3xl md:text-4xl mb-8">Campañas activas</BrutalHeading>
            
            {/* Componente cliente para filtros y listado */}
            <CampaignsClient 
              initialCampaigns={campaigns} 
              initialMeta={meta} 
              availableCategories={availableCategories} 
            />
          </div>
        </BrutalSection>
      </main>
      <Footer />
    </div>
  );
}
