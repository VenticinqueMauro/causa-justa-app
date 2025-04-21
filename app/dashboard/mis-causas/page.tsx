'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

interface Cause {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'COMPLETED'; // Actualizado para coincidir con la API
  createdAt: string;
  updatedAt: string;
  // Campos adicionales que podrían venir de la API
  shortDescription?: string;
  slug?: string;
  images?: string[];
}

export default function MyCausesPage() {
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [causes, setCauses] = useState<Cause[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

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
    // Asegurarnos de que el componente esté montado antes de hacer la solicitud
    let isMounted = true;
    
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
            // Por ahora, simplemente informamos al usuario con un toast
            showToast('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', 'error');
            setError('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
            throw new Error('Sesión expirada');
          }
        } else {
          console.log('Perfil verificado correctamente, procediendo a obtener campañas');
        }
        
        // Ahora intentemos obtener las campañas
        // Asegurarnos de que el token esté sincronizado entre localStorage y cookies
        // Esto es crucial para resolver problemas de autenticación 403
        const freshToken = await getToken(); // Obtener token (se refrescará automáticamente si es necesario)
        console.log('Token actualizado:', freshToken ? 'Token presente (primeros 10 caracteres): ' + freshToken.substring(0, 10) + '...' : 'Token no encontrado');
        
        if (!freshToken) {
          console.error('No se pudo obtener un token fresco');
          showToast('Problema de autenticación. Por favor, vuelve a iniciar sesión.', 'error');
          setError('Problema de autenticación. Por favor, vuelve a iniciar sesión.');
          throw new Error('No se pudo obtener un token fresco');
        }
        
        // Sincronizar el token en las cookies para asegurar que el middleware lo pueda leer
        // Esta sincronización es clave para resolver el error 403 Forbidden
        document.cookie = `token=${freshToken}; path=/; max-age=86400; SameSite=Lax`;
        
        // Asegurarse de que el refresh token también esté sincronizado en cookies
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          document.cookie = `refresh_token=${refreshToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        
        // Esperar un momento para que la cookie se establezca correctamente
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Construir URL con parámetros de consulta
        let url = `${baseUrl}campaigns/my?page=${currentPage}&limit=6`;
        
        // Añadir filtros si están presentes
        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }
        
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        console.log('Realizando solicitud a:', url);
        
        const response = await fetch(url, {
          method: 'GET',  
          headers: {
            'Authorization': `Bearer ${freshToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Incluir cookies en la solicitud para que el middleware pueda verificar la autenticación
        });
        
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error en la respuesta:', errorText);
          
          // Si es un error de autenticación, intentar refrescar el token
          if (response.status === 401 || response.status === 403) {
            console.log('Error de autenticación 401/403, intentando refrescar el token...');
            
            // Usar el nuevo endpoint /auth/refresh implementado por el backend
            try {
              const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
              const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
              
              // Obtener el refresh token
              const refreshToken = localStorage.getItem('refresh_token');
              
              if (!refreshToken) {
                console.error('No hay refresh token disponible');
                throw new Error('No hay refresh token disponible');
              }
              
              console.log('Intentando refrescar el token con refresh_token...');
              
              // Intentar refrescar el token
              const refreshResponse = await fetch(`${baseUrl}auth/refresh`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  refresh_token: refreshToken
                }),
                credentials: 'include',
              });
              
              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                if (refreshData.access_token) {
                  // Guardar el nuevo token en localStorage
                  localStorage.setItem('auth_token', refreshData.access_token);
                  
                  // Si también se devuelve un nuevo refresh token, guardarlo
                  if (refreshData.refresh_token) {
                    localStorage.setItem('refresh_token', refreshData.refresh_token);
                    document.cookie = `refresh_token=${refreshData.refresh_token}; path=/; max-age=86400; SameSite=Lax`;
                  }
                  
                  // Sincronizar con cookies
                  document.cookie = `token=${refreshData.access_token}; path=/; max-age=86400; SameSite=Lax`;
                  
                  console.log('Token refrescado correctamente, reintentando solicitud...');
                  showToast('Reautenticando, por favor espera...', 'info');
                  
                  // Reintentar la solicitud original con el nuevo token
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                  return; // Salir de la función para evitar mostrar el error
                }
              } else {
                // Si no se pudo refrescar, intentar verificar el perfil como plan B
                const profileResponse = await fetch(`${baseUrl}profile`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${freshToken}`,
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                });
                
                if (profileResponse.ok) {
                  // Si el perfil se obtiene correctamente, el token es válido
                  // pero puede haber un problema de sincronización entre localStorage y cookies
                  const storedToken = localStorage.getItem('auth_token');
                  if (storedToken) {
                    // Asegurarnos de que la cookie tenga el token exacto de localStorage
                    document.cookie = `token=${storedToken}; path=/; max-age=86400; SameSite=Lax`;
                    document.cookie = `auth_token=${storedToken}; path=/; max-age=86400; SameSite=Lax`;
                    
                    console.log('Token sincronizado manualmente, reintentando solicitud...');
                    showToast('Sincronizando autenticación, por favor espera...', 'info');
                    
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                    return;
                  }
                }
              }
            } catch (error) {
              console.error('Error al intentar refrescar el token:', error);
            }
            
            // Si llegamos aquí, no se pudo reautenticar
            showToast('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', 'error');
            setError('Sesión expirada');
            
            // Redirigir al login después de un breve retraso
            setTimeout(() => {
              // Limpiar el almacenamiento antes de redirigir
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
              document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
              document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
              
              router.push('/login');
            }, 2000);
          } else {
            // Otros errores
            showToast(`No se pudieron cargar tus causas: ${response.status} ${response.statusText}`, 'error');
          }
          
          throw new Error(`Error al obtener causas: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        // Verificar la estructura de la respuesta
        if (Array.isArray(data)) {
          // Si es un array simple, asumimos que es la lista de causas
          setCauses(data || []);
          // Estimamos el total de páginas basado en el número de items
          setTotalPages(Math.max(1, Math.ceil(data.length / 6)));
          setTotalItems(data.length);
        } else if (data.items && Array.isArray(data.items)) {
          // Si tiene estructura de paginación
          setCauses(data.items || []);
          setTotalPages(data.meta?.totalPages || 1);
          setTotalItems(data.meta?.totalItems || 0);
        } else {
          // Formato inesperado
          console.warn('Formato de respuesta inesperado:', data);
          setCauses([]);
          setTotalPages(1);
          setTotalItems(0);
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching causes:', err);
        setError(`No se pudieron cargar tus causas: ${err.message || 'Error desconocido'}`);
        showToast(`No se pudieron cargar tus causas: ${err.message || 'Error desconocido'}`, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMyCauses();
    
    // Cleanup function para evitar actualizaciones de estado en componentes desmontados
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, getToken, currentPage, searchTerm, statusFilter]);
  
  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Función para manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Resetear a la primera página al buscar
  };
  
  // Función para manejar el filtro por estado
  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    setCurrentPage(1); // Resetear a la primera página al filtrar
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'VERIFIED': // Actualizado para coincidir con la API
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
        return 'Pendiente';
      case 'VERIFIED': // Actualizado para coincidir con la API
        return 'Verificada';
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
      <div className="flex flex-col space-y-4 border-b pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mis Causas</h1>
            <p className="text-gray-600">Gestiona tus campañas de recaudación</p>
          </div>
          <div className="flex space-x-2">
            <Link
              href="/dashboard/crear-causa"
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Crear nueva causa
            </Link>
            {error && (
              <button 
                onClick={() => router.push('/auth/login')} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reiniciar sesión
              </button>
            )}
          </div>
        </div>
        
        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 pt-2">
          <div className="flex space-x-2">
            <button 
              onClick={() => handleStatusFilter(null)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${!statusFilter ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => handleStatusFilter('PENDING')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${statusFilter === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
            >
              Pendientes
            </button>
            <button 
              onClick={() => handleStatusFilter('VERIFIED')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${statusFilter === 'VERIFIED' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
            >
              Verificadas
            </button>
            <button 
              onClick={() => handleStatusFilter('REJECTED')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${statusFilter === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
            >
              Rechazadas
            </button>
          </div>
          
          <form onSubmit={handleSearch} className="w-full md:w-auto flex">
            <input
              type="text"
              placeholder="Buscar por título o descripción"
              className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 flex-grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-gray-700 text-white rounded-r-md hover:bg-gray-600 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>
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
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm || statusFilter 
              ? 'No se encontraron causas con los filtros seleccionados' 
              : 'No tienes causas creadas'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter 
              ? 'Prueba con otros filtros o crea una nueva causa' 
              : 'Comienza creando tu primera campaña de recaudación'}
          </p>
          {!searchTerm && !statusFilter && (
            <Link
              href="/dashboard/crear-causa"
              className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Crear mi primera causa
            </Link>
          )}
          {(searchTerm || statusFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter(null);
              }}
              className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
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
                  
                  {cause.status === 'VERIFIED' && (
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
          
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{causes.length}</span> de <span className="font-medium">{totalItems}</span> causas
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                    >
                      <span className="sr-only">Anterior</span>
                      &lt;
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === currentPage
                          ? 'z-10 bg-gray-600 text-white focus-visible:outline-offset-2 focus-visible:outline-gray-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
                    >
                      <span className="sr-only">Siguiente</span>
                      &gt;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
