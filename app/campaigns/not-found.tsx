import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrutalSection from '@/components/ui/BrutalSection';
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalButton from '@/components/ui/BrutalButton';

export default function CampaignNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#ECECE2]">
      <Header />
      <main className="flex-1">
        <BrutalSection className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white border-2 border-[#002C5B] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,44,91,0.8)]">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <BrutalHeading className="text-3xl md:text-4xl mb-4">Campaña no encontrada</BrutalHeading>
                <p className="text-lg text-gray-600 mb-6">
                  Lo sentimos, la campaña que estás buscando no existe o ha sido eliminada.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/" passHref>
                    <BrutalButton variant="secondary">
                      Volver al inicio
                    </BrutalButton>
                  </Link>
                  <Link href="/campaigns" passHref>
                    <BrutalButton>
                      Ver todas las campañas
                    </BrutalButton>
                  </Link>
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
