'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DonationSuccessRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de agradecimiento real
    router.replace('/campaigns/thank-you');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ECECE2]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redireccionando...</h1>
        <p>Por favor espera mientras te redirigimos a la página de agradecimiento.</p>
      </div>
    </div>
  );
}
