import type { Metadata } from "next";
import "@/styles/home.css";
import { homeFontClassName } from "@/lib/fonts/home";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProblem } from "@/components/home/HomeProblem";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeWork } from "@/components/home/HomeWork";
import { HomeWhy } from "@/components/home/HomeWhy";
import { HomeSystems } from "@/components/home/HomeSystems";
import { HomePricing } from "@/components/home/HomePricing";
import { HomeAudit } from "@/components/home/HomeAudit";
import { HomeFaq } from "@/components/home/HomeFaq";

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

// HomeHeader/HomeFooter are no longer rendered here — src/app/layout.tsx
// renders them site-wide now (see that file's comment for why each gets its
// own small .home-concept wrapper instead of one wrapping <main>).
export default function Home() {
  return (
    <div className={`home-concept ${homeFontClassName}`}>
      <HomeHero />
      <HomeProblem />
      <HomeServices />
      <HomeWork />
      <HomeWhy />
      <HomeSystems />
      <HomePricing />
      <HomeAudit />
      <HomeFaq />
    </div>
  );
}
