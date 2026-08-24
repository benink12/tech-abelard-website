import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { SeoPillars } from "@/components/sections/SeoPillars";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Local SEO Services",
  description:
    "Local SEO for service businesses — Google visibility, keyword targeting, on-page and technical SEO, Google Business Profile management, and monthly reporting. No guaranteed rankings, ever.",
  alternates: { canonical: "/services/local-seo" },
};

const monthlyRhythm = [
  { week: "Week 1", title: "Audit & Prioritize", detail: "Review rankings, traffic, and GBP insights. Confirm this month's content and fix list." },
  { week: "Week 2", title: "Execute", detail: "Publish and optimize content, complete technical fixes, update citations, push GBP posts." },
  { week: "Week 3", title: "Build", detail: "Continue citation building, an internal linking pass, and a competitor tracking update." },
  { week: "Week 4", title: "Report & Plan", detail: "Compile the monthly report, hold the strategy call, and lock next month's priorities." },
];

const doNotGuarantee = [
  "A specific ranking position or \"page 1, guaranteed\" — no agency can honestly promise this. Google's algorithm isn't for sale.",
  "A fixed timeline for results — local SEO compounds over months, not days, and the starting point (age, competition, existing signals) varies by business.",
  "Rankings that hold regardless of what happens on your end — reviews, response time, and service quality still matter to both customers and Google.",
  "Results without ongoing work — SEO is a monthly discipline. Pausing the retainer eventually pauses the compounding, too.",
];

const faqItems = [
  {
    category: "SEO" as const,
    question: "Do you guarantee first-page rankings?",
    answer:
      "No — and any agency that promises this is telling you what you want to hear. We can show you exactly what we're doing every month and why, and report honestly on what's moving and what isn't. That's the deal.",
  },
  {
    category: "SEO" as const,
    question: "How fast will I rank?",
    answer:
      "Local SEO compounds — it isn't instant. We recommend a 3-month minimum term because that's roughly how long Google needs to trust new signals. Most clients see measurable movement in local pack visibility within 60–90 days, reported monthly so you can see it happening, not just take our word for it.",
  },
  {
    category: "SEO" as const,
    question: "Is Google Business Profile management included, or separate?",
    answer:
      "GBP management is included at no extra cost inside every SEO retainer. It's also available standalone for businesses that aren't ready for a full SEO campaign yet.",
  },
  {
    category: "Pricing" as const,
    question: "Is there a minimum contract?",
    answer:
      "We recommend a 3-month minimum simply because that's roughly the timeline Google needs to trust new signals — shorter than that and neither of us can tell what's actually working. There's no long-term contract required beyond that.",
  },
];

export default function LocalSEOPage() {
  return (
    <>
      <PageHero
        eyebrow="Local SEO"
        title="Local SEO for service businesses."
        description="Local SEO is compounding proof to Google that you're the real, active, trustworthy answer to “best [service] near me.” We run monthly retainers built around technical fixes, content, citations, and review generation — not a one-time audit and a promise."
      >
        <div className="mt-8">
          <Button href="/audit" variant="cream" size="lg" data-cta="local-seo-hero-free-audit" showArrow>
            Get a Free Website Audit
          </Button>
        </div>
      </PageHero>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Google Visibility"
            title="Six pillars, run every month."
            description="Your Google Business Profile and search rankings are often the first thing a customer sees — before your homepage even loads. These are the levers that actually move that visibility."
          />
          <div className="mt-14">
            <SeoPillars full />
          </div>
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

      <section className="py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink/8 bg-cream-card p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 shrink-0 text-brass-ink" strokeWidth={1.7} />
              <h2 className="font-display text-xl font-medium text-ink sm:text-2xl">What we do not guarantee</h2>
            </div>
            <ul className="mt-6 flex flex-col gap-3.5">
              {doNotGuarantee.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/65">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Capability, Not Case Studies"
            title="SEO structure, demonstrated on real builds."
            description="These concept projects aren't running client campaigns — there's no fabricated ranking or traffic data here. What you can see is the actual SEO architecture (schema, page structure, local-intent content) built into each one."
          />
          <PortfolioShowcase
            className="mt-14"
            featuredSlugs={["northpeak-roofing", "northclimate-hvac", "northline-plumbing"]}
          />
        </Container>
      </section>

      <AuditCallout
        ctaId="local-seo-free-audit-bottom"
        title="Want to see where your rankings actually stand?"
        description="Get a free, honest audit of your current site before you commit to a retainer."
      />

      <section className="border-t border-ink/8 py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Common questions about local SEO." />
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink/50">
            Running SEO specifically for the trades? See{" "}
            <Link href="/local-seo-for-contractors" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              local SEO for home service businesses
            </Link>
            .
          </p>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
