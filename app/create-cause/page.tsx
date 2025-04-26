'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeading from '@/components/ui/BrutalHeading';
import { ArrowLeft, Loader2, ArrowRight, AlertCircle, X, Info } from 'lucide-react';
import Link from 'next/link';
import { Toast, useToast } from '@/components/ui/Toast';
import CampaignForm from '@/components/campaigns/CampaignForm';
import { UserRole } from '@/types';
import TermsContent from '@/components/terms/TermsContent';

export default function CreateCausePage() {
  const { user, isAuthenticated, isLoading: authLoading, getToken, login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [showMercadoPagoError, setShowMercadoPagoError] = useState(false);
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [mercadoPagoConnected, setMercadoPagoConnected] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { showToast: showGlobalToast } = useToast();

  // Función para verificar el estado de conexión con MercadoPago
  const checkMercadoPagoStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = await getToken();
      if (!token) {
        console.error('No se encontró token de autenticación');
        setIsLoading(false);
        setShowMercadoPagoError(true);
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      console.log('Verificando estado de MercadoPago con el servidor:', `${baseUrl}mercadopago/status`);
      console.log('Usando token:', token.substring(0, 10) + '...');
      
      const response = await fetch(`${baseUrl}mercadopago/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        console.error(`Error del servidor (${response.status}):`, response.statusText);
        setIsLoading(false);
        setShowMercadoPagoError(true);
        return;
      }
      
      const data = await response.json();
      console.log('Respuesta completa de MercadoPago:', JSON.stringify(data, null, 2));
      
      // Verificar si está conectado (comprobando todos los posibles formatos de respuesta)
      const isConnected = data.connected || data.isConnected || false;
      console.log('¿Está conectado a MercadoPago?', isConnected);
      
      // Actualizar el estado sin usar localStorage
      setMercadoPagoConnected(isConnected);
      setShowMercadoPagoError(!isConnected);
      
    } catch (err) {
      console.error('Error al verificar estado de MercadoPago:', err);
      setMercadoPagoConnected(false);
      setShowMercadoPagoError(true);
    } finally {
      setIsLoading(false);
    }
  };



  // Función para verificar requisitos para crear una campaña
  const checkRequirements = async () => {
    console.log('Iniciando verificación de requisitos para crear campaña');
    
    // Verificar cookies primero
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const userCookie = document.cookie.split('; ').find(row => row.startsWith('auth_user='));
    
    console.log('Verificación de autenticación:', { 
      cookieToken: tokenCookie ? 'Presente' : 'Ausente',
      cookieUser: userCookie ? 'Presente' : 'Ausente',
      isAuthenticated, 
      user, 
      authLoading 
    });
    
    // Si aún está cargando la autenticación, esperar
    if (authLoading) {
      console.log('Autenticación aún está cargando, esperando...');
      return;
    }
    
    // Verificar autenticación combinando cookies y estado del contexto
    if ((!tokenCookie && !isAuthenticated) || !user) {
      console.log('Usuario no autenticado (después de verificar cookies y contexto), redirigiendo a login');
      router.push('/login?redirect=create-cause');
      return;
    }

    // Usar el usuario del contexto o del storage
    const userFromStorage = localStorage.getItem('auth_user');
    const currentUser = user || (userFromStorage ? JSON.parse(userFromStorage) : null);
  
    // Verificar que el usuario tenga el rol de BENEFICIARY
    if (!currentUser || currentUser.role !== UserRole.BENEFICIARY) {
      console.log('Usuario no es BENEFICIARY, mostrando modal de cambio de rol');
      setShowRoleChangeModal(true);
      setIsLoading(false);
      return;
    } else {
      // Verificar conexión con MercadoPago
      console.log('Obteniendo token para verificar MercadoPago');
      const token = await getToken();
      if (!token) {
        console.log('No se pudo obtener token, redirigiendo a login');
        
        // Asegurarse de que las cookies estén limpias antes de redirigir
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        setToastMessage('Error de autenticación. Por favor, inicia sesión nuevamente.');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      try {
        // Verificar MercadoPago
        await checkMercadoPagoStatus();
      } catch (error) {
        console.error('Error general en verificación de requisitos:', error);
        setIsLoading(false);
        setShowMercadoPagoError(true);
      }
    }
  };

  // Ejecutar verificación de requisitos al cargar la página
  useEffect(() => {
    checkRequirements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, authLoading]);

  // Conectar MercadoPago
  const connectMercadoPago = async () => {
    // Verificar que se hayan aceptado los términos y condiciones
    if (!termsAccepted) {
      setToastMessage('Debes aceptar los términos y condiciones antes de continuar');
      setToastType('error');
      setShowToast(true);
      // Hacer scroll al checkbox de términos y condiciones
      document.getElementById('terms')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    try {
      const token = await getToken();
      if (!token) {
        setToastMessage('Error de autenticación. Por favor, inicia sesión nuevamente.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
      const apiUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      
      const response = await fetch(`${apiUrl}mercadopago/connect`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        try {
          const data = await response.json();
          console.log('Respuesta de conexión MercadoPago:', data);
          
          // Redirigir a la URL proporcionada por el servidor
          if (data.redirect_url) {
            window.location.href = data.redirect_url;
            return;
          } else if (data.url) {
            window.location.href = data.url;
            return;
          }
        } catch (parseError) {
          console.error('Error al parsear respuesta:', parseError);
          setToastMessage('Error al procesar la respuesta del servidor. Intenta nuevamente.');
          setToastType('error');
          setShowToast(true);
        }
      } else {
        console.error(`Error del servidor (${response.status}):`, response.statusText);
        setToastMessage(`Error del servidor (${response.status}): ${response.statusText}`);
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error al conectar con Mercado Pago:', error);
      setToastMessage('Error de conexión con Mercado Pago. Intenta nuevamente.');
      setToastType('error');
      setShowToast(true);
    }
  };

  // Función para manejar el cambio de rol de DONOR a BENEFICIARY
  const handleRoleChange = async () => {
    setIsChangingRole(true);
    try {
      // Obtener el token de acceso
      const token = await getToken();
      
      if (!token) {
        showGlobalToast('Error: No se encontró el token de autenticación', 'error');
        setIsChangingRole(false);
        return;
      }

      // Enviar solicitud para actualizar el rol del usuario
      const baseUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
      const apiUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      
      const response = await fetch(`${apiUrl}auth/update-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: UserRole.BENEFICIARY })
      });

      const data = await response.json();

      if (!response.ok) {
        showGlobalToast(data.message || 'Error al actualizar el rol', 'error');
        setIsChangingRole(false);
        return;
      }

      // Éxito: mostrar mensaje
      showGlobalToast('¡Rol actualizado correctamente! Ahora eres un Beneficiario', 'success');
      
      // Actualizar el contexto de autenticación con el usuario actualizado
      if (user) {
        const updatedUserData = {
          ...user,
          role: UserRole.BENEFICIARY
        };
        // Obtener el refreshToken del localStorage o usar uno vacío si no existe
        const refreshToken = localStorage.getItem('refresh_token') || '';
        login(token, refreshToken, updatedUserData);
      }
      
      // Cerrar el modal
      setShowRoleChangeModal(false);
      setIsChangingRole(false);
      
      // Reiniciar la verificación de requisitos
      setIsLoading(true);
      checkRequirements();
      
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      showGlobalToast('Error de conexión. Por favor, intenta nuevamente.', 'error');
      setIsChangingRole(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-[#002C5B]" />
        <p className="mt-4 text-[#002C5B] font-medium">Verificando requisitos...</p>
      </div>
    );
  }
  
  // Mostrar mensaje de error de MercadoPago
  console.log('Renderizando componente, mercadoPagoConnected:', mercadoPagoConnected, 'isLoading:', isLoading);
  if (!mercadoPagoConnected && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-[#002C5B] hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>
        
        <div className={`border-2 ${termsAccepted ? 'border-green-500 shadow-[5px_5px_0_0_rgba(34,197,94,0.8)]' : 'border-red-500 shadow-[5px_5px_0_0_rgba(239,68,68,0.8)]'} p-6 bg-white mb-8 transition-all duration-300`}>
          <h2 className="text-xl font-bold text-[#002C5B] mb-4">
            {termsAccepted ? 'Listo para conectar MercadoPago' : 'Conexión con MercadoPago requerida'}
          </h2>
          
          <p className="text-[#002C5B] mb-6">
            Para crear una campaña, es necesario conectar tu cuenta de MercadoPago. Esto permitirá <b>recibir donaciones</b> cuando tu campaña sea aprobada.
          </p>

          {/* Términos y condiciones */}
          <div className={`mb-6 border-2 p-4 ${termsAccepted ? 'border-green-500 bg-green-100' : 'border-[#002C5B] bg-[#EDFCA7]/30'} transition-all duration-300`}>
            <h3 className="font-bold text-[#002C5B] mb-2">Términos y Condiciones</h3>
            
            {/* Contenido de los términos y condiciones con scroll */}
            <div className="mb-4 max-h-60 overflow-y-auto border border-gray-300 p-3 bg-white">
              <TermsContent />
            </div>
            
            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 border-2 border-[#002C5B] rounded focus:ring-2 focus:ring-[#002C5B]"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="font-medium text-[#002C5B]">
                  Acepto los términos y condiciones
                </label>
                <p className="text-gray-600 text-sm mt-1">
                  Es necesario aceptar los términos y condiciones antes de conectar tu cuenta de MercadoPago.
                </p>
                {(showToast && toastMessage.includes('términos')) && (
                  <p className="text-red-500 font-semibold mt-1">Debes aceptar los términos y condiciones</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <BrutalButton 
              onClick={connectMercadoPago}
              variant="primary"
              className="flex items-center justify-center"
            >
              Conectar MercadoPago
            </BrutalButton>
            
            <BrutalButton 
              onClick={() => router.push('/')}
              variant="outline"
              className="flex items-center justify-center"
            >
              Volver al inicio
            </BrutalButton>
          </div>
        </div>
        
        <p className="text-[#002C5B] text-sm">
          Si ya has conectado tu cuenta de MercadoPago y sigues viendo este mensaje, intenta cerrar sesión y volver a iniciarla.
        </p>
      </div>
    );
  }

  console.log('Renderizando formulario de creación de campaña');
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-[#002C5B] hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al inicio
      </Link>
      
      <BrutalHeading as="h1" className="mb-6">
        Crear una campaña
      </BrutalHeading>
      
      <p className="text-[#002C5B] mb-8">
        Completa el siguiente formulario para crear tu campaña. Todos los campos marcados con * son obligatorios.
        Una vez creada, tu campaña será revisada por nuestro equipo antes de ser publicada.
      </p>
      
      <CampaignForm />
      
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Modal para cambio de rol */}
      {showRoleChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md bg-white border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] p-6">
            <button 
              onClick={() => setShowRoleChangeModal(false)} 
              className="absolute right-2 top-2 text-[#002C5B] hover:text-[#002C5B]/80"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4 flex items-center">
              <AlertCircle className="h-6 w-6 text-[#002C5B] mr-2" />
              <h3 className="text-lg font-bold text-[#002C5B]">Cambio de rol requerido</h3>
            </div>
            
            <p className="mb-6 text-[#002C5B]">
              Para crear una campaña, necesitas tener el rol de Beneficiario. Actualmente tienes el rol de Donante.
              ¿Deseas cambiar tu rol a Beneficiario para poder crear campañas?
            </p>
            
            <div className="flex justify-end gap-3">
              <BrutalButton
                variant="secondary"
                onClick={handleRoleChange}
                disabled={isChangingRole}
                className="flex items-center"
              >
                {isChangingRole ? 'Cambiando...' : (
                  <>
                    Cambiar a Beneficiario
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </BrutalButton>
              <BrutalButton
                variant="outline"
                onClick={() => {
                  setShowRoleChangeModal(false);
                  router.push('/');
                }}
              >
                Cancelar
              </BrutalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
