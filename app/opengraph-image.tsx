import { ImageResponse } from 'next/og';

// Configuración de la imagen
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Configuración de revalidación
export const revalidate = 86400; // Revalidar cada día

// Función para generar la imagen OG estática para la página principal
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
          fontFamily: 'sans-serif',
        }}
      >
        {/* Encabezado con logo */}
        <div style={{ 
          fontSize: 48, 
          fontWeight: 'bold', 
          color: '#002C5B',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
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
              width: '30px',
              height: '30px',
              color: '#002C5B',
              textAlign: 'center',
            }}>
              ❤️
            </div>
          </div>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '-8px' }}>Por una</div>
            <div>Causa Justa</div>
          </div>
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
            Recauda fondos para tu causa
          </div>
          
          <div style={{ 
            fontSize: 36, 
            color: '#4A4A4A',
            marginBottom: '40px',
            lineHeight: 1.4,
            maxWidth: '80%',
          }}>
            Viajes, estudios, emergencias, proyectos personales o solidarios
          </div>
          
          {/* Categorías */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '20px',
          }}>
            {['Salud', 'Educación', 'Viajes', 'Estudios', 'Emergencias', 'Proyectos'].map((category) => (
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
          causajusta.org
        </div>
      </div>
    ),
    { ...size }
  );
}
