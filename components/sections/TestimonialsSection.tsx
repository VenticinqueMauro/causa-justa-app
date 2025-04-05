import React from "react";
import Image from "next/image";
import BrutalSection from "../ui/BrutalSection";
import BrutalHeading from "../ui/BrutalHeading";
import { testimonials } from "@/data/sampleData";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

const TestimonialsSection = () => {
  return (
    <BrutalSection variant="dark">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <BrutalHeading className="text-3xl md:text-4xl text-white">Lo que dicen nuestros usuarios</BrutalHeading>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto pl-4 italic">
            Historias reales de personas que han experimentado el poder de la solidaridad a través de nuestra plataforma
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="border-2 border-white p-6 bg-[#002C5B]/80 shadow-[5px_5px_0_0_rgba(255,255,255,0.3)] transform transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 overflow-hidden border-2 border-white bg-white/20 shadow-[2px_2px_0_0_rgba(255,255,255,0.3)]">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white uppercase">{testimonial.name}</h3>
                  <p className="text-sm text-white/70">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-white/90 border-l-2 border-[#EDFCA7] pl-3">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </BrutalSection>
  );
};

export default TestimonialsSection;
