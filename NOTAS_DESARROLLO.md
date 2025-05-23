# Notas de Desarrollo - Causa Justa App

## Fecha: 16 de abril de 2025
## Última actualización: 18 de abril de 2025 (10:28)

## Estado actual del proyecto

### Funcionalidades implementadas en el Front-end

#### Sistema de autenticación
- ✅ Registro de usuarios con validación (POST /auth/register)
- ✅ Inicio de sesión (POST /auth/login)
- ✅ Cierre de sesión (POST /auth/logout)
- ✅ Verificación de email (GET /auth/verify-email)
- ✅ Obtener información del usuario autenticado (GET /auth/me)
- ✅ Recuperación de contraseña (POST /auth/forgot-password y POST /auth/reset-password)
- ✅ Persistencia de sesión (almacenamiento y recuperación de tokens)

#### Componentes UI
- ✅ Header con navegación y estado de autenticación
- ✅ Componentes de UI personalizados (BrutalButton, BrutalLink, BrutalHeading, BrutalSection)
- ✅ Sistema de notificaciones (Toast)

### Funcionalidades pendientes de implementar

#### Autenticación
- ⚠️ Reenvío de correo de verificación (GET /auth/resend-verification) - Implementado en backend, pendiente en frontend
- ✅ Autenticación con Google (GET /auth/google y GET /auth/google/redirect)
- ✅ Selección de rol para usuarios de Google (POST /auth/update-role)

#### Gestión de Usuarios (Admin)
- ❌ Crear usuario (POST /users)
- ❌ Obtener todos los usuarios (GET /users)
- ❌ Obtener usuario por ID (GET /users/{id})
- ❌ Actualizar usuario (PATCH /users/{id})
- ❌ Eliminar usuario (DELETE /users/{id})

#### Campañas
- ⚠️ Crear campaña (POST /campaigns) - Implementado en frontend, pendiente de pruebas completas
- ❌ Obtener todas las campañas verificadas (GET /campaigns)
- ❌ Obtener todas las campañas (admin) (GET /campaigns/admin/all)
- ❌ Obtener campaña por ID o slug (GET /campaigns/{idOrSlug})
- ❌ Verificar campaña (admin) (PATCH /campaigns/{id}/verify)
- ✅ Subir imágenes para campaña (POST /campaigns/images/upload)

#### Integración con MercadoPago
- ✅ Conectar cuenta (GET /mercadopago/connect)
- ✅ Callback de conexión (GET /mercadopago/callback)
- ❌ Crear preferencia de pago (POST /mercadopago/payment/preference)
- ❌ Webhook para notificaciones (POST /mercadopago/webhook)
- ✅ Obtener estado (GET /mercadopago/status)
- ❌ Desconectar cuenta (POST /mercadopago/disconnect)
- ❌ Obtener usuarios conectados (admin) (GET /mercadopago/admin/users)

### Páginas pendientes de implementar
- ❌ Página de campañas (listado y detalle)
- ⚠️ Página de creación/edición de campañas - Implementada la creación, pendiente edición
- ❌ Panel de administración
- ❌ Página "Cómo funciona"
- ❌ Página "Sobre nosotros"
- ❌ Página "Contacto"
- ✅ Página de recuperación de contraseña (formulario y proceso completo)
- ❌ Página de perfil de usuario

## Próximos pasos

1. Implementar el reenvío de correo de verificación
2. ✅ Implementar la autenticación con Google
3. ⚠️ Implementar la gestión de campañas (listado, detalle, creación) - Creación implementada, pendiente listado y detalle
4. ✅ Desarrollar la integración con MercadoPago (Conexión y verificación implementadas)
5. Crear el panel de administración
6. Implementar las páginas informativas
7. Mejorar la experiencia de usuario para donantes que quieran crear campañas (solicitud de cambio de rol)

## Notas técnicas

- El backend está desarrollado en NestJS
- El frontend utiliza Next.js con App Router
- La autenticación se maneja con cookies y JWT
- Los estilos se implementan con TailwindCSS
- Se utiliza Zod para validación de formularios
- La autenticación con Google, el reenvío de correo de verificación y la recuperación de contraseña ya están implementados en el backend
- La validación de contraseñas está sincronizada entre frontend y backend, utilizando la misma expresión regular
- Las contraseñas deben cumplir con los siguientes requisitos:
  - Al menos 8 caracteres
  - Al menos una letra mayúscula
  - Al menos una letra minúscula
  - Al menos un número
  - Al menos un carácter especial (@, $, !, %, *, ?, &)

### Integración con MercadoPago
- Se ha implementado un componente reutilizable `StartCauseButton` que encapsula toda la lógica de verificación y conexión con MercadoPago
- El proceso de verificación incluye:
  1. Verificar si el usuario está autenticado
  2. Verificar si el usuario tiene el rol BENEFICIARY
  3. Verificar si el usuario tiene una cuenta de MercadoPago conectada
- Se utiliza localStorage para almacenar el estado de conexión con MercadoPago para optimizar las verificaciones
- Se ha mejorado el manejo de errores para proporcionar mensajes claros al usuario

### Creación de campañas
- Se ha implementado el formulario completo de creación de campañas con validaciones
- Se ha mejorado la experiencia de usuario con funcionalidades como:
  - Mostrar el monto en palabras para mejor comprensión
  - Formateo automático de números con separadores de miles
  - Cálculo de comisiones y monto neto a recibir
  - Interfaz de "chips" para gestionar etiquetas
  - Autocompletado de información del creador con datos del usuario
- Pendiente: Implementar redirección a solicitud de cambio de rol cuando un usuario donante intenta crear una campaña

## Prioridades

1. Completar funcionalidades de autenticación (reenvío de verificación, Google Auth)
2. Implementación de campañas (core del negocio)
3. Integración de pagos con MercadoPago
4. Panel de administración
5. Funcionalidades secundarias y páginas informativas
