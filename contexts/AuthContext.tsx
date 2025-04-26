'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';

// Definición de usuario basada en AuthResponseDto
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole; // Usando el enum UserRole en lugar de string
  profilePicture?: string;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  updateUserData: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (token: string, refreshToken: string, userData: User) => console.warn('login() called outside AuthProvider'),
  logout: async () => console.warn('logout() called outside AuthProvider'),
  getToken: async () => {
    console.warn('getToken() called outside AuthProvider');
    return null;
  },
  updateUserData: () => console.warn('updateUserData() called outside AuthProvider'),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;
      setIsLoading(true);

      // Intentar obtener datos de autenticación de las cookies primero
      let token = null;
      let storedUser = null;
      
      // Buscar token en cookies
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
      
      // Buscar datos de usuario en cookies
      const userCookie = document.cookie.split('; ').find(row => row.startsWith('auth_user='));
      if (userCookie) {
        try {
          const userString = decodeURIComponent(userCookie.split('=')[1]);
          storedUser = userString;
        } catch (e) {
          console.warn('Error decoding user cookie:', e);
        }
      }
      
      // Si no encontramos en cookies, intentar con localStorage como respaldo
      if (!token) {
        token = localStorage.getItem('auth_token');
      }
      
      if (!storedUser) {
        storedUser = localStorage.getItem('auth_user');
      }
      
      // Si tenemos un token, intentar decodificarlo para obtener información adicional
      if (token) {
        const decodedToken = decodeJWT(token);
        if (decodedToken && decodedToken.fullName) {
          console.log('Nombre completo encontrado en el token JWT:', decodedToken.fullName);
        }
      }
      
      // Si tenemos un usuario almacenado, establecerlo temporalmente mientras verificamos
      // Esto evita redirecciones innecesarias si hay problemas de conexión
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Si tenemos un token, intentar extraer el nombre completo
          if (token) {
            const decodedToken = decodeJWT(token);
            if (decodedToken && decodedToken.fullName && (!parsedUser.fullName || parsedUser.fullName === parsedUser.email.split('@')[0])) {
              parsedUser.fullName = decodedToken.fullName;
              console.log('Actualizando nombre completo desde JWT:', decodedToken.fullName);
              
              // Actualizar el usuario almacenado con el nombre completo correcto
              localStorage.setItem('auth_user', JSON.stringify(parsedUser));
              document.cookie = `auth_user=${JSON.stringify(parsedUser)}; path=/; max-age=86400; SameSite=Lax`;
            }
          }
          
          setUser(parsedUser); // Establecer usuario inmediatamente
        } catch (e) {
          console.warn('Error parsing stored user data:', e);
        }
      }

      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      if (!apiUrl) {
        console.warn(
          'NEXT_PUBLIC_NEST_API_URL not defined — usando datos almacenados localmente'
        );
        // No limpiamos los datos almacenados, usamos lo que tenemos
        setIsLoading(false);
        return;
      }
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;

      if (token) {
        try {
          // Establecer un timeout para la solicitud
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
          
          const resp = await fetch(`${baseUrl}auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal
          }).catch(err => {
            console.warn('Network error during auth check:', err);
            // Si hay un error de red, mantenemos los datos almacenados localmente
            // pero marcamos que la carga ha terminado
            clearTimeout(timeoutId);
            return null;
          });
          
          clearTimeout(timeoutId);

          if (resp && resp.ok) {
            const text = await resp.text();
            if (text) {
              try {
                const userData: User = JSON.parse(text);
                
                // Asegurarse de que profilePicture sea una URL completa si existe
                if (userData.profilePicture && !userData.profilePicture.startsWith('http')) {
                  const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
                  const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
                  userData.profilePicture = `${baseUrl}${userData.profilePicture.startsWith('/') ? userData.profilePicture.substring(1) : userData.profilePicture}`;
                }
                
                // Verificar si el usuario necesita seleccionar un rol (autenticación con Google)
                const responseData = userData as User & { needsRoleSelection?: boolean };
                
                if (responseData.needsRoleSelection) {
                  console.log('Usuario necesita seleccionar un rol, redirigiendo...');
                  // Guardar datos temporalmente para la página de selección de rol
                  sessionStorage.setItem('googleUserData', JSON.stringify(userData));
                  // Guardar token para que la página de selección de rol pueda usarlo
                  localStorage.setItem('auth_token', token);
                  localStorage.setItem('token', token); // Mantener compatibilidad
                  // Redirigir a la página de selección de rol
                  router.push('/auth/google/role-selection');
                  return;
                }
                
                setUser(userData);
                // Actualizar cookies primero (prioridad)
                document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 días
                document.cookie = `auth_user=${JSON.stringify(userData)}; path=/; max-age=2592000`;
                // Actualizar datos en localStorage como respaldo
                localStorage.setItem('auth_user', JSON.stringify(userData));
              } catch (parseError) {
                console.error('Error parsing user data:', parseError);
                // Usar datos almacenados si hay error de parsing
                if (storedUser) {
                  try {
                    setUser(JSON.parse(storedUser));
                  } catch (e) {
                    setUser(null);
                  }
                }
              }
            }
          } else if (resp) {
            console.warn(
              `Auth check failed (${resp.status}) — clearing token`
            );
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setUser(null);
          }
          // Si resp es null, significa que hubo un error de red
          // En ese caso, mantenemos los datos almacenados localmente
        } catch (err) {
          console.error('Error validating token:', err);
          // No eliminamos los datos locales en caso de error de red
          // para permitir el uso offline
        }
      } else {
        // Si no hay token, no hay sesión válida
        setUser(null);
      }
    };

    checkAuth().finally(() => {
      setIsLoading(false);
    });
  }, [router]);

  // Función para decodificar un token JWT
  const decodeJWT = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando JWT:', error);
      return null;
    }
  };

  const login = (token: string, refreshToken: string, userData: User) => {
    if (typeof window === 'undefined') return;
    
    try {
      // Decodificar el token para obtener información adicional
      const decodedToken = decodeJWT(token);
      
      // Si el token contiene fullName, asegurarse de que userData lo tenga
      if (decodedToken && decodedToken.fullName && (!userData.fullName || userData.fullName === userData.email.split('@')[0])) {
        userData.fullName = decodedToken.fullName;
        console.log('Nombre completo extraído del token JWT:', decodedToken.fullName);
      }
      
      // Verificar si el usuario necesita seleccionar un rol (autenticación con Google)
      const extendedUserData = userData as User & { needsRoleSelection?: boolean };
      
      if (extendedUserData.needsRoleSelection) {
        console.log('Usuario necesita seleccionar un rol, redirigiendo...');
        // Guardar datos temporalmente para la página de selección de rol
        sessionStorage.setItem('googleUserData', JSON.stringify(userData));
        // Guardar token para que la página de selección de rol pueda usarlo
        localStorage.setItem('auth_token', token);
        localStorage.setItem('token', token); // Mantener compatibilidad
        localStorage.setItem('refresh_token', refreshToken);
        // Redirigir a la página de selección de rol
        router.push('/auth/google/role-selection');
        return;
      }
      
      // Priorizar cookies para la autenticación
      // Establecer cookies para que el middleware pueda verificar la autenticación
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `refresh_token=${refreshToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `auth_user=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;
      
      // También guardar en localStorage como respaldo
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Actualizar el estado
      setUser(userData);
      setIsLoading(false);
      
      console.log('Usuario autenticado:', userData.fullName);
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  const logout = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Intentar hacer logout en el servidor
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      if (apiUrl) {
        const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
        // Obtener token de cookie primero, luego de localStorage como respaldo
        let token = null;
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        } else {
          token = localStorage.getItem('auth_token');
        }

        if (token) {
          try {
            // Establecer un timeout para la solicitud
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            await fetch(`${baseUrl}auth/logout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ token }), // Enviar el token en el cuerpo de la solicitud
              signal: controller.signal,
            }).catch(err => {
              console.warn('Network error during logout:', err);
            });

            clearTimeout(timeoutId);
          } catch (err) {
            console.warn('Error during server logout:', err);
            // Continuar con el logout local incluso si falla el servidor
          }
        }
      }

      // Limpiar cookies primero (prioridad)
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Limpiar localStorage como respaldo
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');

      // Actualizar estado
      setUser(null);
      console.log('Sesión cerrada correctamente');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const getToken = async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Intentar obtener el token de las cookies primero
      let token = null;
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
      
      // Si no hay token en cookies, intentar obtenerlo de localStorage como respaldo
      if (!token) {
        token = localStorage.getItem('auth_token');
      }
      
      if (!token) {
        console.warn('No hay token en cookies ni localStorage');
        return null;
      }
      
      // Verificar si el token es válido
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Token malformado, intentando refrescar...');
        return await refreshToken();
      }
      
      // Verificar si el token está expirado
      try {
        const payload = JSON.parse(atob(parts[1]));
        const expiry = payload.exp * 1000; // Convertir a milisegundos
        
        if (Date.now() >= expiry) {
          console.warn('Token expirado, intentando refrescar...');
          return await refreshToken();
        }
      } catch (e) {
        console.warn('Error al decodificar el token:', e);
      }
      
      return token;
    } catch (e) {
      console.error('Error al procesar el token:', e);
      const tokenFromStorage = localStorage.getItem('auth_token');
      return tokenFromStorage; // Devolver el token de localStorage en caso de error
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      if (!apiUrl) return null;
      
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      // Intentar obtener el refresh token de las cookies primero
      let currentRefreshToken = null;
      const refreshTokenCookie = document.cookie.split('; ').find(row => row.startsWith('refresh_token='));
      if (refreshTokenCookie) {
        currentRefreshToken = refreshTokenCookie.split('=')[1];
      }
      
      // Si no hay refresh token en cookies, intentar obtenerlo de localStorage
      if (!currentRefreshToken) {
        currentRefreshToken = localStorage.getItem('refresh_token');
      }
      
      if (!currentRefreshToken) {
        console.warn('No hay refresh token disponible en cookies ni localStorage');
        return null;
      }
      
      console.log('Intentando refrescar el token...');
      
      console.log('Enviando refresh token:', currentRefreshToken);
      
      // Intentar con el formato refreshToken primero (nuevo formato)
      const response = await fetch(`${baseUrl}auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: currentRefreshToken
        }),
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          // Actualizar primero las cookies (prioridad)
          document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
          
          // Si también se devuelve un nuevo refresh token, guardarlo
          if (data.refresh_token) {
            document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=86400; SameSite=Lax`;
            localStorage.setItem('refresh_token', data.refresh_token);
          }
          
          // Guardar también en localStorage como respaldo
          localStorage.setItem('auth_token', data.access_token);
          
          console.log('Token refrescado correctamente');
          return data.access_token;
        }
      } else {
        console.warn('No se pudo refrescar el token, código:', response.status);
        
        // Si el refresh token es inválido o ha expirado, limpiar todo
        if (response.status === 401 || response.status === 403) {
          console.warn('Refresh token inválido o expirado, cerrando sesión...');
          await logout();
          return null;
        }
      }
      
      return localStorage.getItem('auth_token'); // Devolver el token original si no se pudo refrescar
    } catch (e) {
      console.error('Error al refrescar el token:', e);
      return localStorage.getItem('auth_token'); // Devolver el token original en caso de error
    }
  };

  const updateUserData = (userData: Partial<User>) => {
    if (typeof window === 'undefined' || !user) return;
    
    try {
      // Actualizar el estado del usuario con los nuevos datos
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Actualizar los datos en localStorage
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      console.log('Datos de usuario actualizados:', updatedUser);
    } catch (err) {
      console.error('Error al actualizar datos de usuario:', err);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      getToken,
      updateUserData,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
