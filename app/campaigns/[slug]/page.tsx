import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrutalSection from '@/components/ui/BrutalSection';
import BrutalHeading from '@/components/ui/BrutalHeading';
import DonationForm from '@/components/campaigns/DonationForm';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Campaign } from '@/types/campaign';
import { CampaignCategory } from '@/types/enums';
import { getCategoryLabel } from '@/utils/campaign-categories';
import { generateMetadata as baseGenerateMetadata } from '@/utils/metadata';
import { getCampaignBySlug } from './utils';

// La función getCampaignBySlug ahora se importa desde ./utils

// Función para formatear la fecha
function formatDate(dateString?: string): string {
  if (!dateString) return 'Fecha no disponible';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Función para formatear moneda
function formatCurrency(amount?: number): string {
  if (amount === undefined) return '$0';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Generar metadatos dinámicos para la página de detalle de campaña
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const campaign = await getCampaignBySlug(params.slug);
  
  if (!campaign) {
    return baseGenerateMetadata({
      title: 'Campaña no encontrada | Causa Justa',
      description: 'La campaña que estás buscando no existe o ha sido eliminada.',
    });
  }
  
  // URL base para rutas absolutas
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://causajusta.org';
  const categoryLabel = getCategoryLabel(campaign.category as CampaignCategory);
  
  // Calcular el progreso de la campaña para enriquecer la descripción
  const progress = campaign.goalAmount && campaign.currentAmount !== undefined
    ? Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100)
    : 0;
  
  // Descripción enriquecida con datos dinámicos
  const description = `${campaign.shortDescription || 'Ayuda a esta causa solidaria'}. ${progress}% recaudado de la meta. Categoría: ${categoryLabel}.`;
  
  return {
    title: `${campaign.title} | Causa Justa`,
    description,
    keywords: [
      'causa justa', 
      'donaciones', 
      categoryLabel.toLowerCase(),
      'ayuda social',
      'argentina',
      campaign.tags?.join(', ') || '',
    ].filter(Boolean).join(', '),
    openGraph: {
      title: campaign.title,
      description,
      images: [
        {
          url: `/campaigns/${params.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: campaign.title,
        },
      ],
      locale: 'es_AR',
      type: 'article',
      publishedTime: campaign.publishedAt || campaign.createdAt,
      modifiedTime: campaign.updatedAt,
      tags: campaign.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: campaign.title,
      description,
      images: [`/campaigns/${params.slug}/opengraph-image`],
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/campaigns/${params.slug}`,
      languages: {
        'es-AR': `/campaigns/${params.slug}`,
      },
    },
  };
}

// Generar rutas estáticas para las campañas más populares
export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
    if (!apiUrl) {
      return [];
    }
    
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    const response = await fetch(`${baseUrl}campaigns?status=VERIFIED&limit=20&sort=currentAmount:desc`, {
      next: { revalidate: 86400 }, // Revalidar diariamente
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return (data.items || []).map((campaign: Campaign) => ({
      slug: campaign.slug || campaign.id,
    }));
  } catch (error) {
    console.error('Error generando rutas estáticas:', error);
    return [];
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidar cada hora

export default async function CampaignDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  console.log('Buscando campaña con slug/id:', slug);
  const campaign = await getCampaignBySlug(slug);
  
  if (!campaign) {
    console.error('Campaña no encontrada para slug/id:', slug);
    notFound();
  }
  
  console.log('Campaña encontrada:', campaign.title);

  // Calcular el progreso de la campaña
  const progress = campaign.goalAmount && campaign.currentAmount !== undefined
    ? Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100)
    : 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#ECECE2]">
      <Header />
      <main className="flex-1">
        <BrutalSection className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Campañas', href: '/campaigns' },
                { label: campaign.title, href: `/campaigns/${slug}`, isCurrent: true }
              ]}
              className="mb-6"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna izquierda - Imágenes y detalles */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border-2 border-[#002C5B] overflow-hidden">
                  <Image
                    src={campaign.images && campaign.images.length > 0 ? 
                      (campaign.images[0].startsWith('http') ? campaign.images[0] : `/placeholder.svg`) : 
                      "/placeholder.svg"}
                    alt={campaign.title}
                    width={800}
                    height={450}
                    className="w-full object-cover"
                  />
                </div>
                
                <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-[#002C5B] text-white text-sm font-bold uppercase">
                      {getCategoryLabel(campaign.category as CampaignCategory)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Publicado: {formatDate(campaign.publishedAt || campaign.createdAt)}
                    </span>
                  </div>
                  
                  <BrutalHeading className="text-2xl md:text-3xl mb-4">{campaign.title}</BrutalHeading>
                  
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-700 mb-4">{campaign.shortDescription}</p>
                    <div className="whitespace-pre-wrap text-gray-700">{campaign.description}</div>
                  </div>
                </div>
                
                {/* Información del beneficiario */}
                <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
                  <BrutalHeading className="text-xl mb-4">Sobre el beneficiario</BrutalHeading>
                  <div className="space-y-2">
                    <p><strong>Nombre:</strong> {campaign.recipient?.name}</p>
                    {campaign.recipient?.age && <p><strong>Edad:</strong> {campaign.recipient.age} años</p>}
                    <p><strong>Condición:</strong> {campaign.recipient?.condition}</p>
                    <p><strong>Ubicación:</strong> {campaign.location?.city}, {campaign.location?.province}</p>
                  </div>
                </div>
                
                {/* Información del creador */}
                <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
                  <BrutalHeading className="text-xl mb-4">Sobre el creador de la campaña</BrutalHeading>
                  <div className="space-y-2">
                    <p><strong>Relación con el beneficiario:</strong> {campaign.creator?.relation}</p>
                    <p><strong>Contacto:</strong> {campaign.creator?.contact}</p>
                  </div>
                </div>
              </div>
              
              {/* Columna derecha - Progreso y formulario de donación */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] sticky top-24">
                  <BrutalHeading className="text-xl mb-4">Progreso de la campaña</BrutalHeading>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl">{formatCurrency(campaign.currentAmount)}</span>
                      <span className="text-gray-500">Meta: {formatCurrency(campaign.goalAmount)}</span>
                    </div>
                    
                    <div className="h-6 w-full border-2 border-[#002C5B] bg-white">
                      <div
                        className="h-full bg-[#002C5B]"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-center font-bold">{progress}% recaudado</p>
                  </div>
                  
                  <DonationForm campaignId={campaign.id || ''} campaignTitle={campaign.title} />
                </div>
              </div>
            </div>
          </div>
        </BrutalSection>
      </main>
      <Footer />
    </div>
  );
}
