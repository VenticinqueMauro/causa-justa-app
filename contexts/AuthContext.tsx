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
                setUser(userData);
                // Actualizar datos en localStorage
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

  const login = (token: string, userData: User) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
    }
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
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  const getToken = async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
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
