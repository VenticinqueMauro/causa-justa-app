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
};

// Función para generar la imagen OG estática para la página principal
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: 'linear-gradient(135deg, #ECECE2 0%, #FFFFFF 100%)', // Gradiente sutil
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '50px',
          fontFamily: 'Inter, sans-serif',
          position: 'relative', // Para posicionamiento absoluto de elementos decorativos
        }}
      >
        {/* Elementos decorativos de fondo */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `${colors.primary}20`, // Color primario con opacidad
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '60px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `${colors.accent}15`, // Color de acento con opacidad
          zIndex: 0,
        }} />
        
        {/* Logo y nombre de la marca */}
        <div style={{ 
          fontSize: 64, 
          fontWeight: 'bold', 
          color: colors.primary,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          zIndex: 1,
          position: 'relative',
        }}>
          <div style={{
            width: '90px',
            height: '90px',
            backgroundColor: colors.white,
            border: `3px solid ${colors.primary}`,
            boxShadow: `6px 6px 0px 0px ${colors.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
          }}>
            <div style={{
              fontSize: '50px',
              color: colors.primary,
              textAlign: 'center',
            }}>
              ❤️
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '32px', marginBottom: '-12px', fontWeight: '500' }}>Por una</div>
            <div style={{ fontSize: '72px', letterSpacing: '-1px' }}>Causa Justa</div>
          </div>
        </div>
        
        {/* Contenido principal - Mensaje principal y CTA */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          background: colors.white,
          border: `4px solid ${colors.primary}`,
          borderRadius: '16px',
          padding: '40px',
          boxShadow: `10px 10px 0px 0px ${colors.primary}`,
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 1,
          position: 'relative',
          margin: '10px 0 30px 0',
        }}>
          {/* Mensaje principal */}
          <div style={{ 
            fontSize: 72, 
            fontWeight: 'bold', 
            color: colors.primary,
            marginBottom: '30px',
            lineHeight: 1.1,
            maxWidth: '90%',
            letterSpacing: '-1px',
          }}>
            Recauda fondos para tu causa
          </div>
          
          {/* Descripción */}
          <div style={{ 
            fontSize: 36, 
            color: colors.text,
            marginBottom: '40px',
            lineHeight: 1.4,
            maxWidth: '85%',
            fontWeight: '500',
          }}>
            Plataforma de recaudación de fondos para todo tipo de causas: viajes, estudios, emergencias o proyectos personales
          </div>
          
          {/* Botón de llamada a la acción */}
          <div style={{
            backgroundColor: colors.accent,
            color: colors.white,
            padding: '16px 40px',
            borderRadius: '8px',
            fontSize: 32,
            fontWeight: 'bold',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            marginTop: '10px',
          }}>
            ¡Crea tu causa ahora!
          </div>
          
          {/* Categorías */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '14px',
            marginTop: '40px',
          }}>
            {['Salud', 'Educación', 'Viajes', 'Estudios', 'Emergencias', 'Proyectos', 'Solidaridad'].map((category, index) => (
              <div key={category} style={{
                backgroundColor: index % 2 === 0 ? colors.primary : colors.accent,
                color: colors.white,
                padding: '8px 20px',
                borderRadius: '30px', // Pill shape
                fontSize: 24,
                fontWeight: '500',
              }}>
                {category}
              </div>
            ))}
          </div>
        </div>
        
        {/* Pie de página */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginTop: '10px',
          zIndex: 1,
        }}>
          <div style={{ 
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.primary,
          }}>
            causajusta.org
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
          }}>
            {/* Iconos de redes sociales simplificados */}
            {['📱', '📧', '🌐'].map((icon) => (
              <div key={icon} style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: colors.primary,
                color: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { 
      ...size,
      // Optimizaciones necesarias para evitar errores de renderizado
      emoji: 'twemoji',
      debug: false,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Caché por 1 día
        'Content-Type': 'image/jpeg', // Forzar el tipo de contenido para mejor compatibilidad
        'Content-Disposition': 'inline; filename="causa-justa-home.jpg"' // Ayuda con la compatibilidad
      }
    }
  );
}
