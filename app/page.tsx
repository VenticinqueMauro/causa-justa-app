
// Layout components
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

// Section components
import BenefitsSection from "@/components/sections/BenefitsSection";
import CTASection from "@/components/sections/CTASection";
import FeaturedCampaignsSection from "@/components/sections/FeaturedCampaignsSection";
import HeroSection from "@/components/sections/HeroSection";
import SecuritySection from "@/components/sections/SecuritySection";
import StatsSection from "@/components/sections/StatsSection";
import StepsSection from "@/components/sections/StepsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import VerificationProcessSection from "@/components/sections/VerificationProcessSection";

// Types
import { Campaign } from "@/types/campaign";

// Fallback data en caso de error
import { campaigns as sampleCampaigns } from "@/data/sampleData";

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
    if (!apiUrl) {
      console.error('API URL no configurada');
      return sampleCampaigns;
    }
    
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    const response = await fetch(`${baseUrl}campaigns?status=VERIFIED&limit=5`, {
      next: { revalidate: 3600 }, 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error al obtener campañas:', response.status);
      return sampleCampaigns;
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error al obtener campañas:', error);
    return sampleCampaigns;
  }
}

// Configuración para permitir la generación estática con revalidación
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidar cada hora

export default async function Home() {
  // Obtener campañas reales desde la API
  const campaigns = await getCampaigns();
  return (
    <div className="flex min-h-screen flex-col bg-[#ECECE2]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCampaignsSection campaigns={campaigns} />
        <BenefitsSection />
        <StepsSection />
        <SecuritySection />
        <VerificationProcessSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
