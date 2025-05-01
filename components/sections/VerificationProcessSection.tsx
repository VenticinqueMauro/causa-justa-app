import React from "react";
import { CheckCircle, Clock, FileText, Shield } from "lucide-react";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import BrutalButton from "../ui/BrutalButton";

const VerificationProcessSection = () => {
  return (
    <BrutalSection>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <BrutalHeading className="text-3xl md:text-4xl">Proceso de Verificación</BrutalHeading>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
            Revisamos cada causa para asegurar que cumpla con nuestros estándares de transparencia
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Paso 1 */}
          <div className="border-2 border-[#002C5B] bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
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

          {/* Paso 2 */}
          <div className="border-2 border-[#002C5B] bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
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

          {/* Paso 3 */}
          <div className="border-2 border-[#002C5B] bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]">
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
        </div>

        <div className="mt-10 border-2 border-dashed border-[#002C5B] bg-white p-6">
          <h3 className="text-xl font-bold text-[#002C5B] uppercase mb-4 text-center">Recomendaciones para crear una causa exitosa</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
                <li>Imágenes claras y relevantes de la causa</li>
                <li>Descripción detallada del propósito</li>
                <li>Explicación de cómo se utilizarán los fondos</li>
                <li>Conexión con MercadoPago verificada</li>
                <li>Información de contacto actualizada</li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
                <li>Incluir testimonios o referencias</li>
                <li>Compartir actualizaciones regulares</li>
                <li>Establecer metas realistas</li>
                <li>Ser transparente sobre el uso de fondos</li>
                <li>Responder a preguntas de donantes</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-sm">
              Recuerda: La transparencia es clave para generar confianza. Cuanta más información proporciones, más probabilidades tendrás de recibir donaciones.
            </p>
            <BrutalButton variant="outline" className="text-sm" href="/crear-causa">
              Crear una causa
            </BrutalButton>
          </div>
        </div>
      </div>
    </BrutalSection>
  );
};

export default VerificationProcessSection;
