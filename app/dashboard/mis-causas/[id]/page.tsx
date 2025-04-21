'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

interface Campaign {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  goalAmount: number;
  currentAmount: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  slug?: string;
  category?: string;
  images?: string[];
  location?: {
    city: string;
    country: string;
    province: string;
  };
  recipient?: {
    age: number;
    name: string;
    condition: string;
  };
  creator?: {
    contact: string;
    relation: string;
  };
  publishedAt?: string | null;
  verificationNotes?: string | null;
  rejectionReason?: string | null;
  updates?: any | null;
  tags?: string[];
  isFeatured?: boolean;
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use() as recommended by Next.js 15
  const unwrappedParams = React.use(params);
  const { showToast } = useToast();
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(false);

  useEffect(() => {
    // Verificar que el usuario sea BENEFICIARY
    if (!isLoading && user && user.role !== 'BENEFICIARY') {
      router.push('/dashboard');
    }
  }, [user, router, isLoading]);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!isAuthenticated || !unwrappedParams.id) return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No se encontró token de autenticación');
        
        // Sincronizar token en cookies para evitar problemas de autenticación
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        // Usar el endpoint de campañas propias para beneficiarios
        const response = await fetch(`${baseUrl}campaigns/${unwrappedParams.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          // Si hay error de autenticación, intentar refrescar el token
          if (response.status === 401 || response.status === 403) {
            try {
              const refreshToken = localStorage.getItem('refresh_token');
              
              if (!refreshToken) {
                throw new Error('No hay refresh token disponible');
              }
              
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
                  // Guardar el nuevo token y reintentar
                  localStorage.setItem('auth_token', refreshData.access_token);
                  document.cookie = `token=${refreshData.access_token}; path=/; max-age=86400; SameSite=Lax`;
                  
                  // Si también se devuelve un nuevo refresh token, guardarlo
                  if (refreshData.refresh_token) {
                    localStorage.setItem('refresh_token', refreshData.refresh_token);
                    document.cookie = `refresh_token=${refreshData.refresh_token}; path=/; max-age=86400; SameSite=Lax`;
                  }
                  
                  showToast('Reautenticando, por favor espera...', 'info');
                  setTimeout(() => window.location.reload(), 1000);
                  return;
                }
              }
            } catch (refreshError) {
              console.error('Error al refrescar token:', refreshError);
            }
            
            showToast('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', 'error');
            setTimeout(() => router.push('/login'), 2000);
            return;
          }
          
          throw new Error(`Error al obtener detalles de la campaña: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificar que la campaña pertenezca al usuario actual
        if (data.userId !== user?.id) {
          showToast('No tienes permiso para ver esta campaña', 'error');
          router.push('/dashboard/mis-causas');
          return;
        }
        
        setCampaign(data);
        setError(null);
        
        // Cargar donaciones relacionadas con esta campaña (comentado hasta que el endpoint esté disponible)
        // fetchDonations(data.id, token, baseUrl);
        setDonationsLoading(false);
        setDonations([]);
        
      } catch (err: any) {
        console.error('Error fetching campaign details:', err);
        setError(`No se pudieron cargar los detalles de la campaña: ${err.message || 'Error desconocido'}`);
        showToast(`Error: ${err.message || 'No se pudieron cargar los detalles'}`, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated && user) {
      fetchCampaignDetails();
    }
  }, [isAuthenticated, getToken, unwrappedParams.id, user, router, showToast]);

  // Función para cargar donaciones (comentada hasta que el endpoint esté disponible)
  const fetchDonations = async (campaignId: string, token: string, baseUrl: string) => {
    try {
      setDonationsLoading(true);
      
      // Comentado hasta que el endpoint esté disponible en el backend
      // const response = await fetch(`${baseUrl}donations/campaign/${campaignId}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include',
      // });
      // 
      // if (!response.ok) {
      //   console.warn('No se pudieron cargar las donaciones');
      //   setDonations([]);
      //   return;
      // }
      // 
      // const data = await response.json();
      // setDonations(Array.isArray(data) ? data : data.items || []);
      
      // Por ahora, simplemente establecemos un array vacío
      // Esto se actualizará cuando el endpoint esté disponible
      setDonations([]);
      
    } catch (err) {
      console.error('Error fetching donations:', err);
      setDonations([]);
    } finally {
      setDonationsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'VERIFIED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verificada</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rechazada</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Completada</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (!user || user.role !== 'BENEFICIARY') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Detalles de Campaña</h1>
          <p className="text-gray-600">Gestiona tu campaña de recaudación</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/mis-causas"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Volver a mis causas
          </Link>
          
          {campaign && campaign.status === 'VERIFIED' && (
            <Link
              href={`/dashboard/mis-causas/${unwrappedParams.id}/editar`}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Editar campaña
            </Link>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      ) : campaign ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información básica */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{campaign.title}</h2>
                  <div>{getStatusBadge(campaign.status)}</div>
                </div>
                
                {/* Imágenes de la campaña */}
                {campaign.images && campaign.images.length > 0 ? (
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={campaign.images[0]}
                      alt={campaign.title}
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-6 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-gray-500">No hay imágenes disponibles</p>
                  </div>
                )}
                
                {/* Progreso de recaudación */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Progreso de recaudación</span>
                    <span>
                      {formatCurrency(campaign.currentAmount)} de {formatCurrency(campaign.goalAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}%
                  </div>
                </div>
                
                {/* Descripción */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                  <div className="prose max-w-none text-gray-700">
                    {campaign.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Información de la campaña</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><span className="font-medium">Creada el:</span> {formatDate(campaign.createdAt)}</li>
                      <li><span className="font-medium">Última actualización:</span> {formatDate(campaign.updatedAt)}</li>
                      <li><span className="font-medium">Categoría:</span> {campaign.category || 'No especificada'}</li>
                      {campaign.location && (
                        <li>
                          <span className="font-medium">Ubicación:</span> {campaign.location.city}, {campaign.location.province}, {campaign.location.country}
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {campaign.recipient && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Información del beneficiario</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li><span className="font-medium">Nombre:</span> {campaign.recipient.name}</li>
                        <li><span className="font-medium">Edad:</span> {campaign.recipient.age} años</li>
                        <li><span className="font-medium">Condición:</span> {campaign.recipient.condition}</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Notas de verificación o rechazo */}
                {campaign.status === 'VERIFIED' && campaign.verificationNotes && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Notas de verificación</h3>
                    <p className="text-green-700">{campaign.verificationNotes}</p>
                  </div>
                )}
                
                {campaign.status === 'REJECTED' && campaign.rejectionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Motivo de rechazo</h3>
                    <p className="text-red-700">{campaign.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Donaciones recibidas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Donaciones recibidas</h3>
                
                {donationsLoading ? (
                  <div className="flex justify-center items-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : donations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aún no has recibido donaciones para esta campaña</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Donante
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mensaje
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {donations.map((donation) => (
                          <tr key={donation.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(donation.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.anonymous ? 'Anónimo' : (donation.donor?.fullName || 'Donante')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(donation.amount)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {donation.message || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Resumen de la campaña */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Resumen</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Estado</span>
                    <span className="font-medium">{getStatusBadge(campaign.status)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Meta</span>
                    <span className="font-medium">{formatCurrency(campaign.goalAmount)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Recaudado</span>
                    <span className="font-medium">{formatCurrency(campaign.currentAmount)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Donaciones</span>
                    <span className="font-medium">{donations.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Porcentaje</span>
                    <span className="font-medium">{Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}%</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Acciones disponibles */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Acciones</h3>
                <div className="space-y-3">
                  {campaign.status === 'VERIFIED' && (
                    <Link
                      href={`/dashboard/mis-causas/${unwrappedParams.id}/editar`}
                      className="block w-full px-4 py-2 bg-primary text-white text-center rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Editar campaña
                    </Link>
                  )}
                  
                  <Link
                    href={`/causa/${campaign.slug || campaign.id}`}
                    className="block w-full px-4 py-2 bg-gray-700 text-white text-center rounded-md hover:bg-gray-600 transition-colors"
                    target="_blank"
                  >
                    Ver página pública
                  </Link>
                  
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/causa/${campaign.slug || campaign.id}`;
                      navigator.clipboard.writeText(url);
                      showToast('Enlace copiado al portapapeles', 'success');
                    }}
                    className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Copiar enlace
                  </button>
                </div>
              </div>
            </div>
            
            {/* Consejos */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Consejos</h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Comparte tu campaña en redes sociales para llegar a más personas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Mantén actualizada la información de tu campaña</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Agradece a tus donantes por su apoyo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Publica actualizaciones periódicas sobre el avance de tu causa</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-center">
          No se encontró la campaña solicitada
        </div>
      )}
    </div>
  );
}
