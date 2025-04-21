'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Donation {
  id: string;
  amount: number;
  message?: string;
  status: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  campaign: {
    id: string;
    title: string;
    slug: string;
  };
  donor: {
    id: string;
    fullName: string;
    email: string;
  };
}

export default function DonationsPage() {
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [causeFilter, setCauseFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [causes, setCauses] = useState<{id: string, title: string}[]>([]);

  useEffect(() => {
    // Verificar que el usuario sea BENEFICIARY
    if (user && user.role !== 'BENEFICIARY') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCauses = async () => {
      if (!isAuthenticated || !user || user.role !== 'BENEFICIARY') {
        console.log('No se cumplen las condiciones para obtener causas:', {
          isAuthenticated,
          userRole: user?.role
        });
        return;
      }
      
      try {
        console.log('Obteniendo token para fetchCauses...');
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
        console.log('Datos de causas recibidos:', data);
        
        // Verificar que data sea un array antes de usar map
        if (Array.isArray(data)) {
          setCauses(data.map((cause: any) => ({
            id: cause.id,
            title: cause.title
          })));
        } else if (data.items && Array.isArray(data.items)) {
          // Si la respuesta tiene un formato { items: [...] }
          setCauses(data.items.map((cause: any) => ({
            id: cause.id,
            title: cause.title
          })));
        } else {
          console.warn('La respuesta de causas no es un array:', data);
          setCauses([]);
        }
      } catch (err: any) {
        console.error('Error fetching causes:', err);
        // No mostramos el error en la UI para no confundir al usuario
      }
    };
    
    fetchCauses();
  }, [isAuthenticated, getToken, user?.role]);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!isAuthenticated || user?.role !== 'BENEFICIARY') return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No se encontró token de autenticación');
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        let url = `${baseUrl}donations/received?page=${currentPage}&limit=${itemsPerPage}`;
        
        // Añadir filtros si están presentes
        if (causeFilter) {
          url += `&campaignId=${causeFilter}`;
        }
        
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        if (startDate) {
          url += `&startDate=${startDate}`;
        }
        
        if (endDate) {
          url += `&endDate=${endDate}`;
        }
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener donaciones');
        }
        
        const data = await response.json();
        console.log('Respuesta de donaciones:', data);
        
        // Asegurarse de que data.items sea un array
        if (Array.isArray(data.items)) {
          setDonations(data.items);
        } else {
          console.warn('data.items no es un array:', data.items);
          setDonations([]);
        }
        
        // Extraer los metadatos de paginación con valores predeterminados seguros
        setTotalPages(data.meta?.totalPages || 1);
        setTotalItems(data.meta?.totalItems || 0);
        setItemsPerPage(data.meta?.itemsPerPage || 10);
        setError(null);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('No se pudieron cargar las donaciones. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonations();
  }, [isAuthenticated, getToken, currentPage, causeFilter, statusFilter, startDate, endDate, itemsPerPage, user?.role]);

  const handleCauseFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCauseFilter(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al filtrar
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Pendiente';
      case 'COMPLETED':
        return 'Completada';
      case 'FAILED':
        return 'Fallida';
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
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Donaciones</h1>
        <p className="text-gray-600">Gestiona las donaciones recibidas</p>
        {error && (
          <div className="mt-2">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => router.push('/auth/login')} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reiniciar sesión
            </button>
          </div>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="causeFilter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por campaña:</label>
          <select
            id="causeFilter"
            value={causeFilter}
            onChange={handleCauseFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Todas las campañas</option>
            {causes.map(cause => (
              <option key={cause.id} value={cause.id}>{cause.title}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="completed">Completada</option>
            <option value="failed">Fallida</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Desde:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Hasta:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Tabla de donaciones */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaña
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron donaciones
                      </td>
                    </tr>
                  ) : (
                    donations.map(donation => (
                      <tr key={donation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {donation.campaign.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.donor.fullName}
                          <div className="text-xs text-gray-400">{donation.donor.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(donation.amount)}
                          {donation.message && (
                            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate" title={donation.message}>
                              "{donation.message}"
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(donation.status)}`}>
                            {getStatusLabel(donation.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.paymentMethod ? donation.paymentMethod.replace('_', ' ') : '-'}
                          {donation.transactionId && (
                            <div className="text-xs text-gray-400 mt-1">
                              ID: {donation.transactionId.substring(0, 8)}...
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(donation.createdAt).toLocaleDateString()}
                          <div className="text-xs text-gray-400">
                            {new Date(donation.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {donations.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{donations.length}</span> de <span className="font-medium">{totalItems}</span> donaciones
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Anterior</span>
                        &lt;
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            page === currentPage
                              ? 'z-10 bg-primary border-primary text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Siguiente</span>
                        &gt;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
