'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrutalSection from '@/components/ui/BrutalSection';
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalButton from '@/components/ui/BrutalButton';

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Ha ocurrido un error al procesar tu pago.';
  
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <BrutalHeading className="text-3xl md:text-4xl mb-2">Error en el pago</BrutalHeading>
                <p className="text-lg text-gray-600">{errorMessage}</p>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  No te preocupes, no se ha realizado ningún cargo a tu cuenta. 
                  Puedes intentar nuevamente o contactarnos si necesitas ayuda.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Link href="/" passHref>
                    <BrutalButton variant="secondary">
                      Volver al inicio
                    </BrutalButton>
                  </Link>
                  <Link href="/contact" passHref>
                    <BrutalButton>
                      Contactar soporte
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
