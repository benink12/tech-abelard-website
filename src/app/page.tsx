import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { IndustriesMarquee } from "@/components/sections/IndustriesMarquee";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { AIReceptionistPromo } from "@/components/sections/AIReceptionistPromo";
import { WhyTechAbelard } from "@/components/sections/WhyTechAbelard";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { FreeAuditPromo } from "@/components/sections/FreeAuditPromo";
import { ProcessPreview } from "@/components/sections/ProcessPreview";
import { SEOPreview } from "@/components/sections/SEOPreview";
import { PricingPreview } from "@/components/sections/PricingPreview";
import { FAQPreview } from "@/components/sections/FAQPreview";
import { HomeLeadForm } from "@/components/sections/HomeLeadForm";
import { FinalCTA } from "@/components/sections/FinalCTA";

// Homepage-specific title/description override — `title.absolute` bypasses
// the root layout's `%s | Tech Abélard` template so the business name can
// lead, matching how the homepage should read in search results. Everything
// else (metadataBase, canonical, Open Graph, Twitter, JSON-LD) is left
// untouched and continues to inherit from src/app/layout.tsx.
export const metadata: Metadata = {
  title: { absolute: "Tech Abélard | Web Design, Local SEO & AI Receptionists" },
  description:
    "Tech Abélard builds high-converting websites, local SEO systems and AI receptionists for service businesses ready to grow.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <IndustriesMarquee />
      <ServicesOverview />
      <AIReceptionistPromo />
      <WhyTechAbelard />
      <PortfolioPreview />
      <FreeAuditPromo />
      <ProcessPreview />
      <SEOPreview />
      <PricingPreview />
      <FAQPreview />
      <HomeLeadForm />
      <FinalCTA />
    </>
  );
}
