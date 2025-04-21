'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

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

interface FormData {
  title: string;
  shortDescription: string;
  description: string;
  goalAmount: number;
  category: string;
  // Ubicación
  city: string;
  province: string;
  country: string;
  // Beneficiario
  recipientName: string;
  recipientAge: number;
  recipientCondition: string;
  // Creador
  creatorContact: string;
  creatorRelation: string;
  // Imágenes - solo URLs por ahora
  images: string[];
}

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use() as recommended by Next.js 15
  const unwrappedParams = React.use(params);
  const { showToast } = useToast();
  const { user, isAuthenticated, getToken } = useAuth();
  const router = useRouter();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    shortDescription: '',
    description: '',
    goalAmount: 0,
    category: '',
    city: '',
    province: '',
    country: '',
    recipientName: '',
    recipientAge: 0,
    recipientCondition: '',
    creatorContact: '',
    creatorRelation: '',
    images: [''],
  });

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
          showToast('No tienes permiso para editar esta campaña', 'error');
          router.push('/dashboard/mis-causas');
          return;
        }
        
        // Verificar que la campaña esté verificada
        if (data.status !== 'VERIFIED') {
          showToast('Solo puedes editar campañas verificadas', 'error');
          router.push(`/dashboard/mis-causas/${unwrappedParams.id}`);
          return;
        }
        
        setCampaign(data);
        setError(null);
        
        // Inicializar el formulario con los datos de la campaña
        setFormData({
          title: data.title || '',
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          goalAmount: data.goalAmount || 0,
          category: data.category || '',
          city: data.location?.city || '',
          province: data.location?.province || '',
          country: data.location?.country || '',
          recipientName: data.recipient?.name || '',
          recipientAge: data.recipient?.age || 0,
          recipientCondition: data.recipient?.condition || '',
          creatorContact: data.creator?.contact || '',
          creatorRelation: data.creator?.relation || '',
          images: data.images?.length ? data.images : [''],
        });
        
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'goalAmount' || name === 'recipientAge') {
      // Convertir a número para campos numéricos
      setFormData({
        ...formData,
        [name]: value ? parseFloat(value) : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length <= 1) return;
    
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !campaign) return;
    
    try {
      setIsSaving(true);
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      // Preparar los datos para enviar al backend
      const campaignData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        goalAmount: formData.goalAmount,
        category: formData.category,
        location: {
          city: formData.city,
          province: formData.province,
          country: formData.country,
        },
        recipient: {
          name: formData.recipientName,
          age: formData.recipientAge,
          condition: formData.recipientCondition,
        },
        creator: {
          contact: formData.creatorContact,
          relation: formData.creatorRelation,
        },
        images: formData.images.filter(img => img.trim() !== ''),
      };
      
      const response = await fetch(`${baseUrl}campaigns/${unwrappedParams.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
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
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al actualizar la campaña: ${response.status}`);
      }
      
      showToast('Campaña actualizada con éxito', 'success');
      router.push(`/dashboard/mis-causas/${unwrappedParams.id}`);
      
    } catch (err: any) {
      console.error('Error updating campaign:', err);
      setError(`No se pudo actualizar la campaña: ${err.message || 'Error desconocido'}`);
      showToast(`Error: ${err.message || 'No se pudo actualizar la campaña'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || user.role !== 'BENEFICIARY') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Editar Campaña</h1>
          <p className="text-gray-600">Actualiza la información de tu campaña</p>
        </div>
        <div>
          <Link
            href={`/dashboard/mis-causas/${unwrappedParams.id}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </Link>
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
        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg shadow-md p-6">
          {/* Información básica */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Información básica</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título de la campaña *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Título descriptivo y conciso"
                />
              </div>
              
              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción corta *
                </label>
                <input
                  type="text"
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Resumen breve de tu campaña (máx. 150 caracteres)"
                  maxLength={150}
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción completa *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Describe detalladamente tu campaña, incluyendo para qué se utilizarán los fondos"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta de recaudación (ARS) *
                  </label>
                  <input
                    type="number"
                    id="goalAmount"
                    name="goalAmount"
                    value={formData.goalAmount}
                    onChange={handleInputChange}
                    required
                    min={1}
                    step={0.01}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Ej: 100000"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="HEALTH">Salud</option>
                    <option value="EDUCATION">Educación</option>
                    <option value="FOOD">Alimentación</option>
                    <option value="PEOPLE">Personas</option>
                    <option value="OTHERS">Otras</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ubicación */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Ubicación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Ej: Buenos Aires"
                />
              </div>
              
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia *
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Ej: Buenos Aires"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  País *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Ej: Argentina"
                />
              </div>
            </div>
          </div>
          
          {/* Información del beneficiario */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Información del beneficiario</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Nombre del beneficiario"
                />
              </div>
              
              <div>
                <label htmlFor="recipientAge" className="block text-sm font-medium text-gray-700 mb-1">
                  Edad *
                </label>
                <input
                  type="number"
                  id="recipientAge"
                  name="recipientAge"
                  value={formData.recipientAge}
                  onChange={handleInputChange}
                  required
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Edad del beneficiario"
                />
              </div>
              
              <div>
                <label htmlFor="recipientCondition" className="block text-sm font-medium text-gray-700 mb-1">
                  Condición *
                </label>
                <input
                  type="text"
                  id="recipientCondition"
                  name="recipientCondition"
                  value={formData.recipientCondition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Ej: Tratamiento médico, situación actual"
                />
              </div>
            </div>
          </div>
          
          {/* Información del creador */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Información del creador</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="creatorContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contacto *
                </label>
                <input
                  type="text"
                  id="creatorContact"
                  name="creatorContact"
                  value={formData.creatorContact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Teléfono o email de contacto"
                />
              </div>
              
              <div>
                <label htmlFor="creatorRelation" className="block text-sm font-medium text-gray-700 mb-1">
                  Relación con el beneficiario *
                </label>
                <input
                  type="text"
                  id="creatorRelation"
                  name="creatorRelation"
                  value={formData.creatorRelation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Ej: Familiar, amigo, organización"
                />
              </div>
            </div>
          </div>
          
          {/* Imágenes */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Imágenes</h2>
            
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="URL de la imagen"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    title="Eliminar imagen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addImageField}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar imagen
              </button>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
              href={`/dashboard/mis-causas/${unwrappedParams.id}`}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </Link>
            
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 bg-primary text-white rounded-md bg-gray-700 hover:bg-gray-900 transition-colors ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-center">
          No se encontró la campaña solicitada
        </div>
      )}
    </div>
  );
}
