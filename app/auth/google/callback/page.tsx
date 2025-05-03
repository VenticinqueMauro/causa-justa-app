'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  // Eliminamos la dependencia de useToast para evitar posibles bucles
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processed, setProcessed] = useState(false); // Flag para evitar procesamiento múltiple

  useEffect(() => {
    // Evitar procesamiento múltiple
    if (processed) return;

    async function processCallback() {
      try {
        // Marcar como procesado para evitar múltiples ejecuciones
        setProcessed(true);
        
        // Extraer token y needsRoleSelection de los parámetros de URL
        const token = searchParams.get('token');
        const needsRoleSelection = searchParams.get('needsRoleSelection') === 'true';
        
        if (!token) {
          setError('No se recibió el token de autenticación');
          setIsProcessing(false);
          return;
        }

        console.log('Procesando token de autenticación');

        // Obtener información del usuario desde el token
        try {
          // Decodificar el payload del JWT (segunda parte del token)
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Depuración detallada del payload
          console.log('===== DEPURACIÓN INFORMACIÓN DE USUARIO =====');
          console.log('Payload completo:', payload);
          console.log('Propiedades del payload:');
          for (const key in payload) {
            console.log(`${key}: ${JSON.stringify(payload[key])}`);
          }
          console.log('Tipo de payload.name:', typeof payload.name);
          console.log('Valor de payload.name:', payload.name);
          console.log('Tipo de payload.email:', typeof payload.email);
          console.log('Valor de payload.email:', payload.email);
          console.log('===========================================');
          
          // Crear objeto de usuario a partir del payload del token
          const userData = {
            id: payload.sub,
            email: payload.email,
            // Usar el email como nombre por defecto si no hay nombre
            fullName: payload.name || payload.email.split('@')[0] || '',
            role: payload.role || 'DONOR',
            verified: payload.verified || false,
            profilePicture: payload.profilePicture || null,
            authMethod: 'google' as 'google' // Establecer explícitamente el método de autenticación como Google
          };

          console.log('Datos de usuario extraídos del token:', userData);
          
          // Extraer refresh token si está presente en los parámetros
          const refreshToken = searchParams.get('refresh_token') || token; // Usar el token como refresh token si no se proporciona uno específico
          
          // Actualizar el contexto de autenticación con el token y refresh token
          login(token, refreshToken, userData);
          
          // Guardar información temporal si se necesita selección de rol
          if (needsRoleSelection) {
            console.log('Redirigiendo a selección de rol');
            sessionStorage.setItem('googleUserData', JSON.stringify(userData));
            
            // Usar window.location.href para evitar problemas con el router de Next.js
            window.location.href = '/auth/google/role-selection';
          } else {
            console.log('Redirigiendo a página principal');
            // Usar window.location.href para evitar problemas con el router de Next.js
            window.location.href = '/';
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
  }, [searchParams, login, router, processed]); // Eliminamos showToast y agregamos processed

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-[#002C5B] p-3 md:p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
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
        <div className="bg-white border-2 border-[#002C5B] p-3 md:p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
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

// Componente principal que envuelve el contenido en Suspense
export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-[#002C5B] p-3 md:p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
            <h1 className="text-2xl font-bold text-[#002C5B] mb-4 text-center">Cargando...</h1>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002C5B]"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
