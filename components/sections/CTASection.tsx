import React from "react";
import BrutalSection from "../ui/BrutalSection";
import BrutalButton from "../ui/BrutalButton";
import StartCauseButton from "../actions/StartCauseButton";

const CTASection = () => {
  return (
    <BrutalSection variant="dark" className="border-y-2 border-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white uppercase md:text-4xl border-b-4 border-[#EDFCA7] pb-2 mb-2 inline-block">
          ¿Listo para hacer la diferencia?
        </h2>
        <p className="mt-4 text-white/80 max-w-2xl mx-auto border-2 border-white p-4 shadow-[5px_5px_0_0_rgba(255,255,255,0.3)]">
          Únete a nuestra comunidad de donantes y organizaciones que están cambiando el mundo, una causa a la vez
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
          <StartCauseButton 
            variant="white" 
            size="md"
            className="text-base" 
            showIcon={true}
            iconPosition="left"
          />
          <BrutalButton variant="dark" className="text-base" href="/campaigns">
            Explorar causas
          </BrutalButton>
        </div>
      </div>
    </BrutalSection>
  );
};

export default CTASection;
