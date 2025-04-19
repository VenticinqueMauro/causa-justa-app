// app/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';
import BrutalHeading from '@/components/ui/BrutalHeading';
import BrutalSection from '@/components/ui/BrutalSection';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col mx-auto px-4 bg-gray-100">
      <main className="flex-1 py-10">
        <BrutalSection variant="alt" className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <BrutalHeading className="text-3xl md:text-4xl">
                  Iniciar Sesión
                </BrutalHeading>
              </div>
              <p className="text-center mb-8 text-[#002C5B]/80">
                Accede a tu cuenta para continuar con tu experiencia en la plataforma.
              </p>
              <LoginForm />
            </div>
          </div>
        </BrutalSection>
      </main>
    </div>
  );
}
