// app/verify-email/page.tsx
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalSection from '@/components/ui/BrutalSection';
import BrutalButton from '@/components/ui/BrutalButton';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 container mx-auto px-4">
      <main className="flex-1 py-10">
        <BrutalSection variant="alt" className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#EDFCA7] rounded-full flex items-center justify-center border-2 border-[#002C5B]">
                  <Mail size={40} className="text-[#002C5B]" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <BrutalHeading className="text-3xl md:text-4xl">
                  Verifica tu correo electrónico
                </BrutalHeading>
              </div>
              
              <div className="bg-white border-2 border-[#002C5B] p-3 md:p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] mb-8">
                <p className="text-[#002C5B]/80 mb-6">
                  Hemos enviado un correo electrónico de verificación a la dirección que proporcionaste. 
                  Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.
                </p>
                
                <p className="text-[#002C5B]/80 mb-6">
                  Si no recibes el correo en los próximos minutos, revisa tu carpeta de spam o correo no deseado.
                </p>
                
                <div className="mt-8">
                  <BrutalButton 
                    href="/" 
                    variant="primary" 
                    className="w-full text-base"
                  >
                    Volver al inicio
                  </BrutalButton>
                </div>
              </div>
              
              <p className="text-sm text-[#002C5B]/70">
                ¿No recibiste el correo? <a href="#" className="text-[#002C5B] font-medium hover:underline">Reenviar correo de verificación</a>
              </p>
            </div>
          </div>
        </BrutalSection>
      </main>
    </div>
  );
}
