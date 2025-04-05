'use server';

import { z } from 'zod';

// Esquema de validación con Zod
const RegisterSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }).trim(),
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }).trim(),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  cuitOrDni: z.string().regex(/^\d+$/, { message: "El CUIT o DNI debe contener solo números" }).trim(),
  role: z.enum(['DONOR', 'BENEFICIARY', 'ADMIN'], { message: "Rol inválido" }),
});

// Tipado para el estado del formulario
export interface RegisterFormState {
  success: boolean;
  message: string | null;
  errors?: {
    fullName?: string[];
    email?: string[];
    password?: string[];
    cuitOrDni?: string[];
    role?: string[];
    _form?: string[]; // Errores generales del formulario
  };
}

// Tipo para el estado de verificación de email
export interface VerifyEmailState {
  success: boolean;
  message: string;
}

// Acción para verificar el token de correo electrónico
export async function verifyEmail(token: string): Promise<VerifyEmailState> {
  try {
    if (!token) {
      return {
        success: false,
        message: 'Token de verificación no proporcionado',
      };
    }

    // Realizar la solicitud al backend para verificar el token
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/verify-email?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al verificar el correo electrónico',
      };
    }

    return {
      success: true,
      message: 'Correo electrónico verificado correctamente',
    };
  } catch (error) {
    console.error('Error al verificar el correo electrónico:', error);
    return {
      success: false,
      message: 'Error al verificar el correo electrónico. Por favor, intenta nuevamente.',
    };
  }
}

export async function registerUser(
  prevState: RegisterFormState, 
  formData: FormData
): Promise<RegisterFormState> {

  // 1. Validar los datos del formulario usando Zod
  const validatedFields = RegisterSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    cuitOrDni: formData.get('cuitOrDni'),
    role: formData.get('role'),
  });

  // Si la validación falla, devolver los errores
  if (!validatedFields.success) {
    console.log("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Error de validación. Por favor, revisa los campos.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Si la validación es exitosa, proceder con la llamada a la API
  const { fullName, email, password, cuitOrDni, role } = validatedFields.data;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, password, cuitOrDni, role }),
    });

    const data = await response.json();

    // 3. Manejar la respuesta de la API
    if (!response.ok) {
      // Devolver error específico de la API si está disponible
      return {
        success: false,
        message: data.message || 'Error al registrar usuario desde la API',
        errors: { _form: [data.message || 'Error al registrar usuario desde la API'] }
      };
    }

    // 4. Registro exitoso: devolver estado de éxito
    // La redirección se manejará en el cliente al detectar success: true
    return {
      success: true,
      message: "¡Registro exitoso! Se ha enviado un correo de verificación.",
    };

  } catch (error) {
    console.error('Error al registrar usuario (catch):', error);
    // Devolver error genérico de conexión o servidor
    return {
      success: false,
      message: 'Error de conexión. No se pudo completar el registro.',
      errors: { _form: ['Error de conexión. No se pudo completar el registro.'] }
    };
  }
}
