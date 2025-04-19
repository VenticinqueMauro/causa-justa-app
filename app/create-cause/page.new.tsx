'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalHeading from '@/components/ui/BrutalHeading';
import { ArrowLeft, Loader2, ArrowRight, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { Toast, useToast } from '@/components/ui/Toast';
import CampaignForm from '@/components/campaigns/CampaignForm';

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
  const { showToast: showGlobalToast } = useToast();

  // Función para verificar requisitos para crear una campaña
  const checkRequirements = async () => {
    console.log('Iniciando verificación de requisitos para crear campaña');
    console.log('Estado de autenticación:', { isAuthenticated, user, authLoading });
    
    // Si aún está cargando la autenticación, esperar
    if (authLoading) {
      console.log('Autenticación aún está cargando, esperando...');
      return;
    }
    
    // Si ya terminó de cargar y no está autenticado, entonces redirigir
    if (!isAuthenticated || !user) {
      console.log('Usuario no autenticado (después de cargar), redirigiendo a login');
      router.push('/login?redirect=create-cause');
      return;
    }

    // Verificar si el usuario es BENEFICIARY
    console.log('Rol del usuario:', user.role);
    if (user.role !== 'BENEFICIARY') {
      console.log('Usuario no es BENEFICIARY, verificando si es DONOR');
      
      if (user.role === 'DONOR') {
        console.log('Usuario es DONOR, mostrando modal para cambio de rol');
        setShowRoleChangeModal(true);
        setIsLoading(false);
        return;
      } else {
        // Para otros roles, mostrar error y redirigir
        console.log('Usuario tiene un rol que no es DONOR ni BENEFICIARY, mostrando error');
        setToastMessage('Solo los beneficiarios pueden crear campañas');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
        return;
      }
    }

    // Verificar conexión con MercadoPago
    console.log('Obteniendo token para verificar MercadoPago');
    const token = await getToken();
    if (!token) {
      console.log('No se pudo obtener token, redirigiendo a login');
      setToastMessage('Error de autenticación. Por favor, inicia sesión nuevamente.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    try {
      // Verificar si hay un estado guardado en localStorage
      const mpConnectedInStorage = localStorage.getItem('mp_connected');
      console.log('Estado de conexión MercadoPago en localStorage:', mpConnectedInStorage);
      
      if (mpConnectedInStorage === 'true') {
        console.log('MercadoPago conectado según localStorage, continuando');
        setIsLoading(false);
        return;
      }

      // Verificar con el servidor con un timeout para evitar que se quede colgado
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
      
      try {
        // Asegurarse de que la URL termine con /
        const baseUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
        const apiUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const fullUrl = `${apiUrl}mercadopago/status`;
        
        console.log('Verificando estado de MercadoPago con el servidor:', fullUrl);
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('Respuesta del servidor:', { status: response.status, ok: response.ok });
        
        if (response.ok) {
          try {
            const data = await response.json();
            console.log('Datos de MercadoPago:', data);
            
            // Verificar si está conectado
            const isConnected = data.connected || data.isConnected || false;
            console.log('¿Está conectado a MercadoPago?', isConnected);
            
            if (isConnected) {
              console.log('MercadoPago conectado, guardando en localStorage');
              localStorage.setItem('mp_connected', 'true');
              setIsLoading(false);
            } else {
              console.log('MercadoPago no conectado, mostrando error');
              localStorage.removeItem('mp_connected');
              setIsLoading(false);
              setShowMercadoPagoError(true);
            }
          } catch (parseError) {
            console.error('Error al parsear respuesta:', parseError);
            localStorage.removeItem('mp_connected');
            setIsLoading(false);
            setShowMercadoPagoError(true);
          }
        } else {
          console.error(`Error del servidor (${response.status}):`, response.statusText);
          localStorage.removeItem('mp_connected');
          setIsLoading(false);
          setShowMercadoPagoError(true);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('Error al verificar MercadoPago:', fetchError);
        
        // Si hay un error de red, permitimos continuar pero mostramos la opción de conectar
        setIsLoading(false);
        setShowMercadoPagoError(true);
      }
    } catch (error) {
      console.error('Error general en verificación de requisitos:', error);
      setIsLoading(false);
      setShowMercadoPagoError(true);
    }
  };

  // Ejecutar verificación de requisitos al cargar la página
  useEffect(() => {
    checkRequirements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, authLoading]);

  // Conectar MercadoPago
  const connectMercadoPago = async () => {
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
        body: JSON.stringify({ role: 'BENEFICIARY' })
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
          role: 'BENEFICIARY'
        };
        login(token, updatedUserData);
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
  if (showMercadoPagoError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-[#002C5B] hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>
        
        <div className="border-2 border-red-500 shadow-[5px_5px_0_0_rgba(239,68,68,0.8)] p-6 bg-white mb-8">
          <h2 className="text-xl font-bold text-[#002C5B] mb-4">Conexión con MercadoPago requerida</h2>
          
          <p className="text-[#002C5B] mb-6">
            Para crear una campaña, es necesario conectar tu cuenta de MercadoPago. Esto permitirá recibir donaciones
            cuando tu campaña sea aprobada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <BrutalButton 
              onClick={connectMercadoPago}
              variant="secondary"
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
