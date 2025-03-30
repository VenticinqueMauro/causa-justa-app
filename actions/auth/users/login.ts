'use server';

import { cookies } from 'next/headers';

interface LoginData {
    email: string;
    password: string;
}

export async function loginUser(formData: LoginData) {

    const cookieStore = await cookies()

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Error al iniciar sesión.' };
        }

        const data = await response.json();

        cookieStore.set('token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return { success: true, data };
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return { error: 'Error de conexión con el servidor.' };
    }
}
