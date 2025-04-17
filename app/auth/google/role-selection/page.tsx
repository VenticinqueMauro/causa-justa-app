'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrutalButton from '@/components/ui/BrutalButton';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Recuperar datos del usuario de sessionStorage
    const storedUserData = sessionStorage.getItem('googleUserData');
    
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
      }
    }
  }, []);

  const handleRoleSelection = async (role: 'DONOR' | 'BENEFICIARY') => {
    setLoading(true);
    
    try {
      // Obtener el token de acceso
      const token = localStorage.getItem('token');
      
      if (!token) {
        showToast('Error: No se encontró el token de autenticación', 'error');
        router.push('/login');
        return;
      }

      // Enviar solicitud directamente al endpoint del backend para actualizar el rol del usuario
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/update-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || 'Error al actualizar el rol', 'error');
        setLoading(false);
        return;
      }

      // Éxito: mostrar mensaje y redirigir a la página principal
      showToast('¡Rol seleccionado correctamente!', 'success');
      
      // Actualizar el contexto de autenticación con el usuario actualizado
      // El usuario ahora tiene el rol seleccionado
      if (userData) {
        const updatedUserData = {
          ...userData,
          role: role
        };
        login(token, updatedUserData);
      }
      
      // Limpiar datos temporales
      sessionStorage.removeItem('googleUserData');
      
      // Redirigir a la página principal
      router.push('/');
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      showToast('Error de conexión. Por favor, intenta nuevamente.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
          <h1 className="text-2xl font-bold text-[#002C5B] mb-6 text-center">
            Selecciona tu tipo de usuario
          </h1>
          
          {userData ? (
            <div className="mb-6 text-center">
              <p className="text-[#002C5B]/80">
                Bienvenido/a, <span className="font-medium">{userData.fullName || userData.email}</span>
              </p>
              <p className="text-sm text-[#002C5B]/60 mt-1">
                Para completar tu registro, selecciona cómo deseas participar en Causa Justa
              </p>
            </div>
          ) : (
            <div className="mb-6 text-center">
              <p className="text-[#002C5B]/80">
                Bienvenido/a a Causa Justa
              </p>
              <p className="text-sm text-[#002C5B]/60 mt-1">
                Para completar tu registro, selecciona cómo deseas participar
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div 
              className="border-2 border-[#002C5B] p-5 cursor-pointer hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all shadow-[3px_3px_0_0_rgba(0,44,91,0.8)]"
              onClick={() => !loading && handleRoleSelection('DONOR')}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <h2 className="font-bold text-[#002C5B] text-lg">Donante</h2>
                  <p className="text-sm text-[#002C5B]/70 mt-1">
                    Quiero apoyar campañas y realizar donaciones para ayudar a otros
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="border-2 border-[#002C5B] p-5 cursor-pointer hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all shadow-[3px_3px_0_0_rgba(0,44,91,0.8)]"
              onClick={() => !loading && handleRoleSelection('BENEFICIARY')}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <h2 className="font-bold text-[#002C5B] text-lg">Beneficiario</h2>
                  <p className="text-sm text-[#002C5B]/70 mt-1">
                    Quiero crear campañas para recibir apoyo de la comunidad
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <BrutalButton
              variant="outline"
              onClick={() => router.push('/login')}
              disabled={loading}
              className="text-sm"
            >
              Cancelar y volver al inicio de sesión
            </BrutalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
