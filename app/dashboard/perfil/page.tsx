'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

interface ProfileForm {
  fullName: string;
  email: string;
  cuitOrDni: string;
  phone: string;
  location: string;
  profilePicture?: string | null;
}

export default function ProfilePage() {
  const { showToast } = useToast();
  const { user, isAuthenticated, getToken, updateUserData } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    email: '',
    cuitOrDni: '',
    phone: '',
    location: '',
    profilePicture: null,
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState<boolean>(false);
  const [isResendingVerification, setIsResendingVerification] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Cargar el perfil del usuario cuando el componente se monta
      fetchUserProfile();
    }
  }, [isAuthenticated, router]);

  // Efecto para depurar cuando profilePicture cambia
  useEffect(() => {
    console.log('Estado de profilePicture actualizado:', profilePicture);
  }, [profilePicture]);

  // Efecto para mostrar la foto de perfil en la consola cuando cambia
  useEffect(() => {
    if (profilePicture) {
      console.log('Foto de perfil actualizada:', profilePicture);
    }
  }, [profilePicture]);

  // Definir fetchUserProfile fuera del useEffect para poder llamarlo desde otros lugares
  const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No se encontró token de autenticación');
        
        const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
        const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
        
        const response = await fetch(`${baseUrl}profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener perfil de usuario');
        }
        
        const data = await response.json();
        console.log('Perfil obtenido:', data);
        setUserProfile(data);
        setForm({
          fullName: data.fullName || '',
          email: data.email || '',
          cuitOrDni: data.cuitOrDni || '',
          phone: data.phone || '',
          location: data.location || '',
          profilePicture: data.profilePicture || null,
        });
        
        // Manejar correctamente la foto de perfil
        if (data.profilePicture) {
          console.log('Foto de perfil encontrada:', data.profilePicture);
          
          // Verificar si la URL es relativa o absoluta
          if (!data.profilePicture.startsWith('http')) {
            const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
            const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
            const fullUrl = `${baseUrl}${data.profilePicture.startsWith('/') ? data.profilePicture.substring(1) : data.profilePicture}`;
            console.log('Convirtiendo URL relativa a absoluta:', fullUrl);
            setProfilePicture(fullUrl);
          } else {
            setProfilePicture(data.profilePicture);
          }
        } else {
          console.log('No se encontró foto de perfil');
          setProfilePicture(null);
        }
        
        // Mostrar mensaje de verificación si el usuario no está verificado
        if (data.verified === false) {
          setShowVerificationMessage(true);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('No se pudo cargar tu perfil. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
  };
  
  // Llamar a fetchUserProfile cuando cambie getToken
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [getToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      // Determinar qué endpoint usar según el rol del usuario
      let endpoint = 'profile';
      if (user?.role === 'BENEFICIARY') {
        endpoint = 'profile/beneficiary';
      } else if (user?.role === 'DONOR') {
        endpoint = 'profile/donor';
      }
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          location: form.location,
          ...(user?.role === 'BENEFICIARY' ? { cuitOrDni: form.cuitOrDni } : {}),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar perfil');
      }
      
      const data = await response.json();
      setUserProfile(data);
      setSuccess('Perfil actualizado correctamente');
      setIsSaving(false);
      showToast('Perfil actualizado con éxito', 'success');
      setError('');
      
      // Actualizar el contexto de autenticación con los nuevos datos
      updateUserData({
        fullName: form.fullName,
        email: form.email,
        // No actualizamos cuitOrDni, phone y location en el contexto porque no son parte de la interfaz User
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'No se pudo actualizar el perfil. Intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen no debe superar los 2MB');
        return;
      }
      
      // Validar formato
      const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validFormats.includes(file.type)) {
        setError('Formato de imagen no válido. Use JPG, PNG o WebP');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      
      // Previsualización
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadProfilePicture = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${baseUrl}profile/picture`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const data = JSON.parse(xhr.responseText);
          const imageUrl = data.profilePicture;
          setProfilePicture(imageUrl);
          setIsUploading(false);
          setUploadProgress(0);
          
          // Actualizar el contexto de autenticación con la nueva foto de perfil
          updateUserData({ profilePicture: imageUrl });
          
          showToast('Foto de perfil actualizada con éxito', 'success');
        } else {
          setError('Error al subir la imagen. Intente nuevamente.');
        }
        setIsUploading(false);
      };
      
      xhr.onerror = () => {
        setError('Error de conexión. Intente nuevamente.');
        setIsUploading(false);
      };
      
      xhr.send(formData);
    } catch (err: any) {
      console.error('Error uploading profile picture:', err);
      setError(err.message || 'No se pudo subir la imagen. Intente nuevamente.');
      setIsUploading(false);
    }
  };
  
  const handleResendVerification = async () => {
    try {
      setIsResendingVerification(true);
      setError(null);
      
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      const response = await fetch(`${baseUrl}auth/resend-verification`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al reenviar correo de verificación');
      }
      
      setSuccess('Se ha enviado un nuevo correo de verificación a tu dirección de email');
    } catch (err: any) {
      console.error('Error resending verification:', err);
      setError(err.message || 'No se pudo reenviar el correo de verificación. Intente nuevamente.');
    } finally {
      setIsResendingVerification(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y preferencias de cuenta</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Información Personal</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Foto de perfil */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full border-2 border-[#002C5B] overflow-hidden bg-white">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Si hay error al cargar la imagen, mostrar icono por defecto
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const icon = document.createElement('div');
                              icon.className = 'w-full h-full flex items-center justify-center bg-gray-100';
                              icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#002C5B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                              parent.appendChild(icon);
                            }
                          }}
                        />
                      ) : form.profilePicture ? (
                        <img
                          src={form.profilePicture}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Si hay error al cargar la imagen, mostrar icono por defecto
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const icon = document.createElement('div');
                              icon.className = 'w-full h-full flex items-center justify-center bg-gray-100';
                              icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#002C5B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                              parent.appendChild(icon);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#002C5B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1 cursor-pointer hover:bg-gray-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </label>
                    <input 
                      type="file" 
                      id="profile-picture" 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Formatos: JPG, PNG, WebP. Máx: 2MB</p>
                  
                  {selectedFile && (
                    <div className="w-full max-w-xs">
                      {isUploading ? (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                          <p className="text-xs text-gray-500 text-center">{uploadProgress}%</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={uploadProfilePicture}
                          className="w-full py-1 px-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          Subir foto
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Mensaje de verificación */}
                {showVerificationMessage && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Tu cuenta no está verificada. Por favor, verifica tu correo electrónico.
                        </p>
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={isResendingVerification}
                            className="text-sm font-medium text-yellow-700 hover:text-yellow-600 focus:outline-none focus:underline"
                          >
                            {isResendingVerification ? 'Enviando...' : 'Reenviar correo de verificación'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">El email no se puede modificar</p>
                  </div>
                  
                  {user?.role === 'BENEFICIARY' && (
                    <div>
                      <label htmlFor="cuitOrDni" className="block text-sm font-medium text-gray-700 mb-1">CUIT/DNI</label>
                      <input
                        type="text"
                        id="cuitOrDni"
                        name="cuitOrDni"
                        value={form.cuitOrDni}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                    disabled={isSaving}
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
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Seguridad</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Cambiar contraseña</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Actualiza tu contraseña para mantener tu cuenta segura
                </p>
                <Link
                  href="/auth/change-password"
                  className="inline-block px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cambiar contraseña
                </Link>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Información de la cuenta</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Rol</span>
                    <span className="text-sm font-medium">
                      {user?.role === 'ADMIN' && 'Administrador'}
                      {user?.role === 'BENEFICIARY' && 'Beneficiario'}
                      {user?.role === 'DONOR' && 'Donante'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Estado</span>
                    <span className="text-sm font-medium">
                      {userProfile?.verified ? (
                        <span className="text-green-600">Verificado</span>
                      ) : (
                        <span className="text-red-600">No verificado</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Fecha de registro</span>
                    <span className="text-sm font-medium">
                      {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : '-'}
                    </span>
                  </div>
                </div>
              </div>
              
              {user?.role === 'BENEFICIARY' && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">MercadoPago</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Gestiona tu conexión con MercadoPago para recibir donaciones
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/dashboard/mercadopago"
                      className="inline-block px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Configurar MercadoPago
                    </Link>
                    {userProfile?.mpConnected ? (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Conectado</span>
                    ) : (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">No conectado</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
