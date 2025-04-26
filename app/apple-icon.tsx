import { ImageResponse } from 'next/og';

// Configuración de la imagen
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Configuración de runtime para asegurar que funcione correctamente
export const runtime = 'edge';

/**
 * Función para generar el icono de Apple
 * 
 * Siguiendo la documentación oficial de Next.js:
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: '22%',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            width: '80%',
            height: '80%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#002C5B',
            color: 'white',
            fontSize: '120px',
            borderRadius: '16%',
          }}
        >
          ❤️
        </div>
      </div>
    ),
    { 
      ...size,
    }
  );
}
