import React from "react";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import { steps } from "@/data/sampleData";

interface Step {
  title: string;
  description: string;
}

const StepsSection = () => {
  return (
    <BrutalSection variant="alt" className="border-t-2 border-[#002C5B]" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <BrutalHeading className="text-3xl md:text-4xl">Cómo funciona</BrutalHeading>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
            En tres simples pasos puedes comenzar a ayudar o recibir apoyo para tu causa
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] text-[#002C5B] text-2xl font-bold shadow-[3px_3px_0_0_rgba(0,44,91,0.8)]">
                {index + 1}
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#002C5B] uppercase">{step.title}</h3>
              <p className="mt-2 text-[#002C5B] border-2 border-dashed border-[#002C5B] bg-white p-3">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BrutalSection>
  );
};

export default StepsSection;
