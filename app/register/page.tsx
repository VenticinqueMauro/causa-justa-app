// app/register/page.tsx
import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalSection from '@/components/ui/BrutalSection';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 mx-auto px-4">
      <main className="flex-1 py-10">
        <BrutalSection variant="alt" className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <BrutalHeading className="text-3xl md:text-4xl">
                  Registro de Usuario
                </BrutalHeading>
              </div>
              <p className="text-center mb-8 text-[#002C5B]/80">
                Únete a nuestra plataforma para hacer la diferencia. <br />Puedes registrarte como donante o beneficiario.
              </p>
              <Suspense fallback={<div className="text-center p-4">Cargando formulario...</div>}>
                <RegisterForm />
              </Suspense>
            </div>
          </div>
        </BrutalSection>
      </main>
    </div>
  );
}
