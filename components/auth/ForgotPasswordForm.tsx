'use client';

import React, { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { forgotPassword, ForgotPasswordState } from '@/app/actions/authActions';
import BrutalButton from '@/components/ui/BrutalButton';
import { useToast } from '@/components/ui/Toast';

const initialState: ForgotPasswordState = {
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
      {pending ? 'Procesando...' : 'Enviar instrucciones'}
    </BrutalButton>
  );
}

export default function ForgotPasswordForm() {
  const { showToast } = useToast();

  // Usar useActionState para manejar el estado del formulario y la acción
  const [formState, formAction] = useActionState(forgotPassword, initialState);

  // Estado local para rastrear cuando mostrar un toast
  const [shouldShowToast, setShouldShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Estado para mostrar mensaje de mantenimiento
  const [showMaintenanceMessage, setShowMaintenanceMessage] = useState(false);

  // Efecto para detectar cambios en formState y preparar el toast
  useEffect(() => {
    console.log('formState actualizado:', formState);
    // Solo configurar el toast si hay un mensaje
    if (formState.message) {
      if (formState.success) {
        console.log('Éxito detectado, preparando toast de éxito');
        setToastMessage(formState.message);
        setToastType('success');
        setShouldShowToast(true);
      } else {
        // Verificar si es un error 401 Unauthorized
        const errorMsg = formState.errors?._form?.[0] || formState.message || 'Error en la solicitud.';
        console.log('Error detectado:', errorMsg);
        
        if (errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
          // Mostrar mensaje de mantenimiento en lugar del error
          setShowMaintenanceMessage(true);
          return;
        }
        
        setToastMessage(errorMsg);
        setToastType('error');
        setShouldShowToast(true);
      }
    }
  }, [formState]); // Dependencias estables

  // Efecto separado para mostrar el toast
  useEffect(() => {
    if (shouldShowToast && toastMessage) {
      console.log('Mostrando toast:', toastMessage, toastType);
      showToast(toastMessage, toastType);
      // Resetear para no mostrar el mismo toast múltiples veces
      setShouldShowToast(false);
    }
  }, [shouldShowToast, toastMessage, toastType, showToast]); // Dependencias estables

  return (
    <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
      {formState.errors?._form && !showMaintenanceMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {formState.errors._form.join(', ')}
        </div>
      )}

      {showMaintenanceMessage ? (
        <div className="text-center">
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
            <h3 className="font-bold mb-2">Servicio temporalmente no disponible</h3>
            <p>La funcionalidad de recuperación de contraseña está en mantenimiento.</p>
            <p className="mt-2">Por favor, intenta más tarde o contacta con soporte si necesitas ayuda inmediata.</p>
          </div>
          <p className="mt-4 text-[#002C5B]/80">
            Volver a{' '}
            <a href="/login" className="text-[#002C5B] font-medium hover:underline">
              Iniciar sesión
            </a>
          </p>
        </div>
      ) : formState.success ? (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {formState.message}
          </div>
          <p className="mt-4 text-[#002C5B]/80">
            Volver a{' '}
            <a href="/login" className="text-[#002C5B] font-medium hover:underline">
              Iniciar sesión
            </a>
          </p>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
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
