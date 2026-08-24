import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";
import { PageHero } from "@/components/sections/PageHero";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Showcase builds across medspa, property management, veterinary care, roofing, HVAC, and plumbing — each one architected for its industry's actual buying behavior.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Six industries. One design standard."
        description="Every showcase build below is a real, working Next.js application — not a mockup. Read the full case study on each, or request live access to explore the interactive demo yourself."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <PortfolioShowcase />
          <p className="mt-10 text-sm text-ink/50">
            Based in the National Capital Region? See how this translates into{" "}
            <Link href="/web-design-ottawa" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              web design in Ottawa
            </Link>{" "}
            specifically.
          </p>
          <p className="mt-4 text-sm text-ink/50">
            Running a plumbing company? See a full breakdown of{" "}
            <Link href="/plumber-website-design" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              plumbing website redesign
            </Link>{" "}
            work.
          </p>
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
