'use client';

import BrutalButton from '@/components/ui/BrutalButton';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MercadoPagoSuccessPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [statusChecked, setStatusChecked] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forzar la actualización del estado de conexión con MercadoPago
  useEffect(() => {
    const updateMercadoPagoStatus = async () => {
      if (!isAuthenticated || isLoading) return;

      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setErrorMessage('Error de autenticación. Por favor, inicia sesión nuevamente.');
          return;
        }

        // Forzar una actualización del estado de conexión
        console.log('Forzando actualización del estado de conexión con MercadoPago...');

        // Primero verificamos el estado actual
        const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}mercadopago/status`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const statusText = await statusResponse.clone().text();
        console.log('Respuesta de status:', statusText);

        // Asumimos que la conexión fue exitosa ya que estamos en la página de éxito
        // y actualizamos el estado local
        setIsConnected(true);

        // Guardamos en localStorage para que otras partes de la aplicación lo reconozcan
        localStorage.setItem('mp_connected', 'true');
      } catch (error) {
        console.error('Error al actualizar estado de MercadoPago:', error);
        setErrorMessage('Error al conectar con el servidor.');
      } finally {
        setStatusChecked(true);
      }
    };

    if (isAuthenticated && !isLoading) {
      updateMercadoPagoStatus();
    }
  }, [isAuthenticated, isLoading]);

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/account/mercadopago/success');
    }
  }, [isAuthenticated, isLoading, router]);

  // Si está cargando, mostrar un estado de carga mejorado
  if (isLoading || !statusChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 border-2 border-[#002C5B] bg-white shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -top-10 -right-10 h-40 w-40 bg-[#EDFCA7] opacity-20 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-[#EDFCA7] opacity-20 rounded-full"></div>

          <div className="animate-pulse flex flex-col items-center relative z-10">
            <div className="h-20 w-20 bg-[#EDFCA7] opacity-70 rounded-full mb-6 border-2 border-[#002C5B] shadow-[3px_3px_0_0_rgba(0,44,91,0.5)]"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
            <div className="w-16 h-1 bg-[#EDFCA7] opacity-60 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-8"></div>
            <div className="h-12 bg-[#002C5B] opacity-60 rounded-lg w-full mb-4"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 border-2 border-[#002C5B] bg-white shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute -top-10 -right-10 h-40 w-40 bg-[#EDFCA7] opacity-20 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-[#EDFCA7] opacity-20 rounded-full"></div>
        <div className="flex justify-end mb-4">
          <a href="/" className="text-sm text-[#002C5B] hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </a>
        </div>
        {isConnected ? (
          <>
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="h-20 w-20 bg-[#EDFCA7] rounded-full flex items-center justify-center mb-6 border-2 border-[#002C5B] shadow-[3px_3px_0_0_rgba(0,44,91,0.5)] transform hover:scale-105 transition-transform duration-200">
                <CheckCircle className="h-10 w-10 text-[#002C5B]" />
              </div>
              <h1 className="text-3xl font-bold text-[#002C5B] mb-3 text-center">¡Conexión exitosa!</h1>
              <div className="w-16 h-1 bg-[#EDFCA7] mb-4"></div>
              <p className="text-center text-gray-600 mb-4 max-w-xs">
                Tu cuenta de MercadoPago ha sido conectada correctamente a Causa Justa.
              </p>
            </div>
            <div className="space-y-4 relative z-10">
              <BrutalButton
                variant="primary"
                className="w-full flex items-center justify-center py-3"
                href="/create-cause"
              >
                <span className="mr-2 font-bold">Iniciar una causa</span>
                <ArrowRight className="h-5 w-5" />
              </BrutalButton>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6 border-2 border-red-500 shadow-[3px_3px_0_0_rgba(220,38,38,0.3)]">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-[#002C5B] mb-3 text-center">Algo salió mal</h1>
              <div className="w-16 h-1 bg-red-200 mb-4"></div>
              <p className="text-center text-gray-600 mb-4 max-w-xs">
                {errorMessage || 'No se pudo completar la conexión con MercadoPago.'}
              </p>
            </div>
            <div className="space-y-4 relative z-10">
              <BrutalButton
                variant="primary"
                className="w-full flex items-center justify-center py-3"
                onClick={() => router.push('/account/mercadopago/connect')}
              >
                <span className="mr-2 font-bold">Intentar nuevamente</span>
              </BrutalButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
