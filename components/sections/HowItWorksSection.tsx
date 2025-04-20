import React from "react";
import { ArrowRight, CheckCircle, Shield, Users } from "lucide-react";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Users className="h-10 w-10 text-[#002C5B]" />,
      title: "Crea tu cuenta",
      description: "Regístrate en nuestra plataforma de forma rápida y segura para comenzar a ayudar.",
    },
    {
      icon: <Shield className="h-10 w-10 text-[#002C5B]" />,
      title: "Elige una causa",
      description: "Navega por las causas verificadas y encuentra aquella que resuene con tus valores.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-[#002C5B]" />,
      title: "Haz tu donación",
      description: "Contribuye con cualquier cantidad a través de nuestros métodos de pago seguros.",
    },
    {
      icon: <ArrowRight className="h-10 w-10 text-[#002C5B]" />,
      title: "Sigue el impacto",
      description: "Recibe actualizaciones sobre cómo tu donación está generando un cambio positivo.",
    },
  ];

  return (
    <BrutalSection >
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <BrutalHeading className="text-3xl md:text-4xl">Cómo funciona</BrutalHeading>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Nuestra plataforma hace que donar sea simple, transparente y efectivo
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center border-2 border-[#002C5B] bg-white p-6 text-center shadow-[5px_5px_0_0_rgba(0,44,91,0.3)]"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#002C5B] bg-[#EDFCA7]">
                {step.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold uppercase text-[#002C5B]">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </BrutalSection>
  );
};

export default HowItWorksSection;
