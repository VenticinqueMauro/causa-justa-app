'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrutalSection from '@/components/ui/BrutalSection';
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalButton from '@/components/ui/BrutalButton';

interface DonationInfo {
  campaignId: string;
  campaignTitle: string;
  amount: number;
  timestamp: string;
}

export default function ThankYouPage() {
  const router = useRouter();
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Recuperar información de la donación del localStorage
    const storedDonation = localStorage.getItem('lastDonation');
    
    if (storedDonation) {
      try {
        const parsedDonation = JSON.parse(storedDonation);
        setDonationInfo(parsedDonation);
      } catch (error) {
        console.error('Error al analizar la información de la donación:', error);
      }
    }
    
    setIsLoading(false);
    
    // Limpiar la información después de mostrarla
    return () => {
      localStorage.removeItem('lastDonation');
    };
  }, []);

  // Formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#ECECE2]">
      <Header />
      <main className="flex-1">
        <BrutalSection className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white border-2 border-[#002C5B] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,44,91,0.8)]">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-lg">Cargando...</p>
                </div>
              ) : donationInfo ? (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <BrutalHeading className="text-3xl md:text-4xl mb-2">¡Gracias por tu donación!</BrutalHeading>
                    <p className="text-lg text-gray-600">Tu apoyo hace una gran diferencia.</p>
                  </div>
                  
                  <div className="border-2 border-[#002C5B] p-3 md:p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">Detalles de la donación</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Campaña:</span>
                        <span className="font-medium">{donationInfo.campaignTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monto:</span>
                        <span className="font-bold">{formatCurrency(donationInfo.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium">{formatDate(donationInfo.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">
                      Recibirás un correo electrónico con los detalles de tu donación. 
                      Si tienes alguna pregunta, no dudes en contactarnos.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <Link href={`/campaigns/${donationInfo.campaignId}`} passHref>
                        <BrutalButton variant="secondary">
                          Volver a la campaña
                        </BrutalButton>
                      </Link>
                      <Link href="/" passHref>
                        <BrutalButton>
                          Ir al inicio
                        </BrutalButton>
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BrutalHeading className="text-2xl mb-4">No se encontró información de donación</BrutalHeading>
                  <p className="text-gray-600 mb-8">
                    No pudimos encontrar detalles sobre tu donación reciente. 
                    Esto puede suceder si has limpiado tu caché o has llegado a esta página directamente.
                  </p>
                  <Link href="/" passHref>
                    <BrutalButton>
                      Ir al inicio
                    </BrutalButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </BrutalSection>
      </main>
      <Footer />
    </div>
  );
}
