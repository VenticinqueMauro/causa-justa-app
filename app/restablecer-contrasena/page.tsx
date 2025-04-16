'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalSection from '@/components/ui/BrutalSection';
import BrutalButton from '@/components/ui/BrutalButton';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener el token de la URL
    const tokenParam = searchParams.get('token');
    
    if (!tokenParam) {
      console.error('No se encontró token en la URL');
    } else {
      console.log('Token encontrado en URL:', tokenParam.substring(0, 10) + '...');
    }
    
    setToken(tokenParam);
    setIsLoading(false);
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col container mx-auto px-4">
      <main className="flex-1 py-10">
        <BrutalSection variant="alt" className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <BrutalHeading className="text-3xl md:text-4xl">
                  Restablecer contraseña
                </BrutalHeading>
              </div>
              
              {isLoading ? (
                <div className="text-center p-4">
                  <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
                    <p className="text-[#002C5B]">Verificando token...</p>
                  </div>
                </div>
              ) : token ? (
                <>
                  <p className="text-center mb-8 text-[#002C5B]/80">
                    Ingresa tu nueva contraseña para restablecer tu cuenta.
                  </p>
                  <ResetPasswordForm token={token} />
                </>
              ) : (
                <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p className="font-bold">Token no válido o faltante</p>
                    <p className="mt-2">El enlace que has utilizado no es válido o ha expirado.</p>
                    <p className="mt-2">Por favor, solicita un nuevo enlace de restablecimiento de contraseña.</p>
                  </div>
                  <div className="text-center mt-6">
                    <BrutalButton href="/auth/forgot-password" variant="primary">
                      Solicitar nuevo enlace
                    </BrutalButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </BrutalSection>
      </main>
    </div>
  );
}
