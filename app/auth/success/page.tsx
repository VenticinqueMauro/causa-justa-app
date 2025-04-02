'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Componente interno que usa useSearchParams
function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            // Guardar el token en localStorage
            localStorage.setItem('token', token);

            // Redirigir al usuario al dashboard o home
            router.push('/');
        } else {
            console.error('No se recibió token de autenticación');
            router.push('/auth/login');
        }
    }, [token, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Procesando autenticación...</h2>
            </div>
        </div>
    );
}

// Componente principal que envuelve el contenido en Suspense
export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Cargando...</h2>
            </div>
        </div>}>
            <SuccessContent />
        </Suspense>
    );
}
