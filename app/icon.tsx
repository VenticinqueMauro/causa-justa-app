import { ImageResponse } from 'next/og';

// Configuración de la imagen
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Configuración de runtime - esencial para que funcione correctamente
export const runtime = 'edge';

// Función para generar el favicon dinámicamente
export default function Icon() {
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
          border: '2px solid #002C5B',
          padding: '4px',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            color: '#002C5B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
