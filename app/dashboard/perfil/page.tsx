'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileForm {
  fullName: string;
  email: string;
  cuitOrDni: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    email: '',
    cuitOrDni: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No se encontró token de autenticación');
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        const response = await fetch(`${baseUrl}users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener perfil de usuario');
        }
        
        const data = await response.json();
        setUserProfile(data);
        setForm({
          fullName: data.fullName || '',
          email: data.email || '',
          cuitOrDni: data.cuitOrDni || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('No se pudo cargar tu perfil. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, getToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      const response = await fetch(`${baseUrl}users/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar perfil');
      }
      
      const data = await response.json();
      setUserProfile(data);
      setSuccess('Perfil actualizado correctamente');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'No se pudo actualizar el perfil. Intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Información Personal</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El correo electrónico no se puede modificar
                  </p>
                </div>
                
                <div>
                  <label htmlFor="cuitOrDni" className="block text-sm font-medium text-gray-700 mb-1">
                    CUIT / DNI
                  </label>
                  <input
                    type="text"
                    id="cuitOrDni"
                    name="cuitOrDni"
                    value={form.cuitOrDni}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El CUIT/DNI no se puede modificar
                  </p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Ej: +54 11 1234-5678"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Ej: Av. Corrientes 1234, CABA"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    'Guardar cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Seguridad</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Cambiar contraseña</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Actualiza tu contraseña para mantener tu cuenta segura
                </p>
                <Link
                  href="/auth/change-password"
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cambiar contraseña
                </Link>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Información de la cuenta</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Rol</span>
                    <span className="text-sm font-medium">
                      {user?.role === 'ADMIN' && 'Administrador'}
                      {user?.role === 'BENEFICIARY' && 'Beneficiario'}
                      {user?.role === 'DONOR' && 'Donante'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Estado</span>
                    <span className="text-sm font-medium">
                      {userProfile?.isVerified ? (
                        <span className="text-green-600">Verificado</span>
                      ) : (
                        <span className="text-red-600">No verificado</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Fecha de registro</span>
                    <span className="text-sm font-medium">
                      {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : '-'}
                    </span>
                  </div>
                </div>
              </div>
              
              {user?.role === 'BENEFICIARY' && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">MercadoPago</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Gestiona tu conexión con MercadoPago para recibir donaciones
                  </p>
                  <Link
                    href="/dashboard/mercadopago"
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Configurar MercadoPago
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
