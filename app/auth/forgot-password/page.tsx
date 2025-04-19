import { Suspense } from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalSection from '@/components/ui/BrutalSection';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 mx-auto px-4">
      <main className="flex-1 py-10">
        <BrutalSection variant="alt" className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <BrutalHeading className="text-3xl md:text-4xl">
                  Recuperar contraseña
                </BrutalHeading>
              </div>
              <p className="text-center mb-8 text-[#002C5B]/80">
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </p>
              <Suspense fallback={<div className="text-center p-4">Cargando formulario...</div>}>
                <ForgotPasswordForm />
              </Suspense>
            </div>
          </div>
        </BrutalSection>
      </main>
    </div>
  );
}
