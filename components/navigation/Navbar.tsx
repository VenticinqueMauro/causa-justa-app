'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);

    // ✅ Obtener token desde localStorage al cargar
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // ✅ Registro de Usuario
    async function registerUser() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: 'Mauro Venticinque',
                    email: 'mauro.venticinque@hotmail.com',
                    password: 'contraseña123',
                    cuitOrDni: '30123456789',
                    role: 'BENEFICIARY',
                }),
            });

            const data = await response.json();
            console.log('Registro exitoso:', data);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
        }
    }

    // ✅ Login de Usuario
    async function loginUser() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'mauro.venticinque@hotmail.com',
                    password: 'contraseña123',
                }),
            });

            const data = await response.json();
            if (data?.access_token) {
                localStorage.setItem('token', data.access_token);
                setToken(data.access_token);
                console.log('Login exitoso:', data);
            } else {
                console.error('Error al iniciar sesión:', data.message);
            }
        } catch (error) {
            console.error('Error en el login:', error);
        }
    }

    // ✅ Autenticación con Google
    function handleGoogleAuth() {
        window.location.href = `${process.env.NEXT_PUBLIC_NEST_API_URL}auth/google`;
    }

    // ✅ Conectar Mercado Pago
    async function connectMercadoPago() {
        if (!token) {
            console.error('No hay token disponible, inicia sesión primero.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}mercadopago/connect`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log('Conexión con Mercado Pago:', data);
        } catch (error) {
            console.error('Error al conectar con Mercado Pago:', error);
        }
    }

    // ✅ Crear Campaña
    async function createCampaign() {
        if (!token) {
            console.error('No hay token disponible, inicia sesión primero.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}campaigns`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: 'Ayuda para tratamiento',
                    slug: 'ayuda-tratamiento-juan',
                    description: 'Recaudamos fondos para el tratamiento de Juan.',
                    shortDescription: 'Apoya el tratamiento de Juan.',
                    category: 'HEALTH',
                    goalAmount: 50000,
                    images: ['https://ejemplo.com/imagen1.jpg'],
                    location: {
                        address: 'Buenos Aires, Argentina',
                        coordinates: {
                            lat: -34.6037,
                            lng: -58.3816,
                        },
                    },
                    recipient: {
                        name: 'Mauro Venticinque',
                        age: 35,
                        condition: 'Requiere tratamiento médico',
                    },
                    creator: {
                        name: 'María Pérez',
                        relationship: 'Hermana',
                        contact: 'maria@ejemplo.com',
                    },
                    tags: ['salud', 'tratamiento', 'ayuda'],
                }),
            });

            const data = await response.json();
            console.log('Campaña creada:', data);
        } catch (error) {
            console.error('Error al crear campaña:', error);
        }
    }

    // ✅ Obtener Campañas
    async function getCampaigns() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}campaigns`, {
                method: 'GET',
            });

            const data = await response.json();
            console.log('Campañas obtenidas:', data);
        } catch (error) {
            console.error('Error al obtener campañas:', error);
        }
    }

    // ✅ Logout / Cerrar Sesión
    function logoutUser() {
        localStorage.removeItem('token');
        setToken(null);
        console.log('Sesión cerrada');
    }

    return (
        <header className="sticky top-0 left-0 z-10 border-b border-border bg-accent">
            <div className="flex justify-between items-center px-4 py-4 mx-auto max-w-7xl">
                <div className="text-xl font-bold text-primary">DonarAR</div>
                {/* ✅ Botones para probar las funcionalidades */}
                <div className="flex gap-4">
                    <button onClick={registerUser} className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-primary hover:bg-secondary/80">
                        Registrar Usuario
                    </button>
                    <button onClick={loginUser} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary/80">
                        Iniciar Sesión
                    </button>
                    <button onClick={handleGoogleAuth} className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-primary hover:bg-secondary/80">
                        Google Auth
                    </button>
                    <button onClick={connectMercadoPago} className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-primary hover:bg-secondary/80">
                        Conectar MP
                    </button>
                    <button onClick={createCampaign} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary/80">
                        Crear Campaña
                    </button>
                    <button onClick={getCampaigns} className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-primary hover:bg-secondary/80">
                        Obtener Campañas
                    </button>
                    <button onClick={logoutUser} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-red-600 hover:bg-red-700">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </header>
    );
}
