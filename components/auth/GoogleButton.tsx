'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function GoogleButton() {
    const router = useRouter();

    const handleGoogleAuth = () => {
        // Redirigir al backend para iniciar OAuth
        window.location.href = `${process.env.NEXT_PUBLIC_NEST_API_URL}auth/google`;
    };

    return (
        <Button
            onClick={handleGoogleAuth}
            variant="outline"
            size="lg"
        >
            Iniciar sesión con Google
        </Button>
    );
}
