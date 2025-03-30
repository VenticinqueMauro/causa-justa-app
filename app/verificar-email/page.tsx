'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerificarEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mensaje, setMensaje] = useState<string | null>(null);

    useEffect(() => {
        async function verificarToken() {
            const token = searchParams.get('token');
            if (!token) {
                setMensaje('Token de verificación no encontrado.');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/verify-email?token=${token}`, {
                    method: 'GET',
                });

                const data = await response.json();
                if (response.ok) {
                    setMensaje(data.message);
                    // Redirigir después de la verificación
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                } else {
                    setMensaje(data.message || 'Error al verificar el correo.');
                }
            } catch (error) {
                console.error('Error al verificar el correo:', error);
                setMensaje('Ocurrió un error. Inténtalo nuevamente.');
            }
        }

        verificarToken();
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-md rounded-md">
                <h2 className="text-lg font-semibold">Verificación de Correo</h2>
                <p className="mt-4">{mensaje || 'Verificando token...'}</p>
            </div>
        </div>
    );
}
