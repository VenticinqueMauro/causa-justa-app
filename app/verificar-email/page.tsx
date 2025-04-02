// app/verificar-email/page.tsx
import VerificarEmailClient from '@/components/auth/VerificarEmailClient';
import React, { Suspense } from 'react';

export default function VerificarEmailPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <VerificarEmailClient />
        </Suspense>
    );
}
