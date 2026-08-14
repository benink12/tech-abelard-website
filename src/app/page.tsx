import { Hero } from "@/components/sections/Hero";
import { IndustriesMarquee } from "@/components/sections/IndustriesMarquee";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { WhyTechAbelard } from "@/components/sections/WhyTechAbelard";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { FreeAuditPromo } from "@/components/sections/FreeAuditPromo";
import { ProcessPreview } from "@/components/sections/ProcessPreview";
import { SEOPreview } from "@/components/sections/SEOPreview";
import { PricingPreview } from "@/components/sections/PricingPreview";
import { FAQPreview } from "@/components/sections/FAQPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <IndustriesMarquee />
      <ServicesOverview />
      <WhyTechAbelard />
      <PortfolioPreview />
      <FreeAuditPromo />
      <ProcessPreview />
      <SEOPreview />
      <PricingPreview />
      <FAQPreview />
      <FinalCTA />
    </>
  );
}
