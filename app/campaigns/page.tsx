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

export const metadata: Metadata = {
  title: 'Campañas | Causa Justa',
  description: 'Explora todas las campañas activas en Causa Justa y ayuda a quienes más lo necesitan.',
};

interface CampaignsResponse {
  items: Campaign[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

async function getCampaigns(searchParams: { [key: string]: string | string[] | undefined }): Promise<CampaignsResponse> {
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
    const page = typeof searchParams.page === 'string' ? searchParams.page : '1';
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    
    params.append('page', page);
    params.append('limit', '9'); // 9 campañas por página (3x3 grid)
    
    if (category) {
      params.append('category', category);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    const response = await fetch(`${baseUrl}campaigns?${params.toString()}`, {
      cache: 'no-store',
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
      cache: 'no-store',
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



export default async function CampaignsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
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
