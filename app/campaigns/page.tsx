import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrutalSection from '@/components/ui/BrutalSection';
import BrutalHeading from '@/components/ui/BrutalHeading';
import CampaignCard from '@/components/ui/CampaignCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Campaign } from '@/types/campaign';
import { CampaignStatus } from '@/types/enums';

export const metadata: Metadata = {
  title: 'Campañas | Causa Justa',
  description: 'Explora todas las campañas activas en Causa Justa y ayuda a quienes más lo necesitan.',
};

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
    if (!apiUrl) {
      console.error('API URL no configurada');
      return [];
    }
    
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    const response = await fetch(`${baseUrl}campaigns?status=VERIFIED`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error al obtener campañas:', response.status);
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error al obtener campañas:', error);
    return [];
  }
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  
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
            
            {campaigns.length === 0 ? (
              <div className="bg-white border-2 border-[#002C5B] p-8 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] text-center">
                <p className="text-xl">No hay campañas disponibles en este momento.</p>
                <p className="mt-2">¡Vuelve pronto para ver nuevas causas!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}
          </div>
        </BrutalSection>
      </main>
      <Footer />
    </div>
  );
}
