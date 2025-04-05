'use client';

import React, { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerUser, RegisterFormState } from '@/app/actions/authActions';
import BrutalButton from '@/components/ui/BrutalButton';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

const initialState: RegisterFormState = {
  success: false,
  message: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <BrutalButton
      type="submit"
      variant="primary"
      className="w-full text-base"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? 'Procesando...' : 'Registrarse'}
    </BrutalButton>
  );
}

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const router = useRouter();
  const { showToast } = useToast();

  // Usar useActionState para manejar el estado del formulario y la acción
  const [formState, formAction] = useActionState(registerUser, initialState);

  // Estado local para rastrear cuando mostrar un toast
  const [shouldShowToast, setShouldShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Estado local solo para el rol inicial basado en searchParams
  const [initialRole, setInitialRole] = useState<'DONOR' | 'BENEFICIARY'>('DONOR');

  // Estado local para el campo de confirmar contraseña (no enviado al servidor)
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Actualizar el rol inicial si viene como parámetro en la URL
  useEffect(() => {
    if (roleParam && (roleParam === 'DONOR' || roleParam === 'BENEFICIARY')) {
      setInitialRole(roleParam);
    }
  }, [roleParam]);

  // Efecto para detectar cambios en formState y preparar el toast
  useEffect(() => {
    // Solo configurar el toast si hay un mensaje
    if (formState.message) {
      if (formState.success) {
        setToastMessage(formState.message);
        setToastType('success');
      } else {
        const errorMsg = formState.errors?._form?.[0] || formState.message || 'Error en el registro.';
        setToastMessage(errorMsg);
        setToastType('error');
      }
      // Activar el toast
      setShouldShowToast(true);
    }
  }, [formState]); // Dependencia estable

  // Efecto separado para mostrar el toast
  useEffect(() => {
    if (shouldShowToast && toastMessage) {
      showToast(toastMessage, toastType);
      // Resetear para no mostrar el mismo toast múltiples veces
      setShouldShowToast(false);
    }
  }, [shouldShowToast, toastMessage, toastType, showToast]); // Dependencias estables

  // Función para validar la confirmación de contraseña en el cliente
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    if (passwordInput && passwordInput.value !== value) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else {
      setConfirmPasswordError(null);
    }
  };

  // Función para limpiar el error de confirmación si la contraseña principal cambia
  const handlePasswordChange = () => {
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement | null;
    if (confirmPasswordInput && confirmPasswordInput.value !== '') {
      const passwordInput = document.getElementById('password') as HTMLInputElement | null;
      if (passwordInput && passwordInput.value !== confirmPasswordInput.value) {
        setConfirmPasswordError('Las contraseñas no coinciden');
      } else {
        setConfirmPasswordError(null);
      }
    }
  };

  return (
    <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
      {formState.errors?._form && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {formState.errors._form.join(', ')}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#002C5B] mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            aria-describedby="fullName-error"
            className={`w-full px-3 py-2 border-2 ${formState.errors?.fullName ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
            placeholder="Juan Pérez"
          />
          <div id="fullName-error" aria-live="polite" aria-atomic="true">
            {formState.errors?.fullName && formState.errors.fullName.map((error: string) => (
              <p className="mt-1 text-sm text-red-600" key={error}>{error}</p>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#002C5B] mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            aria-describedby="email-error"
            className={`w-full px-3 py-2 border-2 ${formState.errors?.email ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
            placeholder="usuario@ejemplo.com"
          />
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {formState.errors?.email && formState.errors.email.map((error: string) => (
              <p className="mt-1 text-sm text-red-600" key={error}>{error}</p>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#002C5B] mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength={6}
            onChange={handlePasswordChange}
            aria-describedby="password-error"
            className={`w-full px-3 py-2 border-2 ${formState.errors?.password ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
            placeholder="Mínimo 6 caracteres"
          />
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {formState.errors?.password && formState.errors.password.map((error: string) => (
              <p className="mt-1 text-sm text-red-600" key={error}>{error}</p>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#002C5B] mb-1">
            Confirmar contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            minLength={6}
            aria-describedby="confirmPassword-error"
            className={`w-full px-3 py-2 border-2 ${confirmPasswordError ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
            placeholder="Repite tu contraseña"
          />
          <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
            {confirmPasswordError && (
              <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="cuitOrDni" className="block text-sm font-medium text-[#002C5B] mb-1">
            CUIT o DNI
          </label>
          <input
            type="text"
            id="cuitOrDni"
            name="cuitOrDni"
            required
            aria-describedby="cuitOrDni-error"
            className={`w-full px-3 py-2 border-2 ${formState.errors?.cuitOrDni ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
            placeholder="Solo números"
          />
          <div id="cuitOrDni-error" aria-live="polite" aria-atomic="true">
            {formState.errors?.cuitOrDni && formState.errors.cuitOrDni.map((error: string) => (
              <p className="mt-1 text-sm text-red-600" key={error}>{error}</p>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-[#002C5B] mb-1">
            Tipo de usuario
          </label>
          <select
            id="role"
            name="role"
            defaultValue={initialRole}
            required
            aria-describedby="role-error"
            className={`w-full px-3 py-2 border-2 ${formState.errors?.role ? 'border-red-500' : 'border-[#002C5B]'} rounded-none focus:outline-none focus:ring-2 focus:ring-[#EDFCA7] bg-white`}
          >
            <option value="DONOR" className="rounded-none">Donante</option>
            <option value="BENEFICIARY" className="rounded-none">Beneficiario</option>
          </select>
          <div id="role-error" aria-live="polite" aria-atomic="true">
            {formState.errors?.role && formState.errors.role.map((error: string) => (
              <p className="mt-1 text-sm text-red-600" key={error}>{error}</p>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <SubmitButton />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#002C5B]/70">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-[#002C5B] font-medium hover:underline">
              Iniciar sesión
            </a>
          </p>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#002C5B]/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[#002C5B]/60">O continúa con</span>
          </div>
        </div>

        <div className='mt-2'>
          <button
            type="button"
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_NEST_API_URL}auth/google`}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-[#002C5B] bg-white text-[#002C5B] font-medium shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>
        </div>

      </form>
    </div>
  );
}
