import type { Metadata } from "next";
import { portfolioProjects } from "@/data/portfolio";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { PageHero } from "@/components/sections/PageHero";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Showcase builds for plumbing, HVAC, and roofing businesses — each one architected for its industry's actual buying behavior.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Three industries. One design standard."
        description="Every showcase build below is a real, working Next.js application — not a mockup. Live demo links, written case studies, and before/after comparisons roll out here as each is finalized."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {portfolioProjects.map((project, i) => (
              <RevealOnScroll key={project.slug} delay={i * 80}>
                <PortfolioCard project={project} />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <AuditCallout
        ctaId="portfolio-free-audit"
        title="Want the same kind of review for your own site?"
        description="Request a free, honest audit of your current website — no obligation."
        ctaLabel="Request My Free Audit"
      />

      <FinalCTA />
    </>
  );
}
