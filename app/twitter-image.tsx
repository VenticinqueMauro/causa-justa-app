import { ImageResponse } from 'next/og';

// Configuración de la imagen para Twitter
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Texto alternativo para accesibilidad
export const alt = 'Por una Causa Justa - Plataforma de recaudación de fondos para todo tipo de causas';

// Configuración de revalidación
export const revalidate = 86400; // Revalidar cada día

// Configuración de runtime para asegurar que funcione correctamente
export const runtime = 'edge';

/**
 * Genera la imagen Twitter Card para la página principal
 * Optimizada específicamente para el formato de Twitter
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: 'linear-gradient(to bottom right, #ECECE2, #FFFFFF)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Encabezado */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '30px',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'white',
            border: '2px solid #002C5B',
            boxShadow: '4px 4px 0px 0px rgba(0,44,91,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              fontSize: '30px',
              textAlign: 'center',
            }}>
              ❤️
            </div>
          </div>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#002C5B',
          }}>
            <span style={{ fontSize: '20px', fontWeight: 'normal' }}>Por una</span>
            <br />
            Causa Justa
          </div>
        </div>
        
        {/* Contenido principal */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          background: 'white',
          border: '3px solid #002C5B',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '8px 8px 0px 0px rgba(0,44,91,0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#002C5B',
            marginBottom: '24px',
            lineHeight: 1.2,
          }}>
            Recauda fondos para tu causa
          </div>
          
          <div style={{ 
            fontSize: '28px', 
            color: '#4A4A4A',
            marginBottom: '32px',
            lineHeight: 1.4,
            maxWidth: '80%',
          }}>
            Viajes ✈️ • Estudios 📚 • Emergencias 🚨 • Proyectos personales 💼
          </div>
          
          {/* CTA */}
          <div style={{
            backgroundColor: '#002C5B',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '28px',
            fontWeight: 'bold',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.2)',
          }}>
            Crea tu campaña
          </div>
        </div>
        
        {/* Pie de página */}
        <div style={{ 
          marginTop: '20px',
          fontSize: '20px',
          color: '#002C5B',
          textAlign: 'center',
        }}>
          causajusta.org • Síguenos @PorUnaCausaJusta
        </div>
      </div>
    ),
    { 
      ...size,
      // Optimizaciones para mejorar la calidad y rendimiento
      emoji: 'twemoji',
      debug: false,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    }
  );
}
