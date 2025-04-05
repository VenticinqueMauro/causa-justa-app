
// Layout components
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

// Section components
import BenefitsSection from "@/components/sections/BenefitsSection";
import CTASection from "@/components/sections/CTASection";
import FeaturedCampaignsSection from "@/components/sections/FeaturedCampaignsSection";
import HeroSection from "@/components/sections/HeroSection";
import StepsSection from "@/components/sections/StepsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

// Data
import { campaigns } from "@/data/sampleData";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#ECECE2]">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturedCampaignsSection campaigns={campaigns} />
        <BenefitsSection />
        <TestimonialsSection />
        <StepsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
