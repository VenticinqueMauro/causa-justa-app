import React from "react";
import BrutalSection from "../ui/BrutalSection";
import BrutalButton from "../ui/BrutalButton";
import StartCauseButton from "../actions/StartCauseButton";
import BrutalHeading from "../ui/BrutalHeading";

const CTASection = () => {
  return (
    <BrutalSection variant="default" className="border-y-2 border-[#002C5B ]">
      <div className="container mx-auto px-4 text-center">
        <BrutalHeading className="text-3xl md:text-4xl">
          ¿Listo para hacer la diferencia?
        </BrutalHeading>
        <p className="mt-6 max-w-2xl text-lg text-[#002C5B] border-2 border-[#002C5B] bg-white p-4 shadow-[5px_5px_0_0_rgba(0,44,91,0.3)] mx-auto">
          Únete a nuestra comunidad de donantes y organizaciones que están cambiando el mundo, una causa a la vez
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
          <StartCauseButton 
            variant="secondary" 
            size="md"
            className="text-base flex justify-center" 
            showIcon={true}
            iconPosition="left"
          />
          <BrutalButton variant="outline" className="text-base" href="/campaigns">
            Explorar causas
          </BrutalButton>
        </div>
      </div>
    </BrutalSection>
  );
};

export default CTASection;
