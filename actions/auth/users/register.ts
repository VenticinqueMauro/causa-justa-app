"use server";

import { RegisterData } from "@/types/users.type";
import { redirect } from "next/navigation";

export async function registerUser(formData: RegisterData) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Error al registrar usuario.' };
        }

        const data = await response.json();
        console.log('Usuario registrado correctamente:', data);

        redirect('/auth/login');
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return { error: 'Error de conexión con el servidor.' };
    }
}