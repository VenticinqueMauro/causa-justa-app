'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Iconos para las tarjetas
const ProfileIcon = () => (
  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);

const CausesIcon = () => (
  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
  </svg>
);

const CreateIcon = () => (
  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
);

const DonationsIcon = () => (
  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
  </svg>
);

const UsersIcon = () => (
  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);

const StatsIcon = () => (
  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
  </svg>
);

interface QuickStatProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const QuickStat: React.FC<QuickStatProps> = ({ title, value, icon, color }) => {
  // Mapear colores de fondo a colores de texto para asegurar contraste
  const getTextColor = (bgColor: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-50': 'text-gray-700',
      'bg-green-50': 'text-green-600',
      'bg-yellow-50': 'text-yellow-600',
      'bg-purple-50': 'text-purple-600',
      'bg-indigo-50': 'text-indigo-600',
      'bg-red-50': 'text-red-600',
    };
    return colorMap[bgColor] || 'text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color} ${getTextColor(color)}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
  color: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, linkText, linkHref, color }) => {
  // Mapear colores de fondo a colores de texto para asegurar contraste
  const getTextColor = (bgColor: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-50': 'text-gray-700',
      'bg-green-50': 'text-green-600',
      'bg-yellow-50': 'text-yellow-600',
      'bg-purple-50': 'text-purple-600',
      'bg-indigo-50': 'text-indigo-600',
      'bg-red-50': 'text-red-600',
    };
    return colorMap[bgColor] || 'text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className={`w-12 h-12 rounded-lg ${color} ${getTextColor(color)} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <Link 
          href={linkHref} 
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
        >
          {linkText}
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user, getToken } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCauses: 0,
    totalDonations: 0,
    pendingCauses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const token = await getToken();
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        console.log('Fetching stats for role:', user.role);
        console.log('API URL:', baseUrl);
        
        // Para ADMIN, obtener estadísticas de la plataforma
        if (user.role === 'ADMIN') {
          try {
            const url = `${baseUrl}statistics/platform`;
            console.log('Fetching from URL:', url);
            
            const response = await fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            console.log('Response status:', response.status);
            
            if (response.ok) {
              const data = await response.json();
              console.log('Received data:', data);
              
              // Verificar la estructura de datos
              const totalUsers = data.totalUsers !== undefined ? data.totalUsers : 
                                (data.data?.totalUsers !== undefined ? data.data.totalUsers : 0);
              
              const totalCampaigns = data.totalCampaigns !== undefined ? data.totalCampaigns : 
                                    (data.data?.totalCampaigns !== undefined ? data.data.totalCampaigns : 0);
              
              const totalDonations = data.totalDonations !== undefined ? data.totalDonations : 
                                    (data.data?.totalDonations !== undefined ? data.data.totalDonations : 0);
              
              const pendingCampaigns = data.pendingCampaigns !== undefined ? data.pendingCampaigns : 
                                      (data.data?.pendingCampaigns !== undefined ? data.data.pendingCampaigns : 0);
              
              console.log('Processed stats:', { totalUsers, totalCampaigns, totalDonations, pendingCampaigns });
              
              setStats({
                totalUsers: totalUsers,
                totalCauses: totalCampaigns,
                totalDonations: totalDonations,
                pendingCauses: pendingCampaigns,
              });
            } else {
              console.error('Error fetching platform statistics, status:', response.status);
              try {
                const errorData = await response.text();
                console.error('Error response:', errorData);
              } catch (e) {
                console.error('Could not parse error response');
              }
              
              setStats({
                totalUsers: 0,
                totalCauses: 0,
                totalDonations: 0,
                pendingCauses: 0
              });
            }
          } catch (error) {
            console.error('Error fetching stats:', error);
            setStats({
              totalUsers: 0,
              totalCauses: 0,
              totalDonations: 0,
              pendingCauses: 0
            });
          }
        } 
        // Para BENEFICIARY, obtener estadísticas del beneficiario
        else if (user.role === 'BENEFICIARY') {
          try {
            const statsUrl = `${baseUrl}statistics/beneficiary`;
            const campaignsUrl = `${baseUrl}campaigns/my`;
            
            console.log('Fetching from URLs:', { statsUrl, campaignsUrl });
            
            const statsResponse = await fetch(statsUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            const campaignsResponse = await fetch(campaignsUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            console.log('Response status:', { 
              stats: statsResponse.status, 
              campaigns: campaignsResponse.status 
            });
            
            if (statsResponse.ok && campaignsResponse.ok) {
              const statsData = await statsResponse.json();
              const campaignsData = await campaignsResponse.json();
              
              console.log('Received data:', { statsData, campaignsData });
              
              // Verificar si campaignsData es un array o tiene una propiedad items
              const campaigns = Array.isArray(campaignsData) ? campaignsData : 
                               (campaignsData.items ? campaignsData.items : []);
              
              // Verificar la estructura de datos para totalDonationsReceived
              const totalDonations = statsData.totalDonationsReceived !== undefined ? statsData.totalDonationsReceived : 
                                    (statsData.data?.totalDonationsReceived !== undefined ? statsData.data.totalDonationsReceived : 0);
              
              const pendingCampaigns = campaigns.filter((c: any) => c.status === 'PENDING').length || 0;
              
              console.log('Processed stats:', { 
                totalCauses: campaigns.length, 
                totalDonations, 
                pendingCampaigns 
              });
              
              setStats({
                totalUsers: 0,
                totalCauses: campaigns.length || 0,
                totalDonations: totalDonations,
                pendingCauses: pendingCampaigns,
              });
            } else {
              console.error('Error fetching beneficiary statistics');
              try {
                if (!statsResponse.ok) {
                  const errorData = await statsResponse.text();
                  console.error('Stats error response:', errorData);
                }
                if (!campaignsResponse.ok) {
                  const errorData = await campaignsResponse.text();
                  console.error('Campaigns error response:', errorData);
                }
              } catch (e) {
                console.error('Could not parse error response');
              }
              
              setStats({
                totalUsers: 0,
                totalCauses: 0,
                totalDonations: 0,
                pendingCauses: 0
              });
            }
          } catch (error) {
            console.error('Error fetching beneficiary data:', error);
            setStats({
              totalUsers: 0,
              totalCauses: 0,
              totalDonations: 0,
              pendingCauses: 0
            });
          }
        } 
        // Para DONOR, obtener estadísticas del donante
        else if (user.role === 'DONOR') {
          try {
            const url = `${baseUrl}donations/made`;
            console.log('Fetching from URL:', url);
            
            const response = await fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            console.log('Response status:', response.status);
            
            if (response.ok) {
              const data = await response.json();
              console.log('Received data:', data);
              
              // Verificar si data tiene una propiedad items
              const donations = Array.isArray(data) ? data : 
                               (data.items ? data.items : []);
              
              // Calcular estadísticas del donante
              const totalDonated = donations.reduce((sum: number, donation: any) => sum + donation.amount, 0);
              const uniqueCampaignsSet = new Set(
                donations.map((donation: any) => {
                  return donation.campaign?.id || donation.campaignId || 'unknown';
                })
              );
              const uniqueCampaigns = uniqueCampaignsSet.size;
              
              console.log('Processed stats:', { 
                totalDonated, 
                uniqueCampaigns, 
                totalDonations: donations.length 
              });
              
              setStats({
                totalUsers: 0,
                totalCauses: uniqueCampaigns,
                totalDonations: donations.length,
                pendingCauses: 0,
              });
            } else {
              console.error('Error fetching donor statistics, status:', response.status);
              try {
                const errorData = await response.text();
                console.error('Error response:', errorData);
              } catch (e) {
                console.error('Could not parse error response');
              }
              
              setStats({
                totalUsers: 0,
                totalCauses: 0,
                totalDonations: 0,
                pendingCauses: 0
              });
            }
          } catch (error) {
            console.error('Error fetching donor data:', error);
            setStats({
              totalUsers: 0,
              totalCauses: 0,
              totalDonations: 0,
              pendingCauses: 0
            });
          }
        } else {
          // Para otros roles
          console.log('Unknown role, setting empty stats');
          setStats({
            totalUsers: 0,
            totalCauses: 0,
            totalDonations: 0,
            pendingCauses: 0
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user, getToken]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Encabezado con saludo personalizado */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">¡Bienvenido, {user?.fullName || 'Usuario'}!</h1>
        <p className="mt-1 text-sm text-gray-500">
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user?.role === 'ADMIN' && (
            <>
              <QuickStat 
                title="Usuarios Totales" 
                value={isLoading ? '...' : stats.totalUsers} 
                icon={<UsersIcon />} 
                color="bg-blue-50" 
              />
              <QuickStat 
                title="Causas Totales" 
                value={isLoading ? '...' : stats.totalCauses} 
                icon={<CausesIcon />} 
                color="bg-green-50" 
              />
              <QuickStat 
                title="Donaciones" 
                value={isLoading ? '...' : stats.totalDonations} 
                icon={<DonationsIcon />} 
                color="bg-purple-50" 
              />
              <QuickStat 
                title="Causas Pendientes" 
                value={isLoading ? '...' : stats.pendingCauses} 
                icon={<CreateIcon />} 
                color="bg-yellow-50" 
              />
            </>
          )}

          {user?.role === 'BENEFICIARY' && (
            <>
              <QuickStat 
                title="Mis Causas" 
                value={isLoading ? '...' : stats.totalCauses} 
                icon={<CausesIcon />} 
                color="bg-green-50" 
              />
              <QuickStat 
                title="Donaciones Recibidas" 
                value={isLoading ? '...' : stats.totalDonations} 
                icon={<DonationsIcon />} 
                color="bg-purple-50" 
              />
              <QuickStat 
                title="Causas Pendientes" 
                value={isLoading ? '...' : stats.pendingCauses} 
                icon={<CreateIcon />} 
                color="bg-yellow-50" 
              />
              <QuickStat 
                title="Recaudación Estimada" 
                value={isLoading ? '...' : formatCurrency(stats.totalDonations * 1000)} 
                icon={<StatsIcon />} 
                color="bg-indigo-50" 
              />
            </>
          )}

          {user?.role === 'DONOR' && (
            <>
              <QuickStat 
                title="Mis Donaciones" 
                value={isLoading ? '...' : 0} 
                icon={<DonationsIcon />} 
                color="bg-purple-50" 
              />
              <QuickStat 
                title="Causas Apoyadas" 
                value={isLoading ? '...' : 0} 
                icon={<CausesIcon />} 
                color="bg-green-50" 
              />
              <QuickStat 
                title="Donación Total" 
                value={isLoading ? '...' : formatCurrency(0)} 
                icon={<StatsIcon />} 
                color="bg-indigo-50" 
              />
              <QuickStat 
                title="Causas Activas" 
                value={isLoading ? '...' : 0} 
                icon={<CreateIcon />} 
                color="bg-yellow-50" 
              />
            </>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta común para todos los usuarios */}
          <ActionCard 
            title="Mi Perfil" 
            description="Gestiona tu información personal y preferencias de cuenta" 
            icon={<ProfileIcon />} 
            linkText="Ir a mi perfil" 
            linkHref="/dashboard/perfil" 
            color="bg-blue-50" 
          />

          {/* Tarjetas específicas para BENEFICIARY */}
          {user?.role === 'BENEFICIARY' && (
            <>
              <ActionCard 
                title="Mis Causas" 
                description="Administra tus campañas de recaudación activas" 
                icon={<CausesIcon />} 
                linkText="Ver mis causas" 
                linkHref="/dashboard/mis-causas" 
                color="bg-green-50" 
              />
              <ActionCard 
                title="Crear Nueva Causa" 
                description="Inicia una nueva campaña de recaudación de fondos" 
                icon={<CreateIcon />} 
                linkText="Crear causa" 
                linkHref="/dashboard/crear-causa" 
                color="bg-yellow-50" 
              />
              <ActionCard 
                title="Donaciones Recibidas" 
                description="Revisa todas las donaciones recibidas en tus causas" 
                icon={<DonationsIcon />} 
                linkText="Ver donaciones" 
                linkHref="/dashboard/donaciones" 
                color="bg-purple-50" 
              />
            </>
          )}

          {/* Tarjetas específicas para ADMIN */}
          {user?.role === 'ADMIN' && (
            <>
              <ActionCard 
                title="Gestión de Usuarios" 
                description="Administra los usuarios registrados en la plataforma" 
                icon={<UsersIcon />} 
                linkText="Administrar usuarios" 
                linkHref="/dashboard/usuarios" 
                color="bg-indigo-50" 
              />
              <ActionCard 
                title="Gestión de Causas" 
                description="Revisa y modera las causas creadas por los beneficiarios" 
                icon={<CausesIcon />} 
                linkText="Administrar causas" 
                linkHref="/dashboard/causas" 
                color="bg-green-50" 
              />
              <ActionCard 
                title="Estadísticas" 
                description="Analiza el rendimiento general de la plataforma" 
                icon={<StatsIcon />} 
                linkText="Ver estadísticas" 
                linkHref="/dashboard/estadisticas" 
                color="bg-purple-50" 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
