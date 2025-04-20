'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processCallback() {
      try {
        // Extraer token y needsRoleSelection de los parámetros de URL
        const token = searchParams.get('token');
        const needsRoleSelection = searchParams.get('needsRoleSelection') === 'true';
        
        if (!token) {
          setError('No se recibió el token de autenticación');
          setIsProcessing(false);
          return;
        }

        // Obtener información del usuario desde el token
        try {
          // Decodificar el payload del JWT (segunda parte del token)
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Crear objeto de usuario a partir del payload del token
          const userData = {
            id: payload.sub,
            email: payload.email,
            fullName: payload.name || '',
            role: payload.role || 'DONOR',
            verified: payload.verified || false,
            profilePicture: payload.profilePicture || null
          };

          // Actualizar el contexto de autenticación
          login(token, userData);
          
          // Guardar información temporal si se necesita selección de rol
          if (needsRoleSelection) {
            sessionStorage.setItem('googleUserData', JSON.stringify(userData));
            router.push('/auth/google/role-selection');
          } else {
            // Redirigir a la página principal o dashboard
            router.push('/');
          }
        } catch (decodeError) {
          console.error('Error al decodificar el token:', decodeError);
          setError('Error al procesar la información de usuario');
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Error en el procesamiento del callback:', error);
        setError('Error inesperado durante la autenticación');
        setIsProcessing(false);
      }
    }

    processCallback();
  }, [searchParams, login, router, showToast]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
            <h1 className="text-2xl font-bold text-[#002C5B] mb-4 text-center">
              Error de autenticación
            </h1>
            <p className="text-center text-red-600 mb-6">{error}</p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-[#002C5B] text-white rounded hover:bg-[#001E3E] transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
          <h1 className="text-2xl font-bold text-[#002C5B] mb-4 text-center">
            Procesando autenticación
          </h1>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002C5B]"></div>
          </div>
          <p className="text-center text-[#002C5B]/70">
            Por favor espera mientras completamos tu inicio de sesión...
          </p>
        </div>
      </div>
    </div>
  );
}
