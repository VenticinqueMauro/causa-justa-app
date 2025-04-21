'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DonationErrorRedirect() {
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
    <div className="flex min-h-screen items-center justify-center bg-[#ECECE2]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redireccionando...</h1>
        <p>Por favor espera mientras te redirigimos a la página de información.</p>
      </div>
    </div>
  );
}
