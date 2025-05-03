'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CampaignCategory } from '@/types';
import { getCategoryOptions } from '@/utils/campaign-categories';
import BrutalButton from '@/components/ui/BrutalButton';

interface CreateCauseForm {
  title: string;
  description: string;
  goalAmount: string;
  endDate: string;
  category: CampaignCategory | string;
  image: File | null;
}

export default function CreateCausePage() {
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mercadoPagoConnected, setMercadoPagoConnected] = useState(false);
  const [isCheckingMercadoPago, setIsCheckingMercadoPago] = useState(true);
  const [form, setForm] = useState<CreateCauseForm>({
    title: '',
    description: '',
    goalAmount: '',
    endDate: '',
    category: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Verificar que el usuario sea BENEFICIARY
    if (user && user.role !== 'BENEFICIARY') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const checkMercadoPagoStatus = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsCheckingMercadoPago(true);
        
        const token = await getToken();
        if (!token) throw new Error('No se encontró token de autenticación');
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        console.log('Verificando estado de MercadoPago con el servidor:', `${baseUrl}mercadopago/status`);
        
        const response = await fetch(`${baseUrl}mercadopago/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al verificar estado de MercadoPago');
        }
        
        const data = await response.json();
        console.log('Respuesta de MercadoPago:', data);
        
        // Verificar si está conectado (comprobando todos los posibles formatos de respuesta)
        const isConnected = data.connected || data.isConnected || false;
        console.log('¿Está conectado a MercadoPago?', isConnected);
        
        // Actualizar el estado sin usar localStorage
        setMercadoPagoConnected(isConnected);
      } catch (err) {
        console.error('Error checking MercadoPago status:', err);
        setMercadoPagoConnected(false);
      } finally {
        setIsCheckingMercadoPago(false);
      }
    };
    
    checkMercadoPagoStatus();
  }, [isAuthenticated, getToken]);

  const handleConnectMercadoPago = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Obtener token de múltiples fuentes (similar a StartCauseButton)
      console.log('Intentando obtener token de autenticación...');
      
      // 1. Intentar obtener token usando getToken() del contexto
      let token = await getToken();
      console.log('Token desde getToken():', token ? 'Obtenido' : 'No disponible');
      
      // 2. Si no hay token, intentar obtenerlo de las cookies
      if (!token) {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
          console.log('Token obtenido de cookies');
        }
      }
      
      // 3. Si aún no hay token, intentar obtenerlo de localStorage
      if (!token) {
        const localStorageToken = localStorage.getItem('auth_token');
        if (localStorageToken) {
          token = localStorageToken;
          console.log('Token obtenido de localStorage');
        }
      }
      
      // Verificar si se obtuvo un token
      if (!token) {
        console.error('No se pudo obtener el token de autenticación de ninguna fuente');
        throw new Error('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.');
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      console.log('Conectando con MercadoPago:', `${baseUrl}mercadopago/connect`);
      
      const response = await fetch(`${baseUrl}mercadopago/connect`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Clonar la respuesta para poder leerla como texto para depuración
      const responseText = await response.clone().text();
      console.log('Respuesta completa del servidor:', responseText);
      
      if (!response.ok) {
        throw new Error(`Error al conectar con MercadoPago: ${response.status} ${response.statusText}`);
      }
      
      // Intentar parsear la respuesta como JSON
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
        console.log('Datos parseados:', data);
      } catch (parseError) {
        console.error('Error al parsear respuesta JSON:', parseError);
        // Si no es JSON válido, verificar si es una URL directa
        if (responseText && responseText.includes('http')) {
          console.log('La respuesta parece ser una URL directa');
          window.location.href = responseText.trim();
          return;
        }
        throw new Error('Formato de respuesta no válido');
      }
      
      // Buscar la URL de redirección en diferentes formatos posibles
      let redirectUrl = null;
      
      // Registrar todas las propiedades para depuración
      console.log('Propiedades disponibles en la respuesta:');
      for (const key in data) {
        console.log(`- ${key}: ${typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]}`);
      }
      
      // Verificar todos los posibles nombres de propiedad para la URL
      if (data.authUrl) {
        redirectUrl = data.authUrl;
        console.log('URL encontrada en data.authUrl');
      } else if (data.redirectUrl) {
        redirectUrl = data.redirectUrl;
        console.log('URL encontrada en data.redirectUrl');
      } else if (data.redirect_url) {
        redirectUrl = data.redirect_url;
        console.log('URL encontrada en data.redirect_url');
      } else if (data.url) {
        redirectUrl = data.url;
        console.log('URL encontrada en data.url');
      } else if (typeof data === 'string' && data.includes('http')) {
        redirectUrl = data;
        console.log('URL encontrada directamente en data como string');
      }
      
      // Si encontramos una URL, redirigir
      if (redirectUrl) {
        console.log('Redirigiendo a:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.error('No se encontró URL de redirección en la respuesta');
        throw new Error('No se recibió URL de autorización');
      }
    } catch (err: any) {
      console.error('Error connecting to MercadoPago:', err);
      setError(err.message || 'No se pudo conectar con MercadoPago. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({
      ...form,
      image: file,
    });
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mercadoPagoConnected) {
      setError('Debes conectar tu cuenta de MercadoPago antes de crear una causa');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      // Crear un FormData para enviar la imagen
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('goalAmount', form.goalAmount);
      formData.append('endDate', form.endDate);
      formData.append('category', form.category);
      if (form.image) {
        formData.append('image', form.image);
      }
      
      const response = await fetch(`${baseUrl}causes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear la causa');
      }
      
      const data = await response.json();
      
      // Redirigir a la página de detalles de la causa creada
      router.push(`/dashboard/mis-causas/${data.id}`);
    } catch (err: any) {
      console.error('Error creating cause:', err);
      setError(err.message || 'No se pudo crear la causa. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'BENEFICIARY') {
    return null; // No renderizar nada si no es beneficiario
  }

  if (isCheckingMercadoPago) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!mercadoPagoConnected) {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">Crear Causa</h1>
          <p className="text-gray-600">Inicia una nueva campaña de recaudación</p>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Para crear una causa, primero debes conectar tu cuenta de MercadoPago.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Conecta tu cuenta de MercadoPago</h2>
          <p className="text-gray-600 mb-6">
            Para recibir donaciones, necesitas conectar tu cuenta de MercadoPago con Causa Justa.
            Este proceso es seguro y nos permitirá transferir los fondos recaudados directamente a tu cuenta.
          </p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 text-left">
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
          
          <BrutalButton
            variant="secondary"
            size="lg"
            onClick={handleConnectMercadoPago}
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Conectando...
              </span>
            ) : (
              'Conectar con MercadoPago'
            )}
          </BrutalButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Crear Causa</h1>
        <p className="text-gray-600">Inicia una nueva campaña de recaudación</p>
      </div>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Tu cuenta de MercadoPago está conectada correctamente. Ya puedes crear tu causa.
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
      
      <form onSubmit={handleSubmit} className="bg-white p-3 md:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título de la causa *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Ej: Ayuda para tratamiento médico"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Describe detalladamente el propósito de tu causa y cómo se utilizarán los fondos..."
              required
            />
          </div>
          
          <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Meta de recaudación (ARS) *
            </label>
            <input
              type="number"
              id="goalAmount"
              name="goalAmount"
              value={form.goalAmount}
              onChange={handleInputChange}
              min="1000"
              step="100"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Ej: 50000"
              required
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha límite *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={form.endDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              required
            >
              <option value="" disabled>Selecciona una categoría</option>
              {getCategoryOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Imagen de portada
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: JPG, PNG. Máximo 5MB.
            </p>
          </div>
          
          {imagePreview && (
            <div className="md:col-span-2">
              <p className="block text-sm font-medium text-gray-700 mb-1">Vista previa</p>
              <div className="mt-1 relative rounded-md overflow-hidden h-48 bg-gray-100">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <Link
            href="/dashboard/mis-causas"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md bg-gray-700 hover:bg-gray-900 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
            ) : (
              'Crear causa'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
