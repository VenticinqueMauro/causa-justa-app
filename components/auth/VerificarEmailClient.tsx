'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function VerificarEmailClient() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div>
            <h1>Verificación de Email</h1>
            {token ? (
                <p>Token recibido: {token}</p>
            ) : (
                <p>No se encontró token en la URL.</p>
            )}
        </div>
    );
}
