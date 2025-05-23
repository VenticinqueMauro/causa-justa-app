'use client';

import React, { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginUser, LoginFormState } from '@/app/actions/authActions';
import BrutalButton from '@/components/ui/BrutalButton';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import GoogleButton from './GoogleButton';

const initialState: LoginFormState = {
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
      {pending ? 'Procesando...' : 'Iniciar Sesión'}
    </BrutalButton>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();

  // Usar useActionState para manejar el estado del formulario y la acción
  const [formState, formAction] = useActionState(loginUser, initialState);

  // Estado local para rastrear cuando mostrar un toast
  const [shouldShowToast, setShouldShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Verificar si hay un parámetro de redirección en la URL
  useEffect(() => {
    // Obtener el parámetro redirect de la URL
    const searchParams = new URLSearchParams(window.location.search);
    const redirectParam = searchParams.get('redirect');
    
    if (redirectParam) {
      console.log('Parámetro de redirección detectado:', redirectParam);
      localStorage.setItem('redirectAfterLogin', redirectParam);
    }
  }, []);

  // Referencia para rastrear el estado anterior del formulario
  const formStateRef = React.useRef(formState);
  
  // Efecto para detectar cambios en formState y preparar el toast
  useEffect(() => {    
    // Solo configurar el toast si hay un mensaje y si el formState ha cambiado
    if (formState.message && formStateRef.current !== formState) {
      // Actualizar la referencia para evitar procesar el mismo formState múltiples veces
      formStateRef.current = formState;
      
      if (formState.success) {
        setToastMessage(formState.message);
        setToastType('success');

        // Si el inicio de sesión fue exitoso, actualizar el contexto de autenticación
        if (formState.data) {
          console.log('Login exitoso, token recibido:', formState.data.access_token);
          
          // Guardar el token en localStorage con la clave correcta (auth_token)
          localStorage.setItem('auth_token', formState.data.access_token);
          // También guardar con la clave 'token' para compatibilidad
          localStorage.setItem('token', formState.data.access_token);
          console.log('Token guardado en localStorage');
          
          // Establecer cookies para el middleware
          document.cookie = `token=${formState.data.access_token}; path=/; max-age=86400; SameSite=Lax`;
          
          // Obtener el refresh token del backend o usar el access token como refresh token si no se proporciona
          const refreshToken = formState.data.refresh_token || formState.data.access_token;
          localStorage.setItem('refresh_token', refreshToken);
          document.cookie = `refresh_token=${refreshToken}; path=/; max-age=86400; SameSite=Lax`;
          
          // Añadir el campo authMethod al objeto de usuario
          const userWithAuthMethod = {
            ...formState.data.user,
            authMethod: 'email' as 'email'
          };
          
          // Guardar datos de usuario en cookie
          document.cookie = `auth_user=${JSON.stringify(userWithAuthMethod)}; path=/; max-age=86400; SameSite=Lax`;
          
          // Actualizar el contexto de autenticación con el token y refresh token
          login(formState.data.access_token, refreshToken, userWithAuthMethod);
          
          // Verificar si hay una redirección guardada
          const redirectPath = localStorage.getItem('redirectAfterLogin');
          
          // Redirigir al usuario después de un inicio de sesión exitoso
          // Usar window.location.href en lugar de router.push para evitar bucles de redirección
          setTimeout(() => {
            if (redirectPath) {
              console.log('Redirigiendo a:', redirectPath);
              localStorage.removeItem('redirectAfterLogin'); // Limpiar después de usar
              window.location.href = redirectPath;
            } else {
              window.location.href = '/';
            }
          }, 500); // Pequeño retraso para asegurar que el contexto se actualice antes de la redirección
        }
      } else {
        const errorMsg = formState.errors?._form?.[0] || formState.message || 'Error en el inicio de sesión.';
        setToastMessage(errorMsg);
        setToastType('error');
        // Activar el toast solo para errores (los éxitos se manejan con redirección)
        setShouldShowToast(true);
      }
    }
  }, [formState]); // Solo depender de formState

  // Efecto separado para mostrar el toast
  useEffect(() => {
    // Solo mostrar toast para errores, ya que los éxitos se manejan con redirección
    if (shouldShowToast && toastMessage && toastType === 'error') {
      // Usar setTimeout para evitar posibles problemas de sincronización
      const timeoutId = setTimeout(() => {
        showToast(toastMessage, toastType);
        // Resetear para no mostrar el mismo toast múltiples veces
        setShouldShowToast(false);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [shouldShowToast, toastMessage, toastType, showToast]);

  return (
    <div className="bg-white border-2 border-[#002C5B] p-3 md:p-6 shadow-[5px_5px_0_0_rgba(0,44,91,0.8)]">
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
          {formState.errors._form.join(', ')}
        </div>
      )}



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
            aria-describedby="password-error"
            className={`w-full px-3 py-2 border-2 ${formState.errors?.password ? 'border-red-500' : 'border-[#002C5B]'} focus:outline-none focus:ring-2 focus:ring-[#EDFCA7]`}
            placeholder="Ingresa tu contraseña"
          />
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {formState.errors?.password && formState.errors.password.map((error: string) => (
              <p className="mt-1 text-sm text-red-600" key={error}>{error}</p>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <a href="/auth/forgot-password" className="text-sm text-[#002C5B] hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <SubmitButton />
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#002C5B]/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[#002C5B]/60">O continúa con</span>
          </div>
        </div>
        <div className="mb-6">
          <GoogleButton text="Iniciar sesión con Google" />
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-[#002C5B]/80">
            ¿No tienes una cuenta?{' '}
            <a href="/register" className="text-[#002C5B] font-medium hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
