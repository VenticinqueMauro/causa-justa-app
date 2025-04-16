'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir la interfaz para el usuario autenticado
interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

// Definir la interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// Crear el contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Verificar que la URL de la API esté definida
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        if (!apiUrl) {
          console.warn('NEXT_PUBLIC_NEST_API_URL no está definida. Saltando verificación de autenticación.');
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Asegurarse de que la URL termina con una barra diagonal
        const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;

        // Intentar obtener el usuario actual desde la API
        // Primero intentamos con credentials: 'include' para entornos donde CORS está configurado correctamente
        try {
          const response = await fetch(`${baseUrl}auth/me`, {
            method: 'GET',
            credentials: 'include', // Importante para enviar cookies
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            try {
              // Verificar si la respuesta tiene contenido antes de intentar parsearla
              const text = await response.text();
              if (text) {
                const userData = JSON.parse(text);
                setUser(userData);
              } else {
                console.warn('Respuesta vacía de auth/me');
                setUser(null);
              }
            } catch (parseError) {
              console.warn('Error al parsear respuesta JSON:', parseError);
              setUser(null);
            }
            setIsLoading(false);
            return;
          }
        } catch (corsError) {
          console.warn('Error CORS con credentials:include. Intentando sin credentials:', corsError);
          // Si hay un error CORS, continuamos con el siguiente intento
        }

        // Si el primer intento falló, intentamos sin credentials para entornos de desarrollo/prueba
        // Esto no enviará cookies pero permitirá que la app funcione en desarrollo
        try {
          const fallbackResponse = await fetch(`${baseUrl}auth/me`, {
            method: 'GET',
            // Sin credentials: 'include' para evitar problemas de CORS
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (fallbackResponse.ok) {
            try {
              // Verificar si la respuesta tiene contenido antes de intentar parsearla
              const text = await fallbackResponse.text();
              if (text) {
                const userData = JSON.parse(text);
                setUser(userData);
              } else {
                console.warn('Respuesta vacía de auth/me (fallback)');
                setUser(null);
              }
            } catch (parseError) {
              console.warn('Error al parsear respuesta JSON (fallback):', parseError);
              setUser(null);
            }
          } else {
            // Si hay un error, el usuario no está autenticado
            setUser(null);
          }
        } catch (error) {
          console.warn('Error en la solicitud fallback:', error);
          setUser(null);
        }
      } catch (error) {
        console.error('Error al verificar estado de autenticación:', error);
        // No mostrar error en producción para el usuario final
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Función para iniciar sesión
  const login = (token: string, userData: User) => {
    // Guardar el usuario en el estado
    setUser(userData);
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Verificar que la URL de la API esté definida
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      if (!apiUrl) {
        console.warn('NEXT_PUBLIC_NEST_API_URL no está definida. Realizando logout local.');
        setUser(null);
        return;
      }

      // Asegurarse de que la URL termina con una barra diagonal
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;

      // Intentar llamar al endpoint de logout en el backend con credentials
      try {
        await fetch(`${baseUrl}auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (corsError) {
        console.warn('Error CORS con credentials:include en logout. Intentando sin credentials:', corsError);
        // Si hay un error CORS, intentamos sin credentials
        await fetch(`${baseUrl}auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar el estado del usuario
      setUser(null);
    }
  };

  // Valor del contexto
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
