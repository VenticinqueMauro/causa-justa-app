import React from "react";

// Layout components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Section components
import HeroSection from "@/components/sections/HeroSection";
import FeaturedCampaignsSection from "@/components/sections/FeaturedCampaignsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import StatsSection from "@/components/sections/StatsSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import StepsSection from "@/components/sections/StepsSection";
import CTASection from "@/components/sections/CTASection";

// Data
import { sampleCampaigns } from "@/data/sampleCampaigns";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#ECECE2]">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturedCampaignsSection campaigns={sampleCampaigns} />
        <BenefitsSection />
        <TestimonialsSection />
        <StepsSection />
        <StatsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
