import type { Metadata } from "next";
import { auditIncludedItems, auditTrustPoints, auditFaqItems } from "@/data/freeAudit";
import { iconMap } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PageHero } from "@/components/sections/PageHero";
import { AuditForm } from "@/components/sections/AuditForm";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Free Website Audit",
  description:
    "A free, honest review of your website's design, mobile experience, speed, SEO, and calls-to-action — reviewed by a real person, no guarantees invented.",
  alternates: { canonical: "/free-audit" },
};

export default function FreeAuditPage() {
  return (
    <>
      <PageHero
        eyebrow="Free Website Audit"
        title="Find out what your website is actually costing you."
        description="A specific, honest look at your site — not a generic report with your name pasted on top. No cost, no obligation, no invented numbers."
      >
        <div className="mt-8">
          <Button href="#audit-form" variant="cream" size="lg" data-cta="free-audit-page-hero" showArrow>
            Request My Free Audit
          </Button>
        </div>
      </PageHero>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="What's Included"
            title="Eight areas, reviewed by a real person."
            description="Every audit covers the same ground — the parts of a website that actually decide whether a visitor calls, or clicks away."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {auditIncludedItems.map((item, i) => {
              const Icon = iconMap[item.icon];
              return (
                <RevealOnScroll key={item.title} delay={i * 50}>
                  <div className="rounded-2xl border border-ink/8 bg-cream-card p-6">
                    <Icon className="h-6 w-6 text-brass-ink" strokeWidth={1.6} />
                    <h3 className="mt-4 font-display text-lg font-medium text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.description}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="audit-form" className="scroll-mt-24 border-t border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="Get Started"
              title="Tell us about your business."
              description="Takes about two minutes. We'll review your site and follow up by email once your audit is ready — most take 2–3 business days."
            />
            <AuditForm />
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Why Trust This"
            title="No fluff, no fabricated findings."
            align="center"
            className="mx-auto"
          />
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {auditTrustPoints.map((point, i) => (
              <RevealOnScroll key={point.title} delay={i * 60}>
                <div className="rounded-2xl border border-ink/8 bg-cream-card p-6">
                  <h3 className="font-display text-lg font-medium text-ink">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{point.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/8 py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Questions before you submit." />
          <div className="mx-auto mt-14 max-w-3xl">
            <FAQAccordion items={auditFaqItems.map((f) => ({ ...f, category: "General" as const }))} />
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-ink py-24 text-center text-cream sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(176,141,87,0.14), transparent)",
          }}
        />
        <Container className="relative">
          <p className="brass-line mx-auto mb-7 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brass">
            Ready When You Are
          </p>
          <h2 className="text-balance mx-auto max-w-2xl font-display text-3xl font-medium tracking-tight sm:text-5xl">
            Two minutes now could save you months of guessing.
          </h2>
          <div className="mt-10 flex justify-center">
            <Button href="#audit-form" variant="cream" size="lg" data-cta="free-audit-page-final" showArrow>
              Request My Free Audit
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
