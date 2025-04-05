import React from "react";
import Image from "next/image";
import BrutalSection from "../ui/BrutalSection";
import BrutalButton from "../ui/BrutalButton";

const HeroSection = () => {
  return (
    <BrutalSection className="relative overflow-hidden py-20 md:py-28">
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <h1 className="max-w-3xl text-4xl font-bold uppercase tracking-tight text-[#002C5B] sm:text-5xl md:text-6xl border-b-4 border-[#EDFCA7] pb-2 mb-2">
          Conectando corazones con causas que importan
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#002C5B] border-2 border-[#002C5B] bg-white p-4 shadow-[5px_5px_0_0_rgba(0,44,91,0.3)]">
          Ayuda a transformar vidas a través de donaciones seguras y transparentes. Cada contribución marca la
          diferencia en nuestra comunidad.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <BrutalButton variant="outline" className="text-base">
            Iniciar una causa
          </BrutalButton>
          <BrutalButton variant="secondary" className="text-base">
            Explorar causas
          </BrutalButton>
        </div>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#000000]">
        <Image
          src="/banner2.png"
          alt="Personas ayudando en comunidad"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
    </BrutalSection>
  );
};

export default HeroSection;
