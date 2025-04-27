'use client';

import React, { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { resetPassword, ResetPasswordState } from '@/app/actions/authActions';
import BrutalButton from '@/components/ui/BrutalButton';
import { useToast } from '@/components/ui/Toast';
import PasswordRequirements from './PasswordRequirements';

const initialState: ResetPasswordState = {
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
      {pending ? 'Procesando...' : 'Restablecer contraseña'}
    </BrutalButton>
  );
}

export default function ResetPasswordForm({ token }: { token: string }) {
  const { showToast } = useToast();

  // Usar useActionState para manejar el estado del formulario y la acción
  const [formState, formAction] = useActionState(resetPassword, initialState);

  // Estado local para rastrear cuando mostrar un toast
  const [shouldShowToast, setShouldShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  // Estado para la contraseña (para la validación en tiempo real)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Efecto para detectar cambios en formState y preparar el toast
  useEffect(() => {
    // Solo configurar el toast si hay un mensaje de éxito
    if (formState.message && formState.success) {
      setToastMessage(formState.message);
      setToastType('success');
      setShouldShowToast(true);
    }
    // No mostrar toast para errores de validación, se mostrarán en el formulario
  }, [formState]); // Dependencias estables

  // Efecto separado para mostrar el toast
  useEffect(() => {
    if (shouldShowToast && toastMessage) {
      showToast(toastMessage, toastType);
      // Resetear para no mostrar el mismo toast múltiples veces
      setShouldShowToast(false);
    }
  }, [shouldShowToast, toastMessage, toastType, showToast]); // Dependencias estables

  return (
    <div className="bg-white border-2 border-[#002C5B] p-3 md:p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
      {formState.errors?._form && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {formState.errors._form.map((error: string, index: number) => (
            <p key={index} className="mb-1 last:mb-0">{error}</p>
          ))}
        </div>
      )}

      {formState.success ? (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {formState.message}
          </div>
          <p className="mt-4 text-[#002C5B]/80">
            <a href="/login" className="text-[#002C5B] font-medium hover:underline">
              Ir a iniciar sesión
            </a>
          </p>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="token" value={token} />
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#002C5B] mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              onChange={(e) => {
                setPassword(e.target.value);
                // Verificar si la confirmación de contraseña coincide
                if (confirmPassword && e.target.value !== confirmPassword) {
                  setConfirmPasswordError('Las contraseñas no coinciden');
                } else if (confirmPassword) {
                  setConfirmPasswordError(null);
                }
              }}
              aria-describedby="password-requirements password-error"
              className={`w-full px-3 py-2 border-2 ${formState.errors?.password ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
              placeholder="Ingresa tu nueva contraseña"
            />
            {/* Componente interactivo de requisitos de contraseña */}
            <PasswordRequirements password={password} />
            <div id="password-error" aria-live="polite" aria-atomic="true" className="mt-2">
              {formState.errors?.password && formState.errors.password.map((error: string) => (
                <p className="text-sm text-red-600" key={error}>{error}</p>
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
              required
              minLength={8}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (password && e.target.value !== password) {
                  setConfirmPasswordError('Las contraseñas no coinciden');
                } else {
                  setConfirmPasswordError(null);
                }
              }}
              className={`w-full px-3 py-2 border-2 ${confirmPasswordError ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
              placeholder="Confirma tu nueva contraseña"
            />
            {confirmPasswordError && (
              <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
            )}
          </div>

          <SubmitButton />

          <div className="text-center mt-4">
            <p className="text-sm text-[#002C5B]/80">
              ¿Recordaste tu contraseña?{' '}
              <a href="/login" className="text-[#002C5B] font-medium hover:underline">
                Iniciar sesión
              </a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
