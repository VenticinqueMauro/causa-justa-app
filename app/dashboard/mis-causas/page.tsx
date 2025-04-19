'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Cause {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export default function MyCausesPage() {
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const [causes, setCauses] = useState<Cause[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar que el usuario esté autenticado y sea BENEFICIARY
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && user.role !== 'BENEFICIARY') {
        console.log('Usuario no es beneficiario:', user.role);
        router.push('/dashboard');
      }
    }
  }, [user, router, isAuthenticated, isLoading]);

  useEffect(() => {
    const fetchMyCauses = async () => {
      if (!isAuthenticated || !user || user.role !== 'BENEFICIARY') {
        console.log('No se cumplen las condiciones para obtener causas:', {
          isAuthenticated,
          userRole: user?.role
        });
        return;
      }
      
      try {
        setIsLoading(true);
        const token = await getToken();
        console.log('Token obtenido:', token ? 'Token presente (primeros 10 caracteres): ' + token.substring(0, 10) + '...' : 'Token no encontrado');
        
        if (!token) throw new Error('No se encontró token de autenticación');
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        // Primero, intentemos obtener el perfil del usuario para verificar que la autenticación funciona
        console.log('Verificando autenticación con /profile...');
        const profileResponse = await fetch(`${baseUrl}profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('Respuesta de perfil:', profileResponse.status, profileResponse.statusText);
        
        if (!profileResponse.ok) {
          console.error('Error al verificar perfil, posible problema de autenticación');
          const profileError = await profileResponse.text();
          console.error('Detalle del error de perfil:', profileError);
          
          // Si hay un error de autenticación, intentemos hacer login nuevamente
          if (profileResponse.status === 401 || profileResponse.status === 403) {
            console.log('Intentando reautenticar al usuario...');
            // Aquí podríamos implementar una lógica para reautenticar al usuario
            // Por ahora, simplemente informamos al usuario
            setError('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
            throw new Error('Sesión expirada');
          }
        } else {
          console.log('Perfil verificado correctamente, procediendo a obtener campañas');
        }
        
        // Ahora intentemos obtener las campañas
        const url = `${baseUrl}campaigns/my`;
        console.log('Realizando solicitud a:', url);
        
        const response = await fetch(url, {
          method: 'GET',  
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error en la respuesta:', errorText);
          throw new Error(`Error al obtener causas: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        setCauses(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching causes:', err);
        setError(`No se pudieron cargar tus causas: ${err.message || 'Error desconocido'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMyCauses();
  }, [isAuthenticated, getToken]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente de aprobación';
      case 'APPROVED':
        return 'Aprobada';
      case 'REJECTED':
        return 'Rechazada';
      case 'COMPLETED':
        return 'Completada';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  if (user?.role !== 'BENEFICIARY') {
    return null; // No renderizar nada si no es beneficiario
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Causas</h1>
          <p className="text-gray-600">Gestiona tus campañas de recaudación</p>
        </div>
        <Link
          href="/dashboard/crear-causa"
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Crear nueva causa
        </Link>
        {error && (
          <button 
            onClick={() => router.push('/auth/login')} 
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reiniciar sesión
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      ) : causes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No tienes causas creadas</h3>
          <p className="text-gray-600 mb-6">
            Comienza creando tu primera campaña de recaudación
          </p>
          <Link
            href="/dashboard/crear-causa"
            className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Crear mi primera causa
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {causes.map((cause) => (
            <div
              key={cause.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900 truncate">{cause.title}</h2>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                      cause.status
                    )}`}
                  >
                    {getStatusText(cause.status)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{cause.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progreso</span>
                    <span>
                      {formatCurrency(cause.currentAmount)} de {formatCurrency(cause.goalAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (cause.currentAmount / cause.goalAmount) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {Math.round((cause.currentAmount / cause.goalAmount) * 100)}%
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  Creada el {new Date(cause.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex justify-between">
                  <Link
                    href={`/dashboard/mis-causas/${cause.id}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Ver detalles
                  </Link>
                  
                  {cause.status === 'APPROVED' && (
                    <Link
                      href={`/dashboard/mis-causas/${cause.id}/editar`}
                      className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Editar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
