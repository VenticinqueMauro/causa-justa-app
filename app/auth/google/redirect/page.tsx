'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Componente interno que usa useSearchParams
function GoogleRedirectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const { login } = useAuth();

    useEffect(() => {
        async function handleGoogleRedirect() {
            if (!code) {
                console.error('No se encontró el código de autorización');
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_NEST_API_URL}auth/google/redirect?code=${code}`,
                    {
                        method: 'GET',
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log('Autenticación exitosa:', data);

                    // Guardar el token en localStorage para futuras peticiones
                    localStorage.setItem('token', data.access_token);
                    
                    // Actualizar el contexto de autenticación si hay datos de usuario
                    if (data.user) {
                        // Guardar información temporal del usuario para la selección de rol
                        sessionStorage.setItem('googleUserData', JSON.stringify(data.user));
                        
                        // Obtener el refresh token del backend o usar el access token como refresh token si no se proporciona
                        const refreshToken = data.refresh_token || data.access_token;
                        
                        // Actualizar el contexto de autenticación con el token y refresh token
                        login(data.access_token, refreshToken, data.user);
                    }

                    // Verificar si el usuario necesita seleccionar un rol
                    if (data.needsRoleSelection) {
                        // Redireccionar al usuario a la página de selección de rol
                        router.push('/auth/google/role-selection');
                    } else {
                        // Si no necesita seleccionar rol, ir directamente a la página principal
                        router.push('/');
                    }
                } else {
                    console.error('Error al procesar la autenticación');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error en la autenticación:', error);
                router.push('/login');
            }
        }

        handleGoogleRedirect();
    }, [code, router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Procesando autenticación de Google...</p>
        </div>
    );
}

// Componente principal que envuelve el contenido en Suspense
export default function GoogleRedirectPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando...</div>}>
            <GoogleRedirectContent />
        </Suspense>
    );
}
