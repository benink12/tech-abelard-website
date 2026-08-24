import type { Metadata } from "next";
import Link from "next/link";
import { LayoutTemplate, MousePointerClick, Smartphone, Gauge, SearchCheck, ListChecks } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Web Design for Service Businesses",
  description:
    "Custom, mobile-first websites built to convert for plumbers, roofers, HVAC companies, electricians, and the trades around them — not a page-builder theme with your logo dropped in.",
  alternates: { canonical: "/services/web-design" },
};

const buildPillars = [
  {
    icon: LayoutTemplate,
    title: "Custom responsive websites",
    description:
      "Every page is art-directed for your business, not assembled from a page-builder theme. It holds up cleanly from a 5-inch phone screen to a 27-inch monitor.",
  },
  {
    icon: MousePointerClick,
    title: "Conversion-focused UX",
    description:
      "Every layout is built around one job: turning a visitor into a call, a form fill, or a booked estimate — not just looking good in a portfolio.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first design",
    description:
      "Most of your customers find you on their phone, standing in front of the problem. We design for that screen first, then scale up — not the other way around.",
  },
  {
    icon: Gauge,
    title: "Performance",
    description:
      "Fast on a job-site phone with two bars of signal — Core Web Vitals, image delivery, and caching tuned in during the build, not patched on after rankings stall.",
  },
  {
    icon: SearchCheck,
    title: "SEO-ready foundation",
    description:
      "Clean semantic markup, schema, and page architecture from day one, so your local SEO campaign has a real foundation to build on instead of fighting the site itself.",
  },
  {
    icon: ListChecks,
    title: "Forms & lead capture",
    description:
      "Contact and quote forms built to actually get filled out — validated, mobile-friendly, and wired to notify you the moment a lead comes in.",
  },
];

const faqItems = [
  {
    category: "General" as const,
    question: "Will my new site actually look different from my competitors'?",
    answer:
      "Yes — Professional and Premium tiers are fully custom design work, not a page-builder theme with your logo swapped in. If it looks like everyone else's site in your area, it converts like everyone else's site too.",
  },
  {
    category: "Process" as const,
    question: "How long does a new website take to build?",
    answer:
      "Essential builds in 2–3 weeks, Professional in 4–6 weeks, and Premium in 6–10 weeks, depending on scope, content readiness, and revision rounds. The Process page below walks through what happens week by week.",
  },
  {
    category: "General" as const,
    question: "Can I edit the site myself after launch?",
    answer:
      "On Professional and Premium tiers, yes — you get a client-editable CMS for text, images, and minor content changes. Essential-tier sites are managed by us, with a Website Care plan available any time for hands-off edits.",
  },
  {
    category: "SEO" as const,
    question: "Is the site actually built to rank, or just to look good?",
    answer:
      "Both. Schema markup, semantic structure, and Core Web Vitals tuning are part of the build itself — not a separate line item bolted on later. It's a real foundation for a local SEO campaign, whether that starts on day one or down the road.",
  },
];

export default function WebDesignPage() {
  return (
    <>
      <PageHero
        eyebrow="Web Design"
        title="Custom sites built to convert, not just exist."
        description="A fully custom site for your business — not a template with your logo dropped in. Every page is designed around one job: turning a visitor who found you on their phone into a call, a form fill, or a booked estimate."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" variant="cream" size="lg" data-cta="web-design-hero-discovery-call" showArrow>
            Book a Discovery Call
          </Button>
        </div>
      </PageHero>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="What We Build"
            title="Six things every Tech Abélard site gets, no exceptions."
            description="Whichever tier you start on, these aren't upsells — they're the baseline every site is built around."
          />

          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-ink/8 pt-10 sm:grid-cols-2">
            {buildPillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <RevealOnScroll key={pillar.title} delay={i * 60}>
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/5">
                      <Icon className="h-5 w-5 text-brass-ink" strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-ink">{pillar.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{pillar.description}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Examples"
              title="Concept work from the portfolio."
              description="Every project below is a concept build created to demonstrate our own capabilities across different home-service and specialty niches."
            />
          </div>
          <PortfolioShowcase
            className="mt-14"
            featuredSlugs={["aurelle-medspa", "northpeak-roofing", "northline-plumbing"]}
          />
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="What actually happens, week by week."
            description="The same rhythm for every project — only the volume of work changes by tier."
          />
          <div className="mt-14">
            <ProcessTimeline />
          </div>
        </Container>
      </section>

      <AuditCallout
        ctaId="web-design-free-audit"
        title="Not sure if you need a full rebuild?"
        description="Get a free, honest audit of your current site — we'll tell you exactly what's actually holding it back first."
      />

      <section className="border-t border-ink/8 py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Common questions about the build." />
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink/50">
            Building for a specific niche? See{" "}
            <Link href="/web-design-ottawa" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              web design for Ottawa businesses
            </Link>{" "}
            or{" "}
            <Link href="/plumber-website-design" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              website design for plumbing companies
            </Link>
            .
          </p>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
