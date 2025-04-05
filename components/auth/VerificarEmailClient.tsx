'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { verifyEmail, VerifyEmailState } from '@/app/actions/authActions';
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalSection from '@/components/ui/BrutalSection';
import BrutalButton from '@/components/ui/BrutalButton';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function VerificarEmailClient() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const { showToast } = useToast();
    
    const [verificationState, setVerificationState] = useState<VerifyEmailState | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Usar una referencia para rastrear si ya se ha verificado el token
    const hasVerified = useRef(false);

    useEffect(() => {
        // Solo verificar si aún no se ha hecho
        if (hasVerified.current) return;
        
        async function verify() {
            if (!token) {
                setVerificationState({
                    success: false,
                    message: 'No se encontró token en la URL.'
                });
                setLoading(false);
                return;
            }

            try {
                // Marcar como verificado antes de la llamada para prevenir múltiples intentos
                hasVerified.current = true;
                
                const result = await verifyEmail(token);
                setVerificationState(result);
                
                // Mostrar toast con el resultado solo una vez
                if (result.success) {
                    showToast(result.message, 'success');
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                setVerificationState({
                    success: false,
                    message: 'Error al verificar el correo electrónico. Por favor, intenta nuevamente.'
                });
                showToast('Error al verificar el correo electrónico', 'error');
            } finally {
                setLoading(false);
            }
        }

        verify();
        
        // Limpiar en caso de desmontaje
        return () => {
            hasVerified.current = true; // Prevenir verificaciones adicionales
        };
    }, [token]); // Quitar showToast de las dependencias para evitar re-ejecuciones

    const handleGoToLogin = () => {
        router.push('/login');
    };

    return (
        <BrutalSection variant="alt" className="py-10">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white border-2 border-[#002C5B] p-8 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-[#002C5B]"
                                    style={{ backgroundColor: loading ? '#EDFCA7' : verificationState?.success ? '#EDFCA7' : '#FFC7C7' }}>
                                    {loading ? (
                                        <Mail size={40} className="text-[#002C5B]" />
                                    ) : verificationState?.success ? (
                                        <CheckCircle size={40} className="text-[#002C5B]" />
                                    ) : (
                                        <XCircle size={40} className="text-[#002C5B]" />
                                    )}
                                </div>
                            </div>
                            
                            <BrutalHeading as="h1" className="mb-4 text-[#002C5B]">
                                {loading ? 'Verificando correo electrónico...' : 
                                 verificationState?.success ? '¡Verificación exitosa!' : 'Error de verificación'}
                            </BrutalHeading>
                            
                            {!loading && (
                                <div className="mb-8">
                                    <p className="text-lg mb-6">
                                        {verificationState?.message}
                                    </p>
                                    
                                    {verificationState?.success ? (
                                        <div>
                                            <p className="text-lg mb-6">
                                                Tu cuenta ha sido activada correctamente. Ahora puedes iniciar sesión y acceder a todas las funcionalidades de la plataforma.
                                            </p>
                                            <BrutalButton 
                                                variant="primary" 
                                                onClick={handleGoToLogin}
                                                className="px-8 py-3 text-lg"
                                            >
                                                Iniciar sesión
                                            </BrutalButton>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-lg mb-6">
                                                No pudimos verificar tu correo electrónico. El enlace puede haber expirado o ser inválido.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <BrutalButton 
                                                    variant="secondary" 
                                                    onClick={() => router.push('/register')}
                                                    className="px-6 py-2"
                                                >
                                                    Registrarse nuevamente
                                                </BrutalButton>
                                                <BrutalButton 
                                                    variant="primary" 
                                                    onClick={() => router.push('/')}
                                                    className="px-6 py-2"
                                                >
                                                    Ir al inicio
                                                </BrutalButton>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {loading && (
                                <div className="flex justify-center my-8">
                                    <div className="w-12 h-12 border-t-2 border-b-2 border-[#002C5B] rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BrutalSection>
    );
}
