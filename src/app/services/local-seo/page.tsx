import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { site } from "@/data/site";
import { homeFontClassName } from "@/lib/fonts/home";
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

const PAGE_PATH = "/services/local-seo";
const PAGE_TITLE = "Local SEO Services";

export default function LocalSEOPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      { "@type": "ListItem", position: 3, name: PAGE_TITLE, item: `${site.url}${PAGE_PATH}` },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Local SEO",
    name: PAGE_TITLE,
    description: metadata.description,
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      url: site.url,
      telephone: site.phone.display,
      email: site.email,
    },
    areaServed: { "@type": "Country", name: "Canada" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className={`home-concept ${homeFontClassName}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PageHero
        eyebrow="Local SEO"
        title="Local SEO for service businesses."
        description="Local SEO is compounding proof to Google that you're the real, active, trustworthy answer to “best [service] near me.” We run monthly retainers built around technical fixes, content, citations, and review generation — not a one-time audit and a promise. Based in the Ottawa–Gatineau region, working with service businesses across Canada."
      >
        <div className="hc-hero__ctas">
          <Button href="/audit" variant="cream" size="lg" data-cta="local-seo-hero-free-audit" showArrow>
            Get a Free Website Audit
          </Button>
        </div>
      </PageHero>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Google Visibility"
            title="Six pillars, run every month."
            description="Your Google Business Profile and search rankings are often the first thing a customer sees — before your homepage even loads. These are the levers that actually move that visibility."
          />
          <div className="mt-14">
            <SeoPillars full />
          </div>
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Every Month"
            title="What actually happens on a retainer."
            description="Only the volume changes by tier — the rhythm is the same for every client."
            align="center"
            tone="cream"
            className="mx-auto"
          />
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {monthlyRhythm.map((item) => (
              <div key={item.week} className="hc-flatcard" style={{ borderTopColor: "var(--rule-inv)" }}>
                <p className="hc-eyebrow">{item.week}</p>
                <h3 style={{ color: "var(--bone)" }}>{item.title}</h3>
                <p style={{ color: "rgba(230,231,226,0.62)" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <div className="mx-auto max-w-3xl hc-flatcard">
            <div className="hc-flatcard__kicker">
              <ShieldAlert className="h-4 w-4" strokeWidth={1.5} />
              What we do not guarantee
            </div>
            <ul style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12, padding: 0, listStyle: "none" }}>
              {doNotGuarantee.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "var(--slate)" }}>
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--slate)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Capability, Not Case Studies"
            title="SEO structure, demonstrated on real builds."
            description="These concept projects aren't running client campaigns — there's no fabricated ranking or traffic data here. What you can see is the actual SEO architecture (schema, page structure, local-intent content) built into each one."
            tone="cream"
          />
          <PortfolioShowcase
            className="mt-14"
            featuredSlugs={["northpeak-roofing", "northclimate-hvac", "northline-plumbing"]}
          />
        </div>
      </section>

      <AuditCallout
        ctaId="local-seo-free-audit-bottom"
        title="Want to see where your rankings actually stand?"
        description="Get a free, honest audit of your current site before you commit to a retainer."
      />

      <section className="hc-section" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="hc-wrap">
          <SectionHeading eyebrow="FAQ" title="Common questions about local SEO." />
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
          <p className="hc-worknote" style={{ marginTop: 32, textAlign: "center" }}>
            Running SEO specifically for the trades? See{" "}
            <Link href="/local-seo-for-contractors">local SEO for home service businesses</Link>.
          </p>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
