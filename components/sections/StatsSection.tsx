import React from "react";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import BrutalButton from "../ui/BrutalButton";
import { ArrowRight } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  description?: string;
}

const stats: Stat[] = [
  {
    value: "250+",
    label: "Causas financiadas",
    description: "Proyectos verificados y completados exitosamente"
  },
  {
    value: "$1.2M",
    label: "Recaudados",
    description: "Fondos entregados a beneficiarios verificados"
  },
  {
    value: "15K+",
    label: "Donantes activos",
    description: "Personas comprometidas con el cambio social"
  },
  {
    value: "98%",
    label: "Satisfacción",
    description: "De beneficiarios y donantes con nuestra plataforma"
  },
];

const StatsSection = () => {
  return (
    <BrutalSection variant="alt" className="py-12 border-t-2 border-[#002C5B]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <BrutalHeading className="text-3xl md:text-4xl">Nuestro Impacto</BrutalHeading>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
            Cifras que demuestran nuestro compromiso con la transparencia y el cambio social
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center border-2 border-[#002C5B] bg-white p-3 md:p-6 text-center shadow-[5px_5px_0_0_rgba(0,44,91,0.3)]"
            >
              <span className="text-4xl font-bold text-[#002C5B]">{stat.value}</span>
              <span className="mt-2 text-sm uppercase text-gray-600 font-bold">{stat.label}</span>
              {stat.description && (
                <span className="mt-2 text-xs text-gray-500">{stat.description}</span>
              )}
            </div>
          ))}
        </div>
        
        {/* <div className="mt-10 text-center">
          <p className="text-[#002C5B] mb-4 max-w-2xl mx-auto border-2 border-dashed border-[#002C5B] bg-white p-3">
            Publicamos informes trimestrales de impacto y mantenemos un seguimiento transparente de todas las causas financiadas.
          </p>
          <BrutalButton 
            variant="outline" 
            className="text-sm inline-flex items-center" 
            href="/impact-reports"
          >
            Ver informes de impacto
            <ArrowRight className="ml-2 h-4 w-4" />
          </BrutalButton>
        </div> */}
      </div>
    </BrutalSection>
  );
};

export default StatsSection;
