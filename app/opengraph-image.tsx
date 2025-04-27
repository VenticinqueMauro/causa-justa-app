import { ImageResponse } from 'next/og';

// Configuración de la imagen
export const size = {
  width: 1200,
  height: 630,
};

// Cambiado a JPEG para mejor compatibilidad con plataformas de mensajería
export const contentType = 'image/jpeg';

// Texto alternativo para la imagen
export const alt = 'Causa Justa - Plataforma de recaudación de fondos para todo tipo de causas';

// Configuración de revalidación
export const revalidate = 86400; // Revalidar cada día

// Configuración de runtime para asegurar que funcione correctamente
export const runtime = 'edge';

// Colores de la marca
const colors = {
  primary: '#002C5B',    // Azul oscuro
  secondary: '#ECECE2',  // Beige claro
  accent: '#FF5C39',     // Naranja/Coral para acentos
  text: '#2D3748',       // Gris oscuro para texto
  white: '#FFFFFF',      // Blanco
  lightBlue: '#E5F0FF',  // Azul claro para fondos
  darkAccent: '#E64A19', // Naranja más oscuro
};

// Función para generar la imagen OG estática para la página principal
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: colors.secondary, // Fondo azul oscuro como en la imagen
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          color: colors.primary,
        }}
      >
        {/* Logo en la esquina superior derecha */}
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          {/* Cuadro con corazón */}
          <div style={{
            width: '60px',
            height: '60px',
            border: `2px solid ${colors.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0px',
          }}>
            {/* Corazón blanco */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          
          {/* Texto "POR UNA CAUSA JUSTA" */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '24px',
            fontWeight: 'bold',
            lineHeight: '1.1',
          }}>
            <div style={{ display: 'block' }}>POR UNA</div>
            <div style={{ display: 'block' }}>CAUSA JUSTA</div>
          </div>
        </div>
        
        {/* Espacio para centrar el contenido principal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* Título principal grande */}
          <div style={{ 
            fontSize: 96, 
            fontWeight: 'bold', 
            lineHeight: 1.1,
            marginBottom: '40px',
            letterSpacing: '-1px',
            maxWidth: '90%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center'
          }}>
            <div style={{ display: 'block', fontWeight: 'bold' }}>DONA PARA CUALQUIER CAUSA</div>
          </div>
          
          {/* Descripción en recuadro con estilo brutal */}
          <div style={{ 
            fontSize: 28, 
            lineHeight: 1.4,
            maxWidth: '85%',
            fontWeight: '500',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.white,
            color: colors.primary,
            padding: '24px 32px',
            border: `3px solid ${colors.primary}`,
            borderRadius: '0px',
            boxShadow: `6px 6px 0px 0px ${colors.primary}`,
            marginTop: '20px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'block' }}>Plataforma de recaudación de fondos para todo tipo de causas: viajes, estudios, emergencias o proyectos personales y solidarios</div>
            <div style={{ display: 'block' }}></div>
            <div style={{ display: 'block' }}></div>
          </div>
        </div>
      </div>
    ),
    {
      ...size
    },
  );
}
