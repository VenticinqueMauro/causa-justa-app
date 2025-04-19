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
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
}

export default function CausesManagementPage() {
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const [causes, setCauses] = useState<Cause[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    // Verificar que el usuario sea ADMIN
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCauses = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No se encontró token de autenticación');
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        let url = `${baseUrl}causes?page=${currentPage}&limit=10&search=${searchTerm}`;
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener causas');
        }
        
        const data = await response.json();
        setCauses(data.items || []);
        setTotalPages(data.meta?.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Error fetching causes:', err);
        setError('No se pudieron cargar las causas. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCauses();
  }, [isAuthenticated, getToken, currentPage, searchTerm, statusFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al buscar
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al filtrar
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = async (causeId: string, newStatus: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      const response = await fetch(`${baseUrl}causes/${causeId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la causa');
      }
      
      // Actualizar la lista de causas
      setCauses(causes.map(cause => 
        cause.id === causeId ? { ...cause, status: newStatus as any } : cause
      ));
    } catch (err) {
      console.error('Error updating cause status:', err);
      alert('No se pudo actualizar el estado de la causa. Intente nuevamente.');
    }
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  if (user?.role !== 'ADMIN') {
    return null; // No renderizar nada si no es admin
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Gestión de Causas</h1>
        <p className="text-gray-600">Administra y modera las causas de la plataforma</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar causas..."
            className="w-full p-2 border border-gray-300 rounded-md pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg
            className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="APPROVED">Aprobadas</option>
            <option value="REJECTED">Rechazadas</option>
            <option value="COMPLETED">Completadas</option>
          </select>
        </div>
      </div>

      {/* Tabla de causas */}
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
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recaudado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de creación
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {causes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron causas
                      </td>
                    </tr>
                  ) : (
                    causes.map((cause) => (
                      <tr key={cause.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {cause.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cause.owner.fullName}</div>
                          <div className="text-xs text-gray-500">{cause.owner.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(cause.goalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(cause.currentAmount)}
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${Math.min(100, (cause.currentAmount / cause.goalAmount) * 100)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                              cause.status
                            )}`}
                          >
                            {cause.status === 'PENDING' && 'Pendiente'}
                            {cause.status === 'APPROVED' && 'Aprobada'}
                            {cause.status === 'REJECTED' && 'Rechazada'}
                            {cause.status === 'COMPLETED' && 'Completada'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(cause.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            href={`/dashboard/causas/${cause.id}`}
                            className="text-primary hover:text-primary-dark mr-3"
                          >
                            Ver detalles
                          </Link>
                          {cause.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleStatusChange(cause.id, 'APPROVED')}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Aprobar
                              </button>
                              <button 
                                onClick={() => handleStatusChange(cause.id, 'REJECTED')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Rechazar
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
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
                    Mostrando <span className="font-medium">{causes.length}</span> causas
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
          </>
        )}
      </div>
    </div>
  );
}
