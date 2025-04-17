'use client';

import React, { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import BrutalButton from '@/components/ui/BrutalButton';
import { useToast } from '@/components/ui/Toast';
import PasswordRequirements from './PasswordRequirements';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Definir la estructura del estado del formulario
interface ChangePasswordState {
  success: boolean;
  message: string | null;
  errors: {
    _form?: string[];
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
}

const initialState: ChangePasswordState = {
  success: false,
  message: null,
  errors: {},
};

// Función para validar la contraseña en el cliente
function validatePassword(currentPassword: string, newPassword: string, confirmPassword: string): ChangePasswordState {
  const errors: ChangePasswordState['errors'] = {};
  
  if (!currentPassword) {
    errors.currentPassword = ['La contraseña actual es requerida'];
  }
  
  if (!newPassword) {
    errors.newPassword = ['La nueva contraseña es requerida'];
  } else if (newPassword.length < 8) {
    errors.newPassword = ['La contraseña debe tener al menos 8 caracteres'];
  } else if (!/[A-Z]/.test(newPassword)) {
    errors.newPassword = ['La contraseña debe contener al menos una letra mayúscula'];
  } else if (!/[a-z]/.test(newPassword)) {
    errors.newPassword = ['La contraseña debe contener al menos una letra minúscula'];
  } else if (!/\d/.test(newPassword)) {
    errors.newPassword = ['La contraseña debe contener al menos un número'];
  } else if (!/[@$!%*?&.]/.test(newPassword)) {
    errors.newPassword = ['La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, &, .)'];
  }
  
  if (newPassword !== confirmPassword) {
    errors.confirmPassword = ['Las contraseñas no coinciden'];
  }
  
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Por favor corrige los errores en el formulario',
      errors,
    };
  }
  
  return {
    success: true,
    message: null,
    errors: {},
  };
}

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
      {pending ? 'Procesando...' : 'Cambiar contraseña'}
    </BrutalButton>
  );
}

export default function ChangePasswordForm() {
  const { showToast } = useToast();
  const { user, getToken } = useAuth();
  const router = useRouter();

  // Estado del formulario
  const [formState, setFormState] = useState<ChangePasswordState>(initialState);

  // Estado local para rastrear cuando mostrar un toast
  const [shouldShowToast, setShouldShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  // Estado para la contraseña (para la validación en tiempo real)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Efecto para detectar cambios en formState y preparar el toast
  useEffect(() => {
    // Solo configurar el toast si hay un mensaje
    if (formState.message) {
      if (formState.success) {
        setToastMessage(formState.message);
        setToastType('success');
        setShouldShowToast(true);
        
        // Redirigir después de un cambio de contraseña exitoso
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        const errorMsg = formState.errors?._form?.[0] || formState.message || 'Error al cambiar la contraseña.';
        setToastMessage(errorMsg);
        setToastType('error');
        setShouldShowToast(true);
      }
    }
  }, [formState, router]); // Dependencias estables

  // Efecto separado para mostrar el toast
  useEffect(() => {
    if (shouldShowToast && toastMessage) {
      showToast(toastMessage, toastType);
      // Resetear para no mostrar el mismo toast múltiples veces
      setShouldShowToast(false);
    }
  }, [shouldShowToast, toastMessage, toastType, showToast]); // Dependencias estables

  // Función para manejar el envío del formulario con el token de autenticación
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    // Validar la contraseña en el cliente primero
    const validationResult = validatePassword(currentPassword, newPassword, confirmPassword);
    
    if (!validationResult.success) {
      setFormState(validationResult);
      return;
    }
    try {
      const token = await getToken();
      
      if (!token) {
        showToast('No estás autenticado. Por favor, inicia sesión nuevamente.', 'error');
        router.push('/login');
        return;
      }
      
      // Llamada directa a la API para cambiar la contraseña con el token
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.message || 'Error al cambiar la contraseña';
        showToast(errorMessage, 'error');
        setFormState({
          success: false,
          message: errorMessage,
          errors: {
            _form: [errorMessage]
          }
        });
        return;
      }
      
      // Actualizar el estado del formulario para mostrar éxito
      setFormState({
        success: true,
        message: 'Contraseña actualizada correctamente',
        errors: {}
      });
      
      showToast('Contraseña actualizada correctamente', 'success');
      
      // Redirigir después de un cambio de contraseña exitoso
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      const errorMessage = 'Error al procesar la solicitud. Intenta de nuevo más tarde.';
      showToast(errorMessage, 'error');
      setFormState({
        success: false,
        message: errorMessage,
        errors: {
          _form: [errorMessage]
        }
      });
    }
  };

  return (
    <div className="bg-white border-2 border-[#002C5B] p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
      <div className="flex justify-end mb-4">
        <a href="/" className="text-sm text-[#002C5B] hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </a>
      </div>
      
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
            Redirigiendo a la página principal...
          </p>
        </div>
      ) : (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-[#002C5B] mb-1">
              Contraseña actual
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              required
              className={`w-full px-3 py-2 border-2 ${formState.errors?.currentPassword ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
              placeholder="Ingresa tu contraseña actual"
            />
            <div aria-live="polite" aria-atomic="true">
              {formState.errors?.currentPassword && formState.errors.currentPassword.map((error: string) => (
                <p className="mt-1 text-sm text-red-600" key={error}>{error}</p>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[#002C5B] mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              minLength={8}
              onChange={(e) => {
                setNewPassword(e.target.value);
                // Verificar si la confirmación de contraseña coincide
                if (confirmPassword && e.target.value !== confirmPassword) {
                  setConfirmPasswordError('Las contraseñas no coinciden');
                } else if (confirmPassword) {
                  setConfirmPasswordError(null);
                }
              }}
              className={`w-full px-3 py-2 border-2 ${formState.errors?.newPassword ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
              placeholder="Ingresa tu nueva contraseña"
            />
            
            {/* Componente interactivo de requisitos de contraseña */}
            <PasswordRequirements password={newPassword} />
            
            <div aria-live="polite" aria-atomic="true" className="mt-2">
              {formState.errors?.newPassword && formState.errors.newPassword.map((error: string) => (
                <p className="text-sm text-red-600" key={error}>{error}</p>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#002C5B] mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={8}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (newPassword && e.target.value !== newPassword) {
                  setConfirmPasswordError('Las contraseñas no coinciden');
                } else {
                  setConfirmPasswordError(null);
                }
              }}
              className={`w-full px-3 py-2 border-2 ${confirmPasswordError || formState.errors?.confirmPassword ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
              placeholder="Confirma tu nueva contraseña"
            />
            {confirmPasswordError && (
              <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
            )}
            <div aria-live="polite" aria-atomic="true">
              {formState.errors?.confirmPassword && formState.errors.confirmPassword.map((error: string) => (
                <p className="mt-1 text-sm text-red-600" key={error}>{error}</p>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <BrutalButton
              type="submit"
              variant="primary"
              className="w-full text-base"
            >
              Cambiar contraseña
            </BrutalButton>
          </div>
        </form>
      )}
    </div>
  );
}
