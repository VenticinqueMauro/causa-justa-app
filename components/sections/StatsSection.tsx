import React from "react";
import BrutalSection from "../ui/BrutalSection";

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  {
    value: "250+",
    label: "Causas financiadas",
  },
  {
    value: "$1.2M",
    label: "Recaudados",
  },
  {
    value: "15K+",
    label: "Donantes activos",
  },
  {
    value: "98%",
    label: "Satisfacción",
  },
];

const StatsSection = () => {
  return (
    <BrutalSection variant="alt" className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center border-2 border-[#002C5B] bg-white p-6 text-center shadow-[5px_5px_0_0_rgba(0,44,91,0.3)]"
            >
              <span className="text-4xl font-bold text-[#002C5B]">{stat.value}</span>
              <span className="mt-2 text-sm uppercase text-gray-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </BrutalSection>
  );
};

export default StatsSection;
