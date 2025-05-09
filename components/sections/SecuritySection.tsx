'use client';

import React, { useRef } from "react";
import { Shield, CreditCard, Lock, AlertCircle } from "lucide-react";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import Image from "next/image";
import RevealSection from "../animations/RevealSection";
import { useLenis } from "lenis/react";
import useParallax from "@/hooks/useParallax";

const SecuritySection = () => {
  // Parallax effect for the title section
  const titleRef = useParallax<HTMLDivElement>({
    speed: 0.05,
    direction: 'up',
    maxMovement: 30,
  });

  // Refs for interactive elements
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const bottomCardRef = useRef<HTMLDivElement>(null);

  // Use Lenis for scroll-based interactions
  useLenis(({ scroll, progress }) => {
    const applyTiltEffect = (element: HTMLDivElement | null, intensity: number = 1) => {
      if (!element) return;
      
      // Get element position
      const rect = element.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      // Calculate distance from center of viewport
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      
      // Calculate tilt based on position (max 3 degrees)
      const tiltX = ((elementCenterY - viewportCenterY) / viewportCenterY) * 3 * intensity;
      const tiltY = ((elementCenterX - viewportCenterX) / viewportCenterX) * -3 * intensity;
      
      // Only apply effect when element is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        element.style.transition = 'transform 0.3s ease-out';
      }
    };
    
    // Apply tilt effects to cards
    applyTiltEffect(card1Ref.current, 0.8);
    applyTiltEffect(card2Ref.current, 0.8);
    applyTiltEffect(bottomCardRef.current, 0.5);
  });

  return (
    <BrutalSection variant="alt" id="security-section" className="border-b-2 border-[#002C5B] overflow-hidden">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="mb-12 text-center">
          <RevealSection animation="fade-down" duration={1000}>
            <BrutalHeading className="text-3xl md:text-4xl">Seguridad y Transparencia</BrutalHeading>
          </RevealSection>
          <RevealSection animation="fade-up" delay={200} duration={800}>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
              Tu tranquilidad es nuestra prioridad. Conoce cómo protegemos tus donaciones
            </p>
          </RevealSection>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Métodos de pago */}
          <RevealSection animation="fade-right" delay={300} duration={1000}>
            <div 
              ref={card1Ref}
              className="border-2 border-[#002C5B] bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] transition-all duration-300 h-full"
            >
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mr-4 animate-float">
                  <CreditCard className="h-6 w-6 text-[#002C5B]" />
                </div>
                <h3 className="text-xl font-bold text-[#002C5B] uppercase">Métodos de Pago Seguros</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Procesamos todas las donaciones a través de MercadoPago, la plataforma de pagos más segura de Latinoamérica.
              </p>
              <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
                <div className="flex items-center justify-center bg-[#FFF] text-white font-bold px-4 py-2 rounded">
                  <Image src="/mercadopago-logo.png" alt="MercadoPago" width={90} height={90} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-gray-100 px-3 py-1 text-xs md:text-sm text-gray-700 rounded border border-gray-200">Tarjetas de crédito</span>
                  <span className="inline-block bg-gray-100 px-3 py-1 text-xs md:text-sm text-gray-700 rounded border border-gray-200">Tarjetas de débito</span>
                  <span className="inline-block bg-gray-100 px-3 py-1 text-xs md:text-sm text-gray-700 rounded border border-gray-200">Transferencia bancaria</span>
                  <span className="inline-block bg-gray-100 px-3 py-1 text-xs md:text-sm text-gray-700 rounded border border-gray-200">Efectivo</span>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Certificaciones de seguridad */}
          <RevealSection animation="fade-left" delay={500} duration={1000}>
            <div 
              ref={card2Ref}
              className="border-2 border-[#002C5B] bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] transition-all duration-300 h-full"
            >
              <div className="flex items-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mr-4 animate-float">
                  <Shield className="h-6 w-6 text-[#002C5B]" />
                </div>
                <h3 className="text-xl font-bold text-[#002C5B] uppercase">Protección de Datos</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Tu información personal y financiera está protegida con los más altos estándares de seguridad digital.
              </p>
              <div className="flex flex-col items-start gap-4 mt-4">
                <RevealSection animation="fade-up" delay={600} duration={600}>
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Conexión SSL</span>
                  </div>
                </RevealSection>
                <RevealSection animation="fade-up" delay={700} duration={600}>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Datos encriptados</span>
                  </div>
                </RevealSection>
                <RevealSection animation="fade-up" delay={800} duration={600}>
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Monitoreo 24/7</span>
                  </div>
                </RevealSection>
              </div>
            </div>
          </RevealSection>
        </div>

        {/* Comisiones y modelo de negocio */}
        <RevealSection animation="fade-up" delay={700} duration={1200}>
          <div 
            ref={bottomCardRef}
            className="mt-8 border-2 border-[#002C5B] bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-[#002C5B] uppercase mb-4">Estructura de Comisiones</h3>
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 md:pr-6">
                <p className="font-medium text-[#002C5B] mb-2">
                  Nuestro modelo de comisiones es claro y directo:
                </p>
                <ul className="list-disc pl-5 text-gray-600">
                  <RevealSection animation="fade-right" delay={800} duration={600}>
                    <li><span className="font-medium">5% de comisión</span> por donación exitosa para mantener la plataforma</li>
                  </RevealSection>
                  <RevealSection animation="fade-right" delay={900} duration={600}>
                    <li><span className="font-medium">+ costos de procesamiento</span> de MercadoPago (aprox 3.99%)</li>
                  </RevealSection>
                  <RevealSection animation="fade-right" delay={1000} duration={600}>
                    <li>Todas las comisiones se detallan en cada transacción</li>
                  </RevealSection>
                </ul>
              </div>
              
              <div className="hidden md:block w-px bg-dashed my-2 mx-auto border-0 border-l-2 border-dashed border-[#002C5B]"></div>
              
              <div className="flex-1 md:pl-6 mt-6 md:mt-0">
                <p className="font-medium text-[#002C5B] mb-2">
                  Seguridad en cada donación:
                </p>
                <ul className="list-disc pl-5 text-gray-600">
                  <RevealSection animation="fade-left" delay={800} duration={600}>
                    <li>Transferencias directas a cuentas de MercadoPago verificadas</li>
                  </RevealSection>
                  <RevealSection animation="fade-left" delay={900} duration={600}>
                    <li>Los beneficiarios pueden compartir actualizaciones sobre el progreso</li>
                  </RevealSection>
                  <RevealSection animation="fade-left" delay={1000} duration={600}>
                    <li>Historial completo de donaciones en tu perfil</li>
                  </RevealSection>
                </ul>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </BrutalSection>
  );
};

export default SecuritySection;
