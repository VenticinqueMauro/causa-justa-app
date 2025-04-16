'use server';

import { z } from 'zod';

// Esquema de validación con Zod
const RegisterSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }).trim(),
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }).trim(),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { 
      message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &)" 
    }),
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

// Tipado para el estado del formulario de login
export interface LoginFormState {
  success: boolean;
  message: string | null;
  data?: any; // Datos del usuario y token de acceso
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[]; // Errores generales del formulario
  };
}

// Tipo para el estado de verificación de email
export interface VerifyEmailState {
  success: boolean;
  message: string;
}

// Tipo para el estado de solicitud de recuperación de contraseña
export interface ForgotPasswordState {
  success: boolean;
  message: string | null;
  errors?: {
    email?: string[];
    _form?: string[];
  };
}

// Tipo para el estado de restablecimiento de contraseña
export interface ResetPasswordState {
  success: boolean;
  message: string | null;
  errors?: {
    password?: string[];
    token?: string[];
    _form?: string[];
  };
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

// Esquema de validación para el login con Zod
const LoginSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }).trim(),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

export async function loginUser(
  prevState: LoginFormState, 
  formData: FormData
): Promise<LoginFormState> {

  // 1. Validar los datos del formulario usando Zod
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
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
  const { email, password } = validatedFields.data;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Para manejar cookies
    });

    const data = await response.json();

    // 3. Manejar la respuesta de la API
    if (!response.ok) {
      // Devolver error específico de la API si está disponible
      return {
        success: false,
        message: data.message || 'Credenciales incorrectas',
        errors: { _form: [data.message || 'Credenciales incorrectas'] }
      };
    }

    // 4. Login exitoso: devolver estado de éxito
    return {
      success: true,
      message: "¡Inicio de sesión exitoso!",
      data: data, // Incluir los datos del usuario y el token
    };

  } catch (error) {
    console.error('Error al iniciar sesión (catch):', error);
    // Devolver error genérico de conexión o servidor
    return {
      success: false,
      message: 'Error de conexión. No se pudo completar el inicio de sesión.',
      errors: { _form: ['Error de conexión. No se pudo completar el inicio de sesión.'] }
    };
  }
}

// Esquema de validación para solicitud de recuperación de contraseña
const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }).trim(),
});

// Acción para solicitar recuperación de contraseña
export async function forgotPassword(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  // 1. Validar los datos del formulario usando Zod
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  // Si la validación falla, devolver los errores
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación. Por favor, revisa el correo electrónico.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Si la validación es exitosa, proceder con la llamada a la API
  const { email } = validatedFields.data;
  
  try {
    console.log('Enviando solicitud de recuperación de contraseña para:', email);
    console.log('URL de la API:', `${process.env.NEXT_PUBLIC_NEST_API_URL}auth/forgot-password`);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    // Intentar obtener el texto de la respuesta primero
    const responseText = await response.text();
    console.log('Respuesta texto:', responseText);
    
    // Intentar parsear el texto como JSON si existe
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      data = {};
    }
    
    console.log('Datos de respuesta:', data);

    // 3. Manejar la respuesta de la API
    if (!response.ok) {
      console.error('Error en la solicitud:', response.status, data);
      return {
        success: false,
        message: data.message || `Error al procesar la solicitud: ${response.status} ${response.statusText}`,
        errors: { _form: [data.message || `Error al procesar la solicitud: ${response.status} ${response.statusText}`] }
      };
    }

    // 4. Solicitud exitosa: devolver estado de éxito
    // Nota: Por seguridad, siempre devolvemos un mensaje de éxito aunque el correo no exista
    return {
      success: true,
      message: "Si el correo existe en nuestra base de datos, recibirás instrucciones para restablecer tu contraseña.",
    };

  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);
    // Mostrar más detalles del error
    if (error instanceof Error) {
      console.error('Nombre del error:', error.name);
      console.error('Mensaje del error:', error.message);
      console.error('Stack trace:', error.stack);
    }
    return {
      success: false,
      message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      errors: { _form: [`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`] }
    };
  }
}

// Esquema de validación para restablecer contraseña
const ResetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { 
      message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &)" 
    }),
  token: z.string().min(1, { message: "El token es requerido" }),
});

// Acción para restablecer contraseña
export async function resetPassword(
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  // 1. Validar los datos del formulario usando Zod
  const validatedFields = ResetPasswordSchema.safeParse({
    password: formData.get('password'),
    token: formData.get('token'),
  });

  // Si la validación falla, devolver los errores
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Error de validación. Por favor, revisa los campos.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Si la validación es exitosa, proceder con la llamada a la API
  const { password, token } = validatedFields.data;
  
  try {
    console.log('Enviando solicitud de restablecimiento de contraseña con token:', token.substring(0, 10) + '...');
    console.log('URL de la API:', `${process.env.NEXT_PUBLIC_NEST_API_URL}auth/reset-password`);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, token }),
    });

    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    // Intentar obtener el texto de la respuesta primero
    const responseText = await response.text();
    console.log('Respuesta texto:', responseText);
    
    // Intentar parsear el texto como JSON si existe
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      data = {};
    }
    
    console.log('Datos de respuesta:', data);

    // 3. Manejar la respuesta de la API
    if (!response.ok) {
      console.error('Error en la solicitud:', response.status, data);
      
      // Manejar errores de validación de contraseña
      if (response.status === 400 && data.message) {
        const messages = Array.isArray(data.message) ? data.message : [data.message];
        
        // Verificar si el error está relacionado con la validación de contraseña
        const passwordErrors = messages.filter((msg: string) => 
          typeof msg === 'string' && (
            msg.includes('contraseña') || 
            msg.includes('password') ||
            msg.toLowerCase().includes('mayúscula') ||
            msg.toLowerCase().includes('minúscula') ||
            msg.toLowerCase().includes('carácter especial')
          )
        );
        
        if (passwordErrors.length > 0) {
          return {
            success: false,
            message: 'Error de validación de contraseña',
            errors: { 
              password: passwordErrors,
              _form: ['Por favor, verifica que tu contraseña cumpla con todos los requisitos.']
            }
          };
        }
      }
      
      // Otros errores
      return {
        success: false,
        message: data.message || `Error al restablecer la contraseña: ${response.status} ${response.statusText}`,
        errors: { _form: Array.isArray(data.message) ? data.message : [data.message || `Error al restablecer la contraseña: ${response.status} ${response.statusText}`] }
      };
    }

    // 4. Restablecimiento exitoso: devolver estado de éxito
    return {
      success: true,
      message: "¡Contraseña restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.",
    };

  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    // Mostrar más detalles del error
    if (error instanceof Error) {
      console.error('Nombre del error:', error.name);
      console.error('Mensaje del error:', error.message);
      console.error('Stack trace:', error.stack);
    }
    return {
      success: false,
      message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      errors: { _form: [`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`] }
    };
  }
}
