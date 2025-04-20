'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, KeyRound, Mail, Phone, MapPin, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  profilePicture?: string | null;
}

export default function PerfilDonorPage() {
  const { user, isAuthenticated, isLoading, getToken, updateUserData } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    profilePicture: null,
  });
  const [showDefaultAvatar, setShowDefaultAvatar] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'DONOR') {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: '',
        location: '',
        profilePicture: user.profilePicture || null,
      });

      if (user.profilePicture) {
        setProfileImage(user.profilePicture);
      }

      fetchUserProfile();
    }
  }, [user, isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
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

      if (!response.ok) throw new Error('Error al obtener perfil de usuario');

      const data = await response.json();
      setUserProfile(data);
      setForm({
        fullName: data.fullName || user?.fullName || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
        location: data.location || '',
        profilePicture: data.profilePicture || user?.profilePicture || null,
      });

      if (data.profilePicture) {
        const fullUrl = data.profilePicture.startsWith('http')
          ? data.profilePicture
          : `${baseUrl}${data.profilePicture.startsWith('/') ? data.profilePicture.substring(1) : data.profilePicture}`;
        setProfileImage(fullUrl);
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      showToast('No se pudo cargar tu perfil. Intenta nuevamente más tarde.', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await getToken();
      if (!token) throw new Error('No se encontró token de autenticación');

      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;

      const response = await fetch(`${baseUrl}profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          location: form.location,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar perfil');

      const updatedProfile = await response.json();
      updateUserData({ fullName: form.fullName });

      setSuccess('Perfil actualizado correctamente');
      showToast('Tu perfil ha sido actualizado correctamente.', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      setError('No se pudo actualizar el perfil');
      showToast('Ocurrió un error al guardar tu perfil. Intenta nuevamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setShowDefaultAvatar(true);
    e.currentTarget.src = '/default-avatar.png';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002C5B]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-extrabold text-[#002C5B] mb-8 border-b-4 border-[#002C5B] pb-2">Mi Perfil</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black mb-4">
                  {profileImage && !showDefaultAvatar ? (
                    <img
                      src={profileImage}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <img
                      src="/default-avatar.png"
                      alt="Avatar por defecto"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="text-sm font-medium">
                  {userProfile?.verified ? (
                    <span className="text-green-600">Verificado</span>
                  ) : (
                    <span className="text-red-600">No verificado</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Información personal</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-black text-white border-2 border-black rounded hover:bg-gray-800 transition"
                >
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 border-2 border-red-600 text-red-600 rounded flex items-center">
                  <AlertCircle size={18} className="mr-2" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 border-2 border-green-600 text-green-600 rounded flex items-center">
                  <Check size={18} className="mr-2" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center">
                    <User size={16} className="mr-2" /> Nombre completo
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center">
                    <Mail size={16} className="mr-2" /> Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full px-3 py-2 border bg-gray-100 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center">
                    <Phone size={16} className="mr-2" /> Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center">
                    <MapPin size={16} className="mr-2" /> Ubicación
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full px-4 py-2 bg-black text-white rounded border-2 border-black hover:bg-gray-800 transition"
                    >
                      {isSaving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-bold mb-4">Seguridad</h2>
              <p className="text-sm text-gray-500 mb-4">
                Actualiza tu contraseña para mantener tu cuenta segura.
              </p>
              <Link
                href="/auth/change-password"
                className="inline-block px-4 py-2 bg-black text-white rounded border-2 border-black hover:bg-gray-800 transition"
              >
                Cambiar contraseña
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
