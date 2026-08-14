import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { SeoPillars } from "@/components/sections/SeoPillars";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Local SEO",
  description:
    "Local SEO, Google Business Profile management, technical SEO, content, and monthly reporting — run every month so your ranking position keeps compounding.",
  alternates: { canonical: "/seo" },
};

const monthlyRhythm = [
  { week: "Week 1", title: "Audit & Prioritize", detail: "Review rankings, traffic, and GBP insights. Confirm this month's content and fix list." },
  { week: "Week 2", title: "Execute", detail: "Publish and optimize content, complete technical fixes, update citations, push GBP posts." },
  { week: "Week 3", title: "Build", detail: "Continue citation building, an internal linking pass, and a competitor tracking update." },
  { week: "Week 4", title: "Report & Plan", detail: "Compile the monthly report, hold the strategy call, and lock next month's priorities." },
];

export default function SEOPage() {
  return (
    <>
      <PageHero
        eyebrow="Local SEO"
        title="Rankings that compound, not a one-time audit."
        description="A website is the asset. SEO is what makes it keep earning — five pillars run every month, reported in numbers you can actually read."
      >
        <div className="mt-8">
          <Button href="/audit" variant="cream" size="lg" data-cta="seo-free-audit-top" showArrow>
            Get a Free Website Audit
          </Button>
        </div>
      </PageHero>

      <section className="py-24 sm:py-32">
        <Container>
          <SeoPillars full />
        </Container>
      </section>

      <section className="border-t border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Every Month"
            title="What actually happens on a retainer."
            description="Only the volume changes by tier — the rhythm is the same for every client."
            align="center"
            className="mx-auto"
          />
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {monthlyRhythm.map((item) => (
              <div key={item.week} className="rounded-2xl border border-ink/8 bg-cream-card p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-ink">{item.week}</p>
                <h3 className="mt-2 font-display text-xl font-medium text-ink">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink/60">{item.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <AuditCallout
        ctaId="seo-free-audit-bottom"
        title="Want to see where your rankings actually stand?"
        description="Get a free, honest audit of your current site before you commit to a retainer."
      />

      <FinalCTA />
    </>
  );
}
