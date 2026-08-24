import type { Metadata } from "next";
import Link from "next/link";
import { PhoneCall, Wrench, MapPinned, FileCheck2, ShieldCheck, Smartphone, SearchCheck } from "lucide-react";
import { site } from "@/data/site";
import { portfolioProjects } from "@/data/portfolio";
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

const PAGE_PATH = "/plumber-website-design";
const PAGE_TITLE = "Plumber Website Design That Converts Emergency Calls";
const PAGE_DESCRIPTION =
  "Website design built specifically for plumbing companies — click-to-call, service pages, service-area coverage, quote forms, and a fast mobile experience for someone searching mid-emergency.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: `${site.url}${PAGE_PATH}`,
    title: `${PAGE_TITLE} | ${site.name}`,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} | ${site.name}`,
    description: PAGE_DESCRIPTION,
  },
};

const northline = portfolioProjects.find((p) => p.slug === "northline-plumbing");

const conversionUX = [
  {
    icon: PhoneCall,
    title: "Click-to-call, above the fold",
    description: "The phone number isn't hiding in a header menu — it's tappable the instant the page loads, plus a sticky mobile call bar that follows the scroll.",
  },
  {
    icon: Wrench,
    title: "Dedicated service pages",
    description: "Drain cleaning, water heater repair, leak detection, sewer line work — each gets its own page instead of one paragraph on a generic services list, so you can actually rank for each one.",
  },
  {
    icon: MapPinned,
    title: "Service-area coverage, stated plainly",
    description: "A visitor shouldn't have to guess whether you cover their neighborhood. Service areas are listed clearly, not implied.",
  },
  {
    icon: FileCheck2,
    title: "Quote and contact forms that get filled out",
    description: "Short, validated, mobile-friendly — and wired to notify you the moment a request comes in, not sitting in a form plugin's dashboard nobody checks.",
  },
  {
    icon: ShieldCheck,
    title: "Trust signals where they belong",
    description: "Space built in for your actual licensing, insurance, years in business, and reviews — real information, positioned before the ask, not buried on an About page nobody visits.",
  },
  {
    icon: Smartphone,
    title: "Fast on a job-site phone",
    description: "Your customer is standing next to a leaking pipe, not on fiber internet. Performance is tuned for two-bar mobile connections, not a developer's office wifi.",
  },
];

const faqItems = [
  {
    category: "General" as const,
    question: "Can you build a separate page for each of our services?",
    answer:
      "Yes — that's the default approach, not an upsell. Drain cleaning, water heater work, leak detection, and whatever else you offer each get a real page, because it's how you actually rank for each of those searches individually instead of competing with yourself on one generic page.",
  },
  {
    category: "General" as const,
    question: "Do you handle emergency and after-hours messaging on the site?",
    answer:
      "Yes — if you offer 24/7 or same-day emergency service, that gets built into the hero, the navigation, and the mobile call bar, so it's the first thing a panicked visitor sees, not something they have to scroll to find.",
  },
  {
    category: "General" as const,
    question: "Can customers request a quote directly from the site?",
    answer:
      "Yes — a short, mobile-friendly quote form that notifies you the moment it's submitted. We keep it to the fields that actually matter so it gets finished, not abandoned halfway.",
  },
  {
    category: "SEO" as const,
    question: "Do you handle SEO too, or just the design?",
    answer:
      "Both, as separate services — a well-built site is the foundation, and local SEO is the ongoing work that gets it found. See our dedicated page on local SEO for contractors if you want both.",
  },
  {
    category: "General" as const,
    question: "Is NorthLine Plumbing & Drain a real client?",
    answer:
      "No — it's a concept project we built ourselves to demonstrate exactly this kind of plumbing-specific design: sticky call bar, emergency messaging, service-area page, and the SEO structure behind it. It's labeled as a concept everywhere it appears, including its own case study.",
  },
];

export default function PlumberWebsiteDesignPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: PAGE_TITLE, item: `${site.url}${PAGE_PATH}` },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Web Design",
    name: "Website Design for Plumbing Companies",
    description: PAGE_DESCRIPTION,
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      url: site.url,
      telephone: site.phone.display,
      email: site.email,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Plumbing companies",
    },
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PageHero
        eyebrow="Web Design — Plumbing Companies"
        title="Website design for plumbing companies, built for the call, not the scroll."
        description="A plumbing customer is usually mid-emergency when they search — a burst pipe, no hot water, a backed-up drain. The site's only job is getting them to call before they call the next name on the list."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" variant="cream" size="lg" data-cta="plumber-web-design-hero-discovery-call" showArrow>
            Book a Discovery Call
          </Button>
        </div>
      </PageHero>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Who This Is For"
            title="Residential, commercial, and emergency plumbing companies."
            description="Drain and sewer specialists, water heater installers, general residential plumbers, and commercial plumbing contractors — any business where a missed call from a phone-in-hand searcher is a missed job."
          />
        </Container>
      </section>

      <section className="border-t border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="The Real Problem"
            title="A plumbing site loses the job in the first five seconds."
            description="If a visitor can't find the phone number instantly, can't confirm you cover their area, or the page takes too long to load on their phone, they're calling the next search result — not scrolling further to find out more about you. Most plumbing sites also lump every service onto one page, which means they can't rank for “water heater repair” or “drain cleaning” as their own searches, only for “plumber” in general, where the competition is worst."
          />
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="What We Build"
            title="Conversion UX built specifically for plumbing."
            description="Not generic service-business template features — the specific patterns that get a plumbing visitor to actually call."
          />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-ink/8 pt-10 sm:grid-cols-2">
            {conversionUX.map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll key={item.title} delay={i * 60}>
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/5">
                      <Icon className="h-5 w-5 text-brass-ink" strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-ink">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{item.description}</p>
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
          <SectionHeading
            eyebrow="Local SEO Structure"
            title="Built to rank, not just to look good."
            description="LocalBusiness and Service schema, semantic heading structure, and dedicated service pages are part of the build itself — so if a local SEO campaign starts on day one or two years from now, the site isn't the thing holding it back."
          />
          <div className="mt-10 flex items-center gap-3">
            <SearchCheck className="h-5 w-5 shrink-0 text-brass-ink" strokeWidth={1.7} />
            <p className="text-sm text-ink/60">
              Want the ongoing SEO work too? See{" "}
              <Link href="/local-seo-for-contractors" className="text-brass-ink underline underline-offset-2 hover:text-ink">
                local SEO for contractors
              </Link>
              .
            </p>
          </div>
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

      <section className="border-t border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Concept Example"
              title={northline ? northline.name : "NorthLine Plumbing & Drain"}
              description={
                northline
                  ? `${northline.description} A concept project built to demonstrate this exact approach — not a real client.`
                  : "A concept project built to demonstrate this exact approach — not a real client."
              }
            />
          </div>
          <PortfolioShowcase
            className="mt-14"
            featuredSlugs={["northline-plumbing", "northpeak-roofing", "northclimate-hvac"]}
          />
        </Container>
      </section>

      <AuditCallout
        ctaId="plumber-web-design-free-audit"
        title="Already have a plumbing website that isn't converting?"
        description="Get a free, honest audit — we'll tell you exactly what's costing you calls before you commit to anything."
      />

      <section className="border-t border-ink/8 py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Common questions from plumbing companies." />
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink/50">
            Building for a service business outside Ottawa or plumbing specifically? See the full{" "}
            <Link href="/services/web-design" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              Web Design service
            </Link>{" "}
            or our{" "}
            <Link href="/web-design-ottawa" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              Ottawa web design page
            </Link>
            .
          </p>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
