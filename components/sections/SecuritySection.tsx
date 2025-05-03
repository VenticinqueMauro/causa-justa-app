import React from "react";
import { Shield, CreditCard, Lock, AlertCircle } from "lucide-react";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import Image from "next/image";

const SecuritySection = () => {
  return (
    <BrutalSection variant="alt" id="security-section" className="border-b-2 border-[#002C5B]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <BrutalHeading className="text-3xl md:text-4xl">Seguridad y Transparencia</BrutalHeading>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
            Tu tranquilidad es nuestra prioridad. Conoce cómo protegemos tus donaciones
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Métodos de pago */}
          <div className="border-2 border-[#002C5B] bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
            <div className="flex items-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mr-4">
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

          {/* Certificaciones de seguridad */}
          <div className="border-2 border-[#002C5B] bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
            <div className="flex items-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)] mr-4">
                <Shield className="h-6 w-6 text-[#002C5B]" />
              </div>
              <h3 className="text-xl font-bold text-[#002C5B] uppercase">Protección de Datos</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Tu información personal y financiera está protegida con los más altos estándares de seguridad digital.
            </p>
            <div className="flex flex-col items-start gap-4 mt-4">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">Conexión SSL</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">Datos encriptados</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">Monitoreo 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comisiones y modelo de negocio */}
        <div className="mt-8 border-2 border-[#002C5B] bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
          <h3 className="text-xl font-bold text-[#002C5B] uppercase mb-4">Estructura de Comisiones</h3>
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 md:pr-6">
              <p className="font-medium text-[#002C5B] mb-2">
                Nuestro modelo de comisiones es claro y directo:
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li><span className="font-medium">5% de comisión</span> por donación exitosa para mantener la plataforma</li>
                <li><span className="font-medium">+ costos de procesamiento</span> de MercadoPago (aprox 3.99%)</li>
                <li>Todas las comisiones se detallan en cada transacción</li>
              </ul>
            </div>
            
            <div className="hidden md:block w-px bg-dashed my-2 mx-auto border-0 border-l-2 border-dashed border-[#002C5B]"></div>
            
            <div className="flex-1 md:pl-6 mt-6 md:mt-0">
              <p className="font-medium text-[#002C5B] mb-2">
                Seguridad en cada donación:
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Transferencias directas a cuentas de MercadoPago verificadas</li>
                <li>Los beneficiarios pueden compartir actualizaciones sobre el progreso</li>
                <li>Historial completo de donaciones en tu perfil</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </BrutalSection>
  );
};

export default SecuritySection;
