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
  user: {
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
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    // Verificar que el usuario sea ADMIN
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!isAuthenticated || !unwrappedParams.id) return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No se encontró token de autenticación');
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        const response = await fetch(`${baseUrl}campaigns/admin/${unwrappedParams.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener detalles de la campaña');
        }
        
        const data = await response.json();
        setCampaign(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching campaign details:', err);
        setError('No se pudieron cargar los detalles de la campaña. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCampaignDetails();
  }, [isAuthenticated, getToken, unwrappedParams.id]);

  const handleVerifyCampaign = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      const response = await fetch(`${baseUrl}campaigns/${unwrappedParams.id}/verify`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationNotes: verificationNotes
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al verificar la campaña');
      }
      
      // Actualizar el estado de la campaña localmente
      setCampaign(prev => prev ? { ...prev, status: 'VERIFIED', verificationNotes } : null);
      setShowVerificationModal(false);
      
      // Mostrar mensaje de éxito
      showToast('Campaña verificada exitosamente', 'success');
    } catch (err) {
      console.error('Error verifying campaign:', err);
      showToast('No se pudo verificar la campaña. Intente nuevamente.', 'error');
    }
  };

  const handleRejectCampaign = async () => {
    if (!rejectionReason.trim()) {
      showToast('Por favor, ingrese un motivo de rechazo', 'error');
      return;
    }
    
    try {
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      const response = await fetch(`${baseUrl}campaigns/${unwrappedParams.id}/reject`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al rechazar la campaña');
      }
      
      // Actualizar el estado de la campaña localmente
      setCampaign(prev => prev ? { ...prev, status: 'REJECTED', rejectionReason } : null);
      setShowRejectionModal(false);
      
      // Mostrar mensaje de éxito
      showToast('Campaña rechazada exitosamente', 'success');
    } catch (err) {
      console.error('Error rejecting campaign:', err);
      showToast('No se pudo rechazar la campaña. Intente nuevamente.', 'error');
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, text: string }> = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      'VERIFIED': { color: 'bg-green-100 text-green-800', text: 'Verificada' },
      'REJECTED': { color: 'bg-red-100 text-red-800', text: 'Rechazada' },
      'COMPLETED': { color: 'bg-blue-100 text-blue-800', text: 'Completada' },
    };
    
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  if (user?.role !== 'ADMIN') {
    return null; // No renderizar nada si no es admin
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Detalles de la Campaña</h1>
          <p className="text-gray-600">Revisa y gestiona esta campaña</p>
        </div>
        <Link 
          href="/dashboard/causas" 
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center"
        >
          <span className="mr-2">←</span> Volver a la lista
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
        </div>
      ) : campaign ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{campaign.title}</h2>
                  {getStatusBadge(campaign.status)}
                </div>
                
                {campaign.images && campaign.images.length > 0 && (
                  <div className="relative h-80 w-full mb-6 rounded-lg overflow-hidden">
                    <Image 
                      src={campaign.images[0]} 
                      alt={campaign.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                    />
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-line">{campaign.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Meta de recaudación</h3>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(campaign.goalAmount)}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Recaudado: {formatCurrency(campaign.currentAmount)} 
                      ({Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}%)
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Categoría</h3>
                    <p className="text-gray-700">{campaign.category || 'No especificada'}</p>
                    
                    {campaign.tags && campaign.tags.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Etiquetas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {campaign.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {campaign.location && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Ubicación</h3>
                    <p className="text-gray-700">
                      {campaign.location.city}, {campaign.location.province}, {campaign.location.country}
                    </p>
                  </div>
                )}
                
                {campaign.recipient && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Beneficiario</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{campaign.recipient.name}</p>
                      <p className="text-gray-700">Edad: {campaign.recipient.age} años</p>
                      <p className="text-gray-700">Condición: {campaign.recipient.condition}</p>
                    </div>
                  </div>
                )}
                
                {campaign.creator && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Creador de la campaña</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">Relación con el beneficiario: {campaign.creator.relation}</p>
                      <p className="text-gray-700">Contacto: {campaign.creator.contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Columna derecha - Información del usuario y acciones */}
          <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Información del usuario</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="font-medium">{campaign.user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{campaign.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID de usuario</p>
                    <p className="font-medium">{campaign.userId}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Información de la campaña</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">ID de campaña</p>
                    <p className="font-medium">{campaign.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha de creación</p>
                    <p className="font-medium">{formatDate(campaign.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Última actualización</p>
                    <p className="font-medium">{formatDate(campaign.updatedAt)}</p>
                  </div>
                  {campaign.publishedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Fecha de publicación</p>
                      <p className="font-medium">{formatDate(campaign.publishedAt)}</p>
                    </div>
                  )}
                  {campaign.slug && (
                    <div>
                      <p className="text-sm text-gray-500">Slug</p>
                      <p className="font-medium">{campaign.slug}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {campaign.status === 'PENDING' && (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Acciones</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowVerificationModal(true)}
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md cursor-pointer"
                    >
                      Verificar campaña
                    </button>
                    <button
                      onClick={() => setShowRejectionModal(true)}
                      className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md cursor-pointer"
                    >
                      Rechazar campaña
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {campaign.status === 'VERIFIED' && campaign.verificationNotes && (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Notas de verificación</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="whitespace-pre-line text-green-800">{campaign.verificationNotes}</p>
                  </div>
                </div>
              </div>
            )}
            
            {campaign.status === 'REJECTED' && campaign.rejectionReason && (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Motivo de rechazo</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="whitespace-pre-line text-red-800">{campaign.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-center">
          No se encontró la campaña solicitada
        </div>
      )}
      
      {/* Modal de verificación */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Verificar campaña</h3>
              <p className="mb-4 text-gray-700">
                Estás a punto de verificar esta campaña. Una vez verificada, será visible para todos los usuarios.
              </p>
              <div className="mb-4">
                <label htmlFor="verificationNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notas de verificación (opcional)
                </label>
                <textarea
                  id="verificationNotes"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  rows={4}
                  placeholder="Ingrese notas o comentarios sobre la verificación..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleVerifyCampaign}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md cursor-pointer"
                >
                  Confirmar verificación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de rechazo */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Rechazar campaña</h3>
              <p className="mb-4 text-gray-700">
                Estás a punto de rechazar esta campaña. Por favor, proporciona un motivo para el rechazo.
              </p>
              <div className="mb-4">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de rechazo *
                </label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  rows={4}
                  placeholder="Ingrese el motivo del rechazo..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRejectCampaign}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Confirmar rechazo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
