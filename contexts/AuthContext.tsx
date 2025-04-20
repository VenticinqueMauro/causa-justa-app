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

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  profilePicture?: string;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  updateUserData: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => console.warn('login() called outside AuthProvider'),
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

      // Cargar datos de localStorage primero para una experiencia más rápida
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      // Si tenemos un usuario almacenado, establecerlo temporalmente mientras verificamos
      // Esto evita redirecciones innecesarias si hay problemas de conexión
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser); // Establecer usuario desde localStorage inmediatamente
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
                
                setUser(userData);
                // Actualizar datos en localStorage
                localStorage.setItem('auth_user', JSON.stringify(userData));
                // Actualizar cookies para el middleware
                document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 días
                document.cookie = `auth_user=${JSON.stringify(userData)}; path=/; max-age=2592000`;
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

  const login = (token: string, userData: User) => {
    if (typeof window === 'undefined') return;
    
    // Asegurarse de que profilePicture sea una URL completa si existe
    if (userData.profilePicture && !userData.profilePicture.startsWith('http')) {
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      userData.profilePicture = `${baseUrl}${userData.profilePicture.startsWith('/') ? userData.profilePicture.substring(1) : userData.profilePicture}`;
    }
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    
    // Establecer cookies para el middleware
    document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 días
    document.cookie = `auth_user=${JSON.stringify(userData)}; path=/; max-age=2592000`;
    
    setUser(userData);
    setIsLoading(false);
  };

  const logout = async () => {
    if (typeof window === 'undefined') return;
    setIsLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
    const baseUrl = apiUrl && apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;

    try {
      if (apiUrl) {
        await fetch(`${baseUrl}auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      // Eliminar de localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Eliminar cookies
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  const getToken = async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('auth_token');
    
    // Verificar si el token existe y tiene un formato válido
    if (token) {
      try {
        // Verificar si el token tiene el formato correcto (xxx.yyy.zzz)
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.warn('Token con formato inválido, intentando refrescar...');
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
        return token; // Devolver el token original en caso de error
      }
    }
    
    return null;
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      if (!apiUrl) return null;
      
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      const currentToken = localStorage.getItem('auth_token');
      
      if (!currentToken) return null;
      
      console.log('Intentando refrescar el token...');
      
      const response = await fetch(`${baseUrl}auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('auth_token', data.access_token);
          console.log('Token refrescado correctamente');
          return data.access_token;
        }
      } else {
        console.warn('No se pudo refrescar el token, código:', response.status);
      }
      
      return currentToken; // Devolver el token original si no se pudo refrescar
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
