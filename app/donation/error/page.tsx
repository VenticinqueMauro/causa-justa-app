'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Componente que utiliza useSearchParams envuelto en Suspense
function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Obtener el mensaje de error si existe
    const errorMessage = searchParams.get('message');
    
    // Redirigir a la página de error real, pasando el mensaje si existe
    if (errorMessage) {
      router.replace(`/campaigns/payment-error?message=${encodeURIComponent(errorMessage)}`);
    } else {
      router.replace('/campaigns/payment-error');
    }
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Redireccionando...</h1>
      <p>Por favor espera mientras te redirigimos a la página de información.</p>
    </div>
  );
}

// Componente principal que envuelve el contenido en Suspense
export default function DonationErrorRedirect() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ECECE2]">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 mx-auto w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded mb-4 mx-auto w-1/2"></div>
          </div>
        </div>
      }>
        <RedirectContent />
      </Suspense>
    </div>
  );
}
