'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, PlusCircle, X, ArrowRight } from 'lucide-react';
import BrutalButton from '@/components/ui/BrutalButton';
import { useToast } from '@/components/ui/Toast';
import { UserRole } from '@/types/enums';

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
  const { user, isAuthenticated, getToken, login } = useAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMpConnectButton, setShowMpConnectButton] = useState(false);
  const [showRoleChangeButton, setShowRoleChangeButton] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // Verificar conexión con MercadoPago - siempre consultar al backend
  const checkMercadoPagoConnection = async (token: string) => {
    try {      
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
          
          return isConnected;
        } catch (parseError) {
          console.error('Error al parsear respuesta de MercadoPago/status:', parseError);
          return false;
        }
      } else {
        console.error(`Error en MercadoPago/status (${response.status}):`, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar conexión de Mercado Pago:', error);
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
    
    // Verificar autenticación basada en cookies primero
    const allCookies = document.cookie;
    console.log('Todas las cookies:', allCookies);
    
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const userCookie = document.cookie.split('; ').find(row => row.startsWith('auth_user='));
    const refreshTokenCookie = document.cookie.split('; ').find(row => row.startsWith('refresh_token='));
    
    console.log('Cookies detalladas:', {
      tokenCookie: tokenCookie ? tokenCookie : 'No presente',
      userCookie: userCookie ? 'Presente' : 'No presente',
      refreshTokenCookie: refreshTokenCookie ? 'Presente' : 'No presente',
      isAuthenticated,
      userRole: user?.role,
      userId: user?.id
    });
    
    // Verificar localStorage
    const localStorageToken = localStorage.getItem('auth_token');
    const localStorageUser = localStorage.getItem('auth_user');
    const localStorageRefreshToken = localStorage.getItem('refresh_token');
    
    console.log('LocalStorage:', {
      token: localStorageToken ? 'Presente' : 'No presente',
      user: localStorageUser ? 'Presente' : 'No presente',
      refreshToken: localStorageRefreshToken ? 'Presente' : 'No presente'
    });
    
    // Intentar refrescar el token primero para asegurar que tenemos la sesión actualizada
    const currentToken = await getToken();
    console.log('Token obtenido de getToken():', currentToken ? 'Sí' : 'No');
    
    // Paso 1: Verificar si está logeado (usando cookies o estado del contexto)
    // Intentar obtener datos de usuario directamente si están disponibles en localStorage o cookies
    let userFromStorage = null;
    try {
      if (localStorageUser) {
        userFromStorage = JSON.parse(localStorageUser);
      } else if (userCookie) {
        const userString = decodeURIComponent(userCookie.split('=')[1]);
        userFromStorage = JSON.parse(userString);
      }
    } catch (e) {
      console.error('Error al parsear datos de usuario:', e);
    }
    
    // Verificación más robusta de autenticación
    const isUserAuthenticated = isAuthenticated || !!currentToken || !!tokenCookie || !!localStorageToken;
    const hasUserData = !!user || !!userFromStorage;
    
    console.log('Estado de autenticación final:', {
      isUserAuthenticated,
      hasUserData,
      userFromContext: !!user,
      userFromStorage: !!userFromStorage
    });
    
    if (!isUserAuthenticated || !hasUserData) {
      console.log('Usuario no autenticado, redirigiendo a login');
      // Guardar la URL actual para redireccionar de vuelta después del login
      localStorage.setItem('redirectAfterLogin', '/create-cause');
      router.push('/login');
      return;
    }
    
    // Si tenemos datos de usuario en storage pero no en el contexto, actualizar el contexto
    if (!user && userFromStorage) {
      console.log('Actualizando contexto con datos de usuario del storage');
      const refreshToken = localStorageRefreshToken || (refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null);
      const token = localStorageToken || (tokenCookie ? tokenCookie.split('=')[1] : null);
      if (token) {
        login(token, refreshToken || token, userFromStorage);
        // Esperar un momento para que se actualice el contexto
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Paso 2: Verificar si es BENEFICIARY
    // Usar datos de usuario del contexto o del storage
    const currentUser = user || userFromStorage;
    
    if (!currentUser) {
      console.log('No se encontraron datos de usuario válidos');
      setErrorMessage('Error de autenticación. Por favor, inicia sesión nuevamente.');
      setShowMpConnectButton(false);
      setShowRoleChangeButton(false);
      setShowErrorModal(true);
      return;
    }
    
    console.log('Rol del usuario:', currentUser.role);
    if (currentUser.role !== UserRole.BENEFICIARY) {
      console.log(`Usuario con rol incorrecto: ${currentUser.role}, mostrando error`);
      if (currentUser.role === UserRole.DONOR) {
        setErrorMessage(`Solo los beneficiarios pueden iniciar una causa. Tu rol actual es: ${currentUser.role}. ¿Deseas cambiar tu rol a ${UserRole.BENEFICIARY}?`);
        setShowRoleChangeButton(true);
      } else {
        setErrorMessage(`Solo los beneficiarios pueden iniciar una causa. Tu rol actual es: ${currentUser.role}`);
        setShowRoleChangeButton(false);
      }
      setShowMpConnectButton(false);
      setShowErrorModal(true);
      return;
    }
    
    // Paso 3: Verificar conexión con MercadoPago
    console.log('Verificando token para MercadoPago');
    if (!currentToken) {
      console.log('No se pudo obtener el token, mostrando error');
      setErrorMessage('Error de autenticación. Por favor, inicia sesión nuevamente.');
      setShowMpConnectButton(false);
      setShowErrorModal(true);
      return;
    }
    
    console.log('Verificando conexión de MercadoPago para usuario:', currentUser.email);
    console.log('Llamando a checkMercadoPagoConnection');
    const isConnected = await checkMercadoPagoConnection(currentToken);
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
      // Asegurarnos de que las cookies estén actualizadas antes de redirigir
      if (currentToken) {
        // Establecer cookies con prioridad
        document.cookie = `token=${currentToken}; path=/; max-age=86400; SameSite=Lax`;
        
        // Obtener refresh token de cookies primero, luego de localStorage
        let refreshToken = null;
        const refreshTokenCookie = document.cookie.split('; ').find(row => row.startsWith('refresh_token='));
        if (refreshTokenCookie) {
          refreshToken = refreshTokenCookie.split('=')[1];
        } else {
          refreshToken = localStorage.getItem('refresh_token');
        }
        
        if (refreshToken) {
          document.cookie = `refresh_token=${refreshToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        
        if (currentUser) {
          document.cookie = `auth_user=${JSON.stringify(currentUser)}; path=/; max-age=86400; SameSite=Lax`;
        }
      }
      
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

  // Función para manejar el cambio de rol de DONOR a BENEFICIARY
  const handleRoleChange = async () => {
    setIsChangingRole(true);
    try {
      // Obtener el token de acceso
      const token = await getToken();
      
      if (!token) {
        showToast('Error: No se encontró el token de autenticación', 'error');
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
        showToast(data.message || 'Error al actualizar el rol', 'error');
        setIsChangingRole(false);
        return;
      }

      // Éxito: mostrar mensaje
      showToast('¡Rol actualizado correctamente! Ahora eres un Beneficiario', 'success');
      
      // Actualizar el contexto de autenticación con el usuario actualizado
      if (user) {
        // Obtener la información actualizada del usuario desde el backend
        try {
          const userResponse = await fetch(`${apiUrl}auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (userResponse.ok) {
            // Verificar que la respuesta no está vacía
            const responseText = await userResponse.text();
            console.log('Respuesta de auth/me:', responseText);
            
            if (responseText && responseText.trim() !== '') {
              try {
                const userData = JSON.parse(responseText);
                // Actualizar el contexto con los datos actualizados del backend
                // Obtener el refresh token o usar el token de acceso como refresh token si no se proporciona
                const refreshToken = localStorage.getItem('refresh_token') || token;
                login(token, refreshToken, userData);
              } catch (jsonError) {
                console.error('Error al parsear respuesta JSON:', jsonError);
                // Usar actualización local como fallback
                const updatedUserData = {
                  ...user,
                  role: UserRole.BENEFICIARY
                };
                // Obtener el refresh token o usar el token de acceso como refresh token si no se proporciona
                const refreshToken = localStorage.getItem('refresh_token') || token;
                login(token, refreshToken, updatedUserData);
              }
            } else {
              console.warn('Respuesta vacía de auth/me, usando actualización local');
              const updatedUserData = {
                ...user,
                role: UserRole.BENEFICIARY
              };
              // Obtener el refresh token o usar el token de acceso como refresh token si no se proporciona
              const refreshToken = localStorage.getItem('refresh_token') || token;
              login(token, refreshToken, updatedUserData);
            }
          } else {
            console.warn(`Error en auth/me (${userResponse.status}): ${userResponse.statusText}`);
            // Si no se puede obtener la información actualizada, usar la actualización local
            const updatedUserData = {
              ...user,
              role: UserRole.BENEFICIARY
            };
            // Obtener el refresh token o usar el token de acceso como refresh token si no se proporciona
            const refreshToken = localStorage.getItem('refresh_token') || token;
            login(token, refreshToken, updatedUserData);
          }
        } catch (userError) {
          console.error('Error al obtener datos actualizados del usuario:', userError);
          // Fallback a actualización local
          const updatedUserData = {
            ...user,
            role: UserRole.BENEFICIARY
          };
          // Obtener el refresh token o usar el token de acceso como refresh token si no se proporciona
          const refreshToken = localStorage.getItem('refresh_token') || token;
          login(token, refreshToken, updatedUserData);
        }
      }
      
      // Cerrar el modal
      setShowErrorModal(false);
      setIsChangingRole(false);
      
      // Esperar un momento y luego intentar iniciar la causa nuevamente
      setTimeout(() => {
        handleStartCause();
      }, 500);
      
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      showToast('Error de conexión. Por favor, intenta nuevamente.', 'error');
      setIsChangingRole(false);
    }
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
          <div className="relative w-full max-w-md bg-white border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]  p-3 md:p-6">
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
              {showRoleChangeButton && (
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
