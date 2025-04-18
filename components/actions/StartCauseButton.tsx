'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, PlusCircle, X } from 'lucide-react';
import BrutalButton from '@/components/ui/BrutalButton';

type StartCauseButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xs';
  className?: string;
  showIcon?: boolean;
  text?: string;
  iconPosition?: 'left' | 'right';
};

export default function StartCauseButton({
  variant = 'secondary',
  size = 'md',
  className = '',
  showIcon = true,
  text = 'Iniciar una causa',
  iconPosition = 'left'
}: StartCauseButtonProps) {
  const { user, isAuthenticated, getToken } = useAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMpConnectButton, setShowMpConnectButton] = useState(false);
  const router = useRouter();

  // Verificar conexión con MercadoPago
  const checkMercadoPagoConnection = async (token: string) => {
    try {
      // Primero verificamos si hay un estado guardado en localStorage
      const mpConnectedInStorage = localStorage.getItem('mp_connected');
      if (mpConnectedInStorage === 'true') {
        console.log('Conexión con MercadoPago encontrada en localStorage');
        return true;
      }
      
      console.log('Verificando conexión con MercadoPago en el servidor...');
      // Asegurarse de que la URL termine con /
      const baseUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
      const apiUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      
      const response = await fetch(`${apiUrl}mercadopago/status`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clonar respuesta para mostrar el texto completo
      const responseText = await response.clone().text();
      console.log('Respuesta de MercadoPago/status:', responseText);

      if (response.ok) {
        try {
          // Intentar parsear la respuesta
          const data = responseText ? JSON.parse(responseText) : {};
          console.log('Datos parseados de MercadoPago/status:', data);
          
          // Verificar si está conectado - la API devuelve 'connected' en lugar de 'isConnected'
          const isConnected = data.connected || data.isConnected || false;
          console.log('¿Está conectado a MercadoPago según el servidor?', isConnected);
          
          // Si está conectado, guardar en localStorage para futuras verificaciones
          if (isConnected) {
            localStorage.setItem('mp_connected', 'true');
          } else {
            // Si no está conectado, asegurarse de que no haya un valor incorrecto en localStorage
            localStorage.removeItem('mp_connected');
          }
          
          return isConnected;
        } catch (parseError) {
          console.error('Error al parsear respuesta de MercadoPago/status:', parseError);
          localStorage.removeItem('mp_connected');
          return false;
        }
      } else {
        console.error(`Error en MercadoPago/status (${response.status}):`, response.statusText);
        localStorage.removeItem('mp_connected');
        return false;
      }
    } catch (error) {
      console.error('Error al verificar conexión de Mercado Pago:', error);
      localStorage.removeItem('mp_connected');
      return false;
    }
  };
  
  // Conectar MercadoPago
  const connectMercadoPago = async () => {
    const token = await getToken();
    if (!token) {
      setErrorMessage('Error de autenticación. Por favor, inicia sesión nuevamente.');
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}mercadopago/connect`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Para debug
      console.log('Respuesta del servidor:', await response.clone().text());
      
      if (response.ok) {
        // Intentamos parsear la respuesta como JSON
        try {
          const text = await response.text();
          const data = text ? JSON.parse(text) : {};
          
          // Verificamos si la respuesta contiene la URL de redirección en cualquier formato
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
            return;
          } else if (data.redirect_url) {
            window.location.href = data.redirect_url;
            return;
          } else if (data.url) {
            window.location.href = data.url;
            return;
          } else if (typeof data === 'string' && data.includes('http')) {
            // En caso de que la respuesta sea directamente la URL
            window.location.href = data;
            return;
          }
          
          // Si llegamos aquí, no encontramos una URL válida en la respuesta
          console.error('Respuesta sin URL válida:', data);
          setErrorMessage('La respuesta del servidor no contiene una URL de redirección válida.');
        } catch (parseError) {
          console.error('Error al parsear la respuesta JSON:', parseError);
          setErrorMessage('Error al procesar la respuesta del servidor. Intenta nuevamente.');
        }
      } else {
        console.error(`Error del servidor (${response.status}):`, response.statusText);
        setErrorMessage(`Error del servidor (${response.status}): ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al conectar con Mercado Pago:', error);
      setErrorMessage('Error de conexión con Mercado Pago. Intenta nuevamente.');
    }
    
    setShowErrorModal(true);
  };
  
  // Manejar clic en "Iniciar una causa"
  const handleStartCause = async () => {
    console.log('=== INICIO PROCESO INICIAR CAUSA ===');
    console.log('Datos del usuario:', { isAuthenticated, user });
    
    // Paso 1: Verificar si está logeado
    if (!isAuthenticated || !user) {
      console.log('Usuario no autenticado, redirigiendo a login');
      router.push('/login?redirect=create-cause');
      return;
    }
    
    // Paso 2: Verificar si es BENEFICIARY
    console.log('Rol del usuario:', user.role);
    if (user.role !== 'BENEFICIARY') {
      console.log(`Usuario con rol incorrecto: ${user.role}, mostrando error`);
      setErrorMessage(`Solo los beneficiarios pueden iniciar una causa. Tu rol actual es: ${user.role}`);
      setShowMpConnectButton(false);
      setShowErrorModal(true);
      return;
    }
    
    // Paso 3: Verificar conexión con MercadoPago
    console.log('Obteniendo token para verificar MercadoPago');
    const token = await getToken();
    if (!token) {
      console.log('No se pudo obtener el token, mostrando error');
      setErrorMessage('Error de autenticación. Por favor, inicia sesión nuevamente.');
      setShowMpConnectButton(false);
      setShowErrorModal(true);
      return;
    }
    
    console.log('Verificando conexión de MercadoPago para usuario:', user.email);
    // Limpiar localStorage para forzar verificación con el servidor
    console.log('Limpiando localStorage para forzar verificación con el servidor');
    localStorage.removeItem('mp_connected');
    
    console.log('Llamando a checkMercadoPagoConnection');
    const isConnected = await checkMercadoPagoConnection(token);
    console.log('Resultado de verificación de MercadoPago:', isConnected);
    
    if (!isConnected) {
      console.log('Usuario no conectado a MercadoPago, mostrando modal');
      setErrorMessage('Debes conectar tu cuenta de Mercado Pago para crear una causa.');
      setShowMpConnectButton(true);
      setShowErrorModal(true);
      return;
    }
    
    // Todo en orden, redirigir al formulario de creación
    console.log('Usuario verificado y conectado a MercadoPago, redirigiendo a /create-cause');
    
    try {
      // Guardar en localStorage antes de redirigir
      localStorage.setItem('mp_connected', 'true');
      console.log('Estado de MercadoPago guardado en localStorage antes de redirigir');
      
      // Redirigir a la página de creación de causa
      router.push('/create-cause');
    } catch (error) {
      console.error('Error al redirigir a /create-cause:', error);
    }
  };

  // Renderizar el botón con el ícono en la posición correcta
  const renderButtonContent = () => {
    if (!showIcon) return text;
    
    // Si no hay texto, solo mostrar el ícono
    if (!text) {
      return <PlusCircle className="h-4 w-4" />;
    }
    
    return iconPosition === 'left' ? (
      <>
        <PlusCircle className="h-4 w-4 mr-2" />
        <span>{text}</span>
      </>
    ) : (
      <>
        <span>{text}</span>
        <PlusCircle className="h-4 w-4 ml-2" />
      </>
    );
  };

  return (
    <>
      <BrutalButton
        variant={variant}
        size={size}
        className={`flex items-center cursor ${className}`}
        onClick={handleStartCause}
      >
        {renderButtonContent()}
      </BrutalButton>

      {/* Modal de error */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md bg-white border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] p-6">
            <button 
              onClick={() => setShowErrorModal(false)} 
              className="absolute right-2 top-2 text-[#002C5B] hover:text-[#002C5B]/80"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4 flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-bold text-[#002C5B]">Atención</h3>
            </div>
            
            <p className="mb-6 text-[#002C5B]">{errorMessage}</p>
            
            <div className="flex justify-end gap-3">
              {showMpConnectButton && (
                <BrutalButton
                  variant="secondary"
                  onClick={() => {
                    connectMercadoPago();
                    setShowErrorModal(false);
                  }}
                >
                  Conectar MercadoPago
                </BrutalButton>
              )}
              <BrutalButton
                variant="outline"
                onClick={() => setShowErrorModal(false)}
              >
                Entendido
              </BrutalButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
