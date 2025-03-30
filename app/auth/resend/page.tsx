'use client';

import { useState } from 'react';

export default function ResendVerificationPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<string | null>(null);

    async function resendVerification() {
        const response = await fetch('/api/auth/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        setStatus(response.ok ? `✅ ${data.message}` : `❌ ${data.error}`);
    }

    return (
        <div className="container">
            <h2>Reenviar Verificación</h2>
            <input
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
            />
            <button onClick={resendVerification} className="btn-primary">
                Reenviar Verificación
            </button>

            {status && <div className="alert">{status}</div>}
        </div>
    );
}
