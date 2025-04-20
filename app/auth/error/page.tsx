'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BrutalButton from '@/components/ui/BrutalButton';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('Ha ocurrido un error durante la autenticación');

  useEffect(() => {
    // Obtener el mensaje de error de los parámetros de URL
    const message = searchParams.get('message');
    if (message) {
      try {
        // Intentar decodificar el mensaje en caso de que esté codificado
        const decodedMessage = decodeURIComponent(message);
        setErrorMessage(decodedMessage);
      } catch (error) {
        console.error('Error al decodificar el mensaje:', error);
        setErrorMessage(message);
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-[#002C5B] mb-4 text-center">
            Error de autenticación
          </h1>
          
          <p className="text-center text-gray-700 mb-6">
            {errorMessage}
          </p>
          
          <div className="flex flex-col space-y-4">
            <BrutalButton
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Volver al inicio de sesión
            </BrutalButton>
            
            <BrutalButton
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Ir a la página principal
            </BrutalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
