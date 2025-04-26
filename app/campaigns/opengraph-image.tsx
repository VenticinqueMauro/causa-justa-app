import { ImageResponse } from 'next/og';

// Configuración de la imagen
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
 * Genera la imagen OpenGraph para la página principal de campañas
 * Esta imagen se mostrará cuando se comparta la URL de la página de campañas en redes sociales
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: '#ECECE2',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Encabezado con logo */}
        <div style={{ 
          fontSize: 48, 
          fontWeight: 'bold', 
          color: '#002C5B',
          marginBottom: '30px',
        }}>
          Causa Justa
        </div>
        
        {/* Contenido principal */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          background: 'white',
          border: '3px solid #002C5B',
          padding: '40px',
          boxShadow: '8px 8px 0px 0px rgba(0,44,91,0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{ 
            fontSize: 64, 
            fontWeight: 'bold', 
            color: '#002C5B',
            marginBottom: '30px',
            lineHeight: 1.2,
          }}>
            Campañas Solidarias
          </div>
          
          <div style={{ 
            fontSize: 36, 
            color: '#4A4A4A',
            marginBottom: '40px',
            lineHeight: 1.4,
            maxWidth: '80%',
          }}>
            Explora todas las campañas activas y ayuda a quienes más lo necesitan
          </div>
          
          {/* Categorías */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '20px',
          }}>
            {['Salud 🏥', 'Educación 📚', 'Viajes ✈️', 'Estudios 📖', 'Emergencias 🚨', 'Proyectos 💼'].map((category) => (
              <div key={category} style={{
                backgroundColor: '#002C5B',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: 24,
              }}>
                {category}
              </div>
            ))}
          </div>
        </div>
        
        {/* Pie de página */}
        <div style={{ 
          marginTop: '20px',
          fontSize: 24,
          color: '#002C5B',
          textAlign: 'center',
        }}>
          causajusta.org/campaigns
        </div>
      </div>
    ),
    { 
      ...size,
      // Optimizaciones para mejorar la calidad y rendimiento
      emoji: 'twemoji', // Soporte para emojis consistentes
      debug: false, // Deshabilitar en producción
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400' // Caché por 1 día
      }
    }
  );
}
