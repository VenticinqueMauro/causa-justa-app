# Guía de Tipos Centralizados

## Introducción

Este documento describe la nueva estructura centralizada de tipos implementada en la aplicación. Esta estructura mejora la mantenibilidad y escalabilidad del código, facilitando las actualizaciones cuando el backend cambie y asegurando consistencia en toda la aplicación.

## Estructura de Tipos

La estructura de tipos se encuentra en la carpeta `types/` y está organizada de la siguiente manera:

1. **enums.ts**: Contiene todas las enumeraciones utilizadas en la aplicación
   - `UserRole`: Roles de usuario (ADMIN, DONOR, BENEFICIARY, USER)
   - `CampaignStatus`: Estados de campaña (PENDING, VERIFIED, REJECTED)
   - `DonationStatus`: Estados de donación (pending, completed, failed)
   - `CampaignCategory`: Categorías de campaña (HEALTH, EDUCATION, FOOD, PEOPLE, OTHERS)

2. **responses.ts**: DTOs de respuesta del backend
   - `UserInfoDto`: Información básica del usuario
   - `CampaignResponseDto`: Respuesta de campaña del backend
   - `AuthResponseDto`: Respuesta de autenticación
   - `PaginatedResponseDto`: Respuesta paginada genérica

3. **requests.ts**: DTOs de solicitud para el backend
   - `LoginDto`: Datos de inicio de sesión
   - `RegisterDto`: Datos de registro
   - `RefreshTokenDto`: Token de actualización
   - `CreateCampaignDto`: Datos para crear campaña
   - `FindCampaignsDto`: Parámetros para buscar campañas
   - `FindDonationsDto`: Parámetros para buscar donaciones

4. **payments.ts**: Interfaces relacionadas con pagos y donaciones
   - `PaymentPreference`: Preferencia de pago (MercadoPago)
   - `Donation`: Información de donación

5. **index.ts**: Archivo central que exporta todos los tipos para facilitar la importación

## Cómo Usar los Tipos Centralizados

Para utilizar los tipos centralizados en tu código, simplemente importa desde `@/types`:

```typescript
import { UserRole, CampaignStatus, CampaignCategory } from '@/types';
```

### Ejemplos de Uso

#### Uso de Enumeraciones

```typescript
// Antes
const userRole = 'BENEFICIARY';

// Después
import { UserRole } from '@/types';
const userRole = UserRole.BENEFICIARY;
```

#### Uso de Interfaces

```typescript
// Antes
import { CampaignFormData } from '@/types/campaign';

// Después
import { CampaignFormData } from '@/types';
```

## Migración Progresiva

Para migrar progresivamente a la nueva estructura de tipos:

1. Identifica los archivos que importan tipos directamente desde archivos específicos
2. Actualiza las importaciones para usar el archivo centralizado `@/types`
3. Asegúrate de que los tipos utilizados coincidan con los definidos en la estructura centralizada

## Beneficios

- **Consistencia**: Todos los componentes usan exactamente las mismas definiciones de tipos
- **Sincronización con el backend**: Los tipos reflejan exactamente lo que espera el backend
- **Facilidad de importación**: Un solo punto de entrada para todos los tipos
- **Mantenibilidad**: Cuando el backend cambie, solo necesitarás actualizar estos archivos
- **Prevención de errores**: TypeScript detectará errores de tipo en tiempo de compilación

## Propuesta de Categorías Adicionales

Se ha propuesto ampliar las categorías de campañas para incluir:

- `HOUSING`: Vivienda
- `EMERGENCY`: Emergencias y Desastres
- `CHILDREN`: Infancia y Juventud
- `ELDERLY`: Adultos Mayores
- `DISABILITY`: Discapacidad e Inclusión
- `ANIMALS`: Animales y Mascotas
- `ENVIRONMENT`: Medio Ambiente
- `SOCIAL_ENTERPRISE`: Emprendimiento Social
- `ARTS`: Arte y Cultura
- `SPORTS`: Deporte e Inclusión

Esta propuesta está pendiente de aprobación por parte del equipo de backend.
