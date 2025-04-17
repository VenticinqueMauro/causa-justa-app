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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
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

      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      if (!apiUrl) {
        console.warn(
          'NEXT_PUBLIC_NEST_API_URL not defined — skipping auth check'
        );
        setUser(null);
        setIsLoading(false);
        return;
      }
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;

      // Cargar de localStorage
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (token) {
        try {
          const resp = await fetch(`${baseUrl}auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (resp.ok) {
            const text = await resp.text();
            const userData: User = text
              ? JSON.parse(text)
              : JSON.parse(storedUser || 'null');

            setUser(userData);
            return;
          } else {
            console.warn(
              `Auth check failed (${resp.status}) — clearing token`
            );
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        } catch (err) {
          console.error('Error validating token:', err);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }

      // Si llegamos acá, no hay sesión válida
      setUser(null);
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

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      getToken,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
