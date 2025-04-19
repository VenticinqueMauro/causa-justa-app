'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Donation {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  cause: {
    id: string;
    title: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [causeFilter, setCauseFilter] = useState<string>('');
  const [causes, setCauses] = useState<{id: string, title: string}[]>([]);

  useEffect(() => {
    // Verificar que el usuario sea BENEFICIARY
    if (user && user.role !== 'BENEFICIARY') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCauses = async () => {
      if (!isAuthenticated || user?.role !== 'BENEFICIARY') return;
      
      try {
        const token = await getToken();
        if (!token) throw new Error('No se encontró token de autenticación');
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        const response = await fetch(`${baseUrl}causes/my-causes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener causas');
        }
        
        const data = await response.json();
        setCauses(data.map((cause: any) => ({
          id: cause.id,
          title: cause.title
        })));
      } catch (err) {
        console.error('Error fetching causes:', err);
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
        
        let url = `${baseUrl}donations/received?page=${currentPage}&limit=10`;
        if (causeFilter) {
          url += `&causeId=${causeFilter}`;
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
        setDonations(data.items || []);
        setTotalPages(data.meta?.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('No se pudieron cargar las donaciones. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonations();
  }, [isAuthenticated, getToken, currentPage, causeFilter, user?.role]);

  const handleCauseFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCauseFilter(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al filtrar
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
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
        <h1 className="text-3xl font-bold">Donaciones Recibidas</h1>
        <p className="text-gray-600">Administra las donaciones recibidas en tus causas</p>
      </div>

      {/* Filtros */}
      <div className="flex justify-between items-center">
        <div className="w-64">
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={causeFilter}
            onChange={handleCauseFilterChange}
          >
            <option value="">Todas las causas</option>
            {causes.map((cause) => (
              <option key={cause.id} value={cause.id}>
                {cause.title}
              </option>
            ))}
          </select>
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
                      Causa
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
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron donaciones
                      </td>
                    </tr>
                  ) : (
                    donations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            href={`/dashboard/mis-causas/${donation.cause.id}`}
                            className="text-primary hover:text-primary-dark"
                          >
                            {donation.cause.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{donation.donor.fullName}</div>
                          <div className="text-xs text-gray-500">{donation.donor.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(donation.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                              donation.status
                            )}`}
                          >
                            {donation.status === 'PENDING' && 'Pendiente'}
                            {donation.status === 'COMPLETED' && 'Completada'}
                            {donation.status === 'FAILED' && 'Fallida'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(donation.createdAt).toLocaleDateString()}
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
                      Mostrando <span className="font-medium">{donations.length}</span> donaciones
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
