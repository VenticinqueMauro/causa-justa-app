'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface StatsSummary {
  totalUsers: number;
  totalCauses: number;
  totalDonations: number;
  totalAmountRaised: number;
  usersByRole: {
    ADMIN: number;
    BENEFICIARY: number;
    DONOR: number;
  };
  causesByStatus: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
    COMPLETED: number;
  };
  donationsByMonth: {
    month: string;
    count: number;
    amount: number;
  }[];
}

export default function StatsPage() {
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsSummary | null>(null);

  useEffect(() => {
    // Verificar que el usuario sea ADMIN
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || user?.role !== 'ADMIN') return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No se encontró token de autenticación');
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        const response = await fetch(`${baseUrl}admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener estadísticas');
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('No se pudieron cargar las estadísticas. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [isAuthenticated, getToken, user?.role]);

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
        <h1 className="text-3xl font-bold">Estadísticas</h1>
        <p className="text-gray-600">Análisis del rendimiento de la plataforma</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      ) : stats ? (
        <>
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Usuarios totales</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Causas totales</h3>
              <p className="text-3xl font-bold">{stats.totalCauses}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Donaciones realizadas</h3>
              <p className="text-3xl font-bold">{stats.totalDonations}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Monto total recaudado</h3>
              <p className="text-3xl font-bold">{formatCurrency(stats.totalAmountRaised)}</p>
            </div>
          </div>

          {/* Distribución de usuarios por rol */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Usuarios por rol</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Administradores</span>
                    <span className="text-sm text-gray-500">{stats.usersByRole.ADMIN}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${(stats.usersByRole.ADMIN / stats.totalUsers) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Beneficiarios</span>
                    <span className="text-sm text-gray-500">{stats.usersByRole.BENEFICIARY}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${(stats.usersByRole.BENEFICIARY / stats.totalUsers) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Donantes</span>
                    <span className="text-sm text-gray-500">{stats.usersByRole.DONOR}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{
                        width: `${(stats.usersByRole.DONOR / stats.totalUsers) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Causas por estado */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Causas por estado</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Pendientes</span>
                    <span className="text-sm text-gray-500">{stats.causesByStatus.PENDING}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{
                        width: `${(stats.causesByStatus.PENDING / stats.totalCauses) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Aprobadas</span>
                    <span className="text-sm text-gray-500">{stats.causesByStatus.APPROVED}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{
                        width: `${(stats.causesByStatus.APPROVED / stats.totalCauses) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Rechazadas</span>
                    <span className="text-sm text-gray-500">{stats.causesByStatus.REJECTED}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-500 h-2.5 rounded-full"
                      style={{
                        width: `${(stats.causesByStatus.REJECTED / stats.totalCauses) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Completadas</span>
                    <span className="text-sm text-gray-500">{stats.causesByStatus.COMPLETED}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${(stats.causesByStatus.COMPLETED / stats.totalCauses) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donaciones por mes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Donaciones por mes</h2>
            {stats.donationsByMonth.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay datos disponibles</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad de donaciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.donationsByMonth.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-md text-gray-600 text-center">
          No hay datos disponibles
        </div>
      )}
    </div>
  );
}
