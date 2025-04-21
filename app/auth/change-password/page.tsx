'use client';

import { Suspense } from 'react';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalSection from '@/components/ui/BrutalSection';

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 mx-auto px-4">
      <main className="flex-1 py-10">
        <BrutalSection variant="alt" className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <BrutalHeading className="text-3xl md:text-4xl">
                  Cambiar contraseña
                </BrutalHeading>
              </div>
              <p className="text-center mb-8 text-[#002C5B]/80">
                Actualiza tu contraseña para mantener tu cuenta segura.
              </p>
              <Suspense fallback={<div className="text-center p-4">Cargando formulario...</div>}>
                <ChangePasswordForm />
              </Suspense>
            </div>
          </div>
        </BrutalSection>
      </main>
    </div>
  );
}
