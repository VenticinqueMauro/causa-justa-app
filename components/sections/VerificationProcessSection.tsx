'use client';

import useParallax from "@/hooks/useParallax";
import { useLenis } from "lenis/react";
import { CheckCircle, FileText, Shield } from "lucide-react";
import { useRef } from "react";
import StartCauseButton from "../actions/StartCauseButton";
import HorizontalScroll from "../animations/HorizontalScroll";
import RevealSection from "../animations/RevealSection";
import BrutalHeading from "../ui/BrutalHeading";
import BrutalSection from "../ui/BrutalSection";

const VerificationProcessSection = () => {
  // Parallax effect for the title section
  const titleRef = useParallax<HTMLDivElement>({
    speed: 0.05,
    direction: 'up',
    maxMovement: 20,
  });

  // Parallax effect for the recommendations box
  const recommendationsRef = useParallax<HTMLDivElement>({
    speed: 0.03,
    direction: 'down',
    maxMovement: 15,
  });

  // Refs for interactive elements
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // Use Lenis for scroll-based interactions
  useLenis(({ scroll, progress }) => {
    // Function to add subtle floating effect to steps
    const applyFloatEffect = (element: HTMLDivElement | null, offset: number = 0) => {
      if (!element) return;
      
      // Get element position
      const rect = element.getBoundingClientRect();
      
      // Only apply effect when element is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
        
        // Apply subtle floating effect with slight delay between steps
        const floatY = Math.sin((scroll * 0.002) + offset) * 5;
        
        element.style.transform = `translateY(${floatY}px)`;
        element.style.transition = 'transform 0.5s ease-out';
      }
    };
    
    // Apply floating effects with different offsets for a staggered look
    applyFloatEffect(step1Ref.current, 0);
    applyFloatEffect(step2Ref.current, 2);
    applyFloatEffect(step3Ref.current, 4);
  });

  return (
    <BrutalSection className="overflow-hidden">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="mb-12 text-center">
          <RevealSection animation="fade-down" duration={1000}>
            <BrutalHeading className="text-3xl md:text-4xl">Proceso de Verificación</BrutalHeading>
          </RevealSection>
          <RevealSection animation="fade-up" delay={200} duration={800}>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
              Revisamos cada causa para asegurar que cumpla con nuestros estándares de transparencia
            </p>
          </RevealSection>
        </div>

        {/* Mobile view: standard grid with intentional misalignment */}
        <div className="grid gap-8 md:grid-cols-3 md:hidden">
          <RevealSection animation="fade-right" delay={300} duration={800}>
            <div 
              ref={step1Ref}
              className="border-2 border-[#002C5B] bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] h-full -rotate-1 transform"
            >
              <div className="flex flex-row items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mb-2 md:mb-0 md:mr-4 animate-float">
                  <FileText className="h-6 w-6 text-[#002C5B]" />
                </div>
                <h3 className="text-lg font-bold text-[#002C5B] uppercase pl-2">Revisión Inicial</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Verificamos que la causa esté bien documentada, con imágenes y explicación clara del propósito.
              </p>
            </div>
          </RevealSection>

          <RevealSection animation="fade-up" delay={400} duration={800}>
            <div 
              ref={step2Ref}
              className="border-2 border-[#002C5B] bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] h-full rotate-1 transform translate-y-2"
            >
              <div className="flex flex-row items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mb-2 md:mb-0 md:mr-4 animate-float">
                  <Shield className="h-6 w-6 text-[#002C5B]" />
                </div>
                <h3 className="text-lg font-bold text-[#002C5B] uppercase pl-2">Moderación</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Comprobamos que no contenga material inapropiado y que cumpla con nuestras políticas comunitarias.
              </p>
            </div>
          </RevealSection>

          <RevealSection animation="fade-left" delay={500} duration={800}>
            <div 
              ref={step3Ref}
              className="border-2 border-[#002C5B] bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] h-full -rotate-1 transform translate-y-1"
            >
              <div className="flex flex-row items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mb-2 md:mb-0 md:mr-4 animate-float">
                  <CheckCircle className="h-6 w-6 text-[#002C5B]" />
                </div>
                <h3 className="text-lg font-bold text-[#002C5B] uppercase pl-2">Publicación</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Las causas que cumplen con nuestros estándares son publicadas y quedan disponibles para recibir donaciones.
              </p>
            </div>
          </RevealSection>
        </div>

        {/* Desktop view: horizontal scroll with intentional misalignment */}
        <div className="hidden md:block">
          <RevealSection animation="fade-up" delay={300} duration={1000}>
            <HorizontalScroll speed={0.8} containerClassName="py-4">
              <div 
                ref={step1Ref}
                className="border-2 border-[#002C5B] bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] min-w-[300px] w-[350px] mx-4 h-[200px] flex flex-col -rotate-1 transform -translate-y-2"
              >
                <div className="flex flex-row items-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mb-2 md:mb-0 md:mr-4">
                    <FileText className="h-6 w-6 text-[#002C5B]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#002C5B] uppercase pl-2">Revisión Inicial</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Verificamos que la causa esté bien documentada, con imágenes y explicación clara del propósito.
                </p>
              </div>

              <div 
                ref={step2Ref}
                className="border-2 border-[#002C5B] bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] min-w-[300px] w-[350px] mx-4 h-[200px] flex flex-col rotate-1 transform translate-y-3"
              >
                <div className="flex flex-row items-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mb-2 md:mb-0 md:mr-4">
                    <Shield className="h-6 w-6 text-[#002C5B]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#002C5B] uppercase pl-2">Moderación</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Comprobamos que no contenga material inapropiado y que cumpla con nuestras políticas comunitarias.
                </p>
              </div>

              <div 
                ref={step3Ref}
                className="border-2 border-[#002C5B] bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] min-w-[300px] w-[350px] mx-4 h-[200px] flex flex-col -rotate-1 transform"
              >
                <div className="flex flex-row items-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mb-2 md:mb-0 md:mr-4">
                    <CheckCircle className="h-6 w-6 text-[#002C5B]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#002C5B] uppercase pl-2">Publicación</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Las causas que cumplen con nuestros estándares son publicadas y quedan disponibles para recibir donaciones.
                </p>
              </div>
            </HorizontalScroll>
          </RevealSection>
        </div>

        <RevealSection animation="fade-up" delay={600} duration={1000}>
          <div 
            ref={recommendationsRef}
            className="mt-10 border-2 border-dashed border-[#002C5B] bg-white p-6 max-w-5xl mx-auto rotate-[0.3deg] transform"
          >
            <h3 className="text-xl font-bold text-[#002C5B] uppercase mb-4 text-center">Recomendaciones para crear una causa exitosa</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <RevealSection animation="fade-right" delay={700} duration={800}>
                <div className="flex flex-col items-center">
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
                    <li>Imágenes claras y relevantes de la causa</li>
                    <li>Descripción detallada del propósito</li>
                    <li>Explicación de cómo se utilizarán los fondos</li>
                    <li>Conexión con MercadoPago verificada</li>
                    <li>Información de contacto actualizada</li>
                  </ul>
                </div>
              </RevealSection>
              <RevealSection animation="fade-left" delay={800} duration={800}>
                <div className="flex flex-col items-center">
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
                    <li>Incluir testimonios o referencias</li>
                    <li>Compartir actualizaciones regulares</li>
                    <li>Establecer metas realistas</li>
                    <li>Ser transparente sobre el uso de fondos</li>
                    <li>Responder a preguntas de donantes</li>
                  </ul>
                </div>
              </RevealSection>
            </div>
            <div className="mt-6 text-center">
              <RevealSection animation="fade-up" delay={900} duration={800}>
                <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-sm">
                  Recuerda: La transparencia es clave para generar confianza. Cuanta más información proporciones, más probabilidades tendrás de recibir donaciones.
                </p>
                <div className="flex justify-center">
                  <StartCauseButton variant="outline" size="sm" className="text-sm hover:shadow-[7px_7px_0px_0px_rgba(0,44,91,0.9)] transition-all duration-300" text="Crear una causa" />
                </div>
              </RevealSection>
            </div>
          </div>
        </RevealSection>
      </div>
    </BrutalSection>
  );
};

export default VerificationProcessSection;
