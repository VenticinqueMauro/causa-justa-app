'use client';

import React, { useRef, useState, useEffect } from "react";
import BrutalSection from "../ui/BrutalSection"; // Asegúrate de que estas rutas sean correctas
import BrutalHeading from "../ui/BrutalHeading";
import { steps } from "@/data/sampleData"; // Asegúrate de que esta ruta sea correcta
import RevealSection from "../animations/RevealSection"; // Mantenemos para animaciones de entrada
import { useLenis } from "lenis/react";

interface Step {
  title: string;
  description: string;
}

const StepsSection = () => {
  // Usa Ref<HTMLElement> ya que BrutalSection ahora reenvía la ref a un HTMLElement (section)
  const sectionRef = useRef<HTMLElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null); // Referencia para la línea vertical
  // La ref para el fondo parallax ya no es necesaria si lo animamos via style en el callback de Lenis
  // const parallaxBgRef = useRef<HTMLDivElement>(null);

  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [sectionScrollProgress, setSectionScrollProgress] = useState(0);

  // --- Estado y Ref para la altura y posición de la línea vertical ---
  const [lineBaseHeight, setLineBaseHeight] = useState(0);
  const lineTopPositionRef = useRef(0); // Usamos ref para no causar re-renders al cambiar solo la posición top

  // --- Calcula la altura y posición de la línea vertical una vez al montar o redimensionar ---
  useEffect(() => {
    const calculateLineMetrics = () => {
      if (sectionRef.current && verticalLineRef.current) {
        const stepNumbers = sectionRef.current.querySelectorAll('.step-number');

        if (stepNumbers.length > 1) {
          // Usa getBoundingClientRect para posiciones relativas al viewport y calcula respecto al parent
          const firstNum = stepNumbers[0] as HTMLElement; // Aserción de tipo aquí
          const lastNum = stepNumbers[stepNumbers.length - 1] as HTMLElement; // Y aquí
          const parentRect = verticalLineRef.current.parentElement?.getBoundingClientRect();

          if (parentRect) {
            const firstNumCenterY = firstNum.getBoundingClientRect().top + firstNum.offsetHeight / 2; // Usa offsetHeight o clientHeight
            const lastNumCenterY = lastNum.getBoundingClientRect().top + lastNum.offsetHeight / 2;

            const calculatedHeight = lastNumCenterY - firstNumCenterY;
            const topRelativeToParent = firstNumCenterY - parentRect.top; // Posiciona el top de la línea en el centro del primer número

            setLineBaseHeight(calculatedHeight);
            lineTopPositionRef.current = topRelativeToParent; // Actualiza la ref

            // Aplica la posición top calculada
            verticalLineRef.current.style.top = `${topRelativeToParent}px`;
            // La altura base también se puede aplicar aquí
            verticalLineRef.current.style.height = `${calculatedHeight}px`;

          }
        } else {
          // Manejar caso con 0 o 1 paso si es necesario
          setLineBaseHeight(0);
          lineTopPositionRef.current = 0;
          if (verticalLineRef.current) {
            verticalLineRef.current.style.height = '0px';
          }
        }
      }
    };

    // Calcular al montar
    calculateLineMetrics();

    // Recalcular al redimensionar la ventana
    window.addEventListener('resize', calculateLineMetrics);

    // Limpiar el event listener al desmontar
    return () => {
      window.removeEventListener('resize', calculateLineMetrics);
    };
  }, [steps]); // Dependencia 'steps' por si el número de pasos pudiera cambiar


  // Lenis scroll integration
  useLenis(({ scroll, progress }) => {
    // Asegúrate de que la sección y la línea vertical existen
    if (!sectionRef.current || !verticalLineRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // --- Cálculo de progreso dentro de la sección (mejorado para mayor precisión) ---
    // Utilizamos una ventana de scroll más amplia para un control más preciso
    const startPoint = windowHeight * 0.9; // Punto de inicio más temprano (90% del viewport)
    const endPoint = windowHeight * 0.1;   // Punto final más tardío (10% del viewport)
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const sectionBottom = rect.bottom;

    let progressWithinSection = 0;

    // Si la sección está completamente fuera de la vista
    if (sectionTop >= windowHeight || sectionBottom <= 0) {
      progressWithinSection = sectionTop >= windowHeight ? 0 : 1;
    } 
    // Si la sección está parcialmente visible
    else if (sectionTop > startPoint) {
      progressWithinSection = 0; // Sección aún no ha llegado al punto de inicio
    } else if (sectionTop < endPoint) {
      // Calculamos qué tan lejos ha pasado la sección del punto final
      const extraProgress = Math.min(1, Math.abs(sectionTop - endPoint) / (sectionHeight * 0.3));
      progressWithinSection = Math.min(1, 1 + extraProgress * 0.2); // Permite un pequeño exceso controlado
    } else {
      // Interpolación lineal mejorada con suavizado
      const rawProgress = 1 - (sectionTop - endPoint) / (startPoint - endPoint);
      // Aplicamos una curva de suavizado (easeInOutQuad)
      progressWithinSection = rawProgress < 0.5 
        ? 2 * rawProgress * rawProgress 
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
    }

    // Clampeamos el progreso entre 0 y 1 por seguridad
    progressWithinSection = Math.max(0, Math.min(1, progressWithinSection));

    setSectionScrollProgress(progressWithinSection);

    // --- Animar la escala de la línea vertical con el progreso mejorado ---
    verticalLineRef.current.style.transform = `scaleY(${progressWithinSection})`;

    // --- Determinar el paso activo basado en posiciones reales de los elementos ---
    const stepElements = sectionRef.current.querySelectorAll('.step-number');
    if (stepElements.length > 0) {
      // Calculamos el centro de la ventana
      const viewportCenter = windowHeight / 2;
      
      // Encontramos el paso más cercano al centro de la ventana
      let closestStepIndex = -1;
      let minDistance = Infinity;
      
      stepElements.forEach((stepElement, index) => {
        const stepRect = stepElement.getBoundingClientRect();
        const stepCenter = stepRect.top + stepRect.height / 2;
        const distance = Math.abs(stepCenter - viewportCenter);
        
        // Si este paso está más cerca del centro que el anterior más cercano
        // y está al menos parcialmente visible
        if (distance < minDistance && stepRect.bottom > 0 && stepRect.top < windowHeight) {
          minDistance = distance;
          closestStepIndex = index;
        }
      });
      
      // Solo actualizamos si hay un cambio o si el paso está realmente visible
      if (closestStepIndex !== activeStepIndex && closestStepIndex >= 0) {
        // Verificamos si el paso está suficientemente visible
        const closestStepElement = stepElements[closestStepIndex];
        const stepRect = closestStepElement.getBoundingClientRect();
        
        // Si el paso está al menos 30% visible en el viewport
        if (stepRect.top < windowHeight * 0.7 && stepRect.bottom > windowHeight * 0.3) {
          setActiveStepIndex(closestStepIndex);
        }
      }
    }

    // Si no hay pasos visibles y estamos al principio, reseteamos
    if (progressWithinSection < 0.1 && activeStepIndex !== -1) {
      setActiveStepIndex(-1);
    }
    // Si estamos casi al final, activamos el último paso
    else if (progressWithinSection > 0.95 && activeStepIndex !== steps.length - 1) {
      setActiveStepIndex(steps.length - 1);
    }
  });


  return (
    // Pasamos la referencia al BrutalSection modificado
    <BrutalSection
      ref={sectionRef}
      variant="alt"
      className="border-t-2 border-[#002C5B] relative overflow-hidden py-16 md:py-24"
      id="how-it-works"
    >
      {/* Animated background pattern */}
      <div
        // ref={parallaxBgRef} // No necesitamos ref aquí si lo animamos con style en el callback
        className="absolute inset-0 opacity-5 z-0 pointer-events-none transition-transform duration-500 ease-out"
        style={{
          backgroundImage: 'url("/pattern-dots.png")',
          backgroundRepeat: 'repeat',
          // Animado via inline style + CSS transition basada en sectionScrollProgress
          transform: `translateY(${sectionScrollProgress * 40}px)`, // Movimiento Parallax (0-40px)
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Añadimos transiciones CSS y animamos via style con sectionScrollProgress */}
        <div
          className="absolute top-[10%] left-[10%] w-24 h-24 rounded-full bg-blue-500 opacity-10 blur-xl transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(${sectionScrollProgress * 80}px) rotate(${sectionScrollProgress * 240}deg)`, // Ajustados valores de movimiento/rotación
          }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-32 h-32 rounded-full bg-pink-500 opacity-10 blur-xl transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(${-sectionScrollProgress * 100}px) rotate(${-sectionScrollProgress * 240}deg)`, // Ajustados valores
          }}
        />
        <div
          className="absolute top-[60%] left-[20%] w-40 h-40 rounded-full bg-purple-500 opacity-10 blur-xl transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(${-sectionScrollProgress * 60}px) rotate(${sectionScrollProgress * 120}deg)`, // Ajustados valores
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* RevealSection para el título - Mantenido */}
        <RevealSection animation="fade-down" delay={100} duration={800} threshold={0.5}>
          <div className="mb-16 text-center">
            <BrutalHeading className="text-3xl md:text-5xl">Cómo funciona</BrutalHeading>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto pl-4 italic text-lg">
              En tres simples pasos puedes comenzar a ayudar o recibir apoyo para tu causa
            </p>
          </div>
        </RevealSection>


        {/* Steps container */}
        <div className="max-w-4xl mx-auto steps-container"> {/* Añadimos una clase para referenciar si es necesario */}
          <div className="relative">
            {/* Vertical line connecting all steps */}
            {/* La línea ahora se anima su scaleY en el callback de Lenis */}
            <div
              ref={verticalLineRef} // Referencia para la línea
              // top y height se setean en el useEffect
              className="absolute left-[39px] w-0.5  hidden md:block origin-top transition-transform duration-300 ease-out"
              style={{ transform: 'scaleY(0)' }} // Empezamos con scaleY(0)
            />

            {steps.map((step, index) => (
              // RevealSection para la entrada de cada paso - Mantenido
              <RevealSection
                key={index}
                animation="fade-up"
                delay={100 * index} // Stagger delay
                duration={800}
                threshold={0.3}
                once={false} // Animación se repite al scrollear
              >
                <div
                  className={`relative flex flex-col md:flex-row items-center md:items-start gap-6 mb-16 md:mb-24 transition-all duration-500 ease-out ${index <= activeStepIndex ? 'opacity-100' : 'opacity-30' // Reducimos la opacidad de los pasos futuros/pasados
                    }`}
                  // Animación de TranslateY más sutil basada en si está activo o no
                  style={{
                    transform: activeStepIndex === index ? 'translateY(0px)' : (index < activeStepIndex ? 'translateY(0px)' : 'translateY(10px)'), // Un ligero desplazamiento para los pasos futuros
                  }}
                >
                  {/* Step number - Añadimos clase 'step-number' para referenciar */}
                  <div
                    className={`step-number flex h-20 w-20 flex-shrink-0 items-center justify-center border-3 border-[#002C5B] text-3xl font-bold shadow-[4px_4px_0_0_rgba(0,44,91,0.8)] transition-all duration-500 ease-out z-10 ${index <= activeStepIndex
                        ? 'bg-[#EDFCA7] text-[#002C5B]'
                        : 'bg-white text-[#002C5B]'
                      }`}
                    style={{
                      // Animación de Rotate y Scale más pronunciada en el paso activo
                      transform: activeStepIndex === index
                        ? 'rotate(5deg) scale(1.15)' // Más rotación y escala
                        : 'rotate(0deg) scale(1)',
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 md:pt-2">
                    <h3
                      className={`text-2xl font-bold uppercase mb-4 transition-colors duration-500 ease-out ${index <= activeStepIndex ? 'text-[#002C5B]' : 'text-gray-500'
                        }`}
                    >
                      {step.title}
                    </h3>

                    <div
                      className={`relative border-3 border-[#002C5B] p-5 transition-all duration-500 ease-out ${activeStepIndex === index
                          ? 'bg-white shadow-[6px_6px_0_0_rgba(0,44,91,0.8)]' // Sombra más grande en activo
                          : index < activeStepIndex
                            ? 'bg-gray-50 shadow-[4px_4px_0_0_rgba(0,44,91,0.5)]' // Sombra media en completado
                            : 'bg-gray-50 shadow-[2px_2px_0_0_rgba(0,44,91,0.3)]' // Sombra pequeña en futuro
                        }`}
                    >
                      <p className={`text-lg transition-colors duration-500 ease-out ${index <= activeStepIndex ? 'text-[#002C5B]' : 'text-gray-500'
                        }`}>
                        {step.description}
                      </p>

                      {/* Decorative corner */}
                      <div
                        className={`absolute -top-1 -right-1 w-6 h-6 transition-colors duration-500 ease-out ${index <= activeStepIndex ? 'bg-[#EDFCA7]' : 'bg-white'
                          }`}
                        style={{
                          clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </div>
    </BrutalSection>
  );
};

export default StepsSection;