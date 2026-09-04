import type { Metadata } from "next";
import Link from "next/link";
import { LayoutTemplate, Smartphone, MousePointerClick, Gauge, MapPin, ListChecks } from "lucide-react";
import { site } from "@/data/site";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { homeFontClassName } from "@/lib/fonts/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

const PAGE_PATH = "/web-design-ottawa";
const H1_TITLE = "Web Design Ottawa";
// Page-specific portion of the <title> tag — layout.tsx's `%s | Tech Abélard`
// template appends the site name automatically, so the resolved tag reads
// "Web Design Ottawa | Websites for Local Businesses | Tech Abélard".
const SEO_TITLE = "Web Design Ottawa | Websites for Local Businesses";
const PAGE_DESCRIPTION =
  "Web design for Ottawa businesses that turns visitors into leads — mobile-friendly, fast, and built for local SEO from day one. Serving contractors and local service businesses across Ottawa.";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: `${site.url}${PAGE_PATH}`,
    title: `${SEO_TITLE} | ${site.name}`,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_TITLE} | ${site.name}`,
    description: PAGE_DESCRIPTION,
  },
};

const provides = [
  {
    icon: Smartphone,
    title: "Mobile-friendly, not mobile-adjusted",
    description:
      "Most of your searches come from a phone — someone standing in a driveway in Barrhaven or a kitchen in Orleans, comparing three companies in under a minute. We build the mobile-friendly version first, then scale up to desktop, not the other way around.",
  },
  {
    icon: MousePointerClick,
    title: "Conversion-focused design",
    description:
      "Every page is built around one job: turning that visitor into a call, a form fill, or a booked estimate. Not a portfolio piece — a working sales tool.",
  },
  {
    icon: Gauge,
    title: "Performance",
    description:
      "A slow site loses the visitor before they see what you offer. Core Web Vitals, image delivery, and caching get tuned in during the build, not patched on after the fact.",
  },
  {
    icon: MapPin,
    title: "Local SEO readiness",
    description:
      "Clean schema markup, semantic structure, and a page architecture Google can actually parse — so if you run a local SEO campaign next month or next year, the site isn't the thing holding it back.",
  },
  {
    icon: ListChecks,
    title: "Lead generation that actually gets used",
    description:
      "Contact and quote forms that are short, mobile-friendly, and validated — wired to notify you the moment someone submits, not buried three clicks deep in a menu.",
  },
  {
    icon: LayoutTemplate,
    title: "A real website redesign, if that's what you need",
    description:
      "If your current site already ranks but doesn't convert, a rebuild isn't automatically the answer. We'll tell you honestly whether the fix is a redesign or something smaller — starting with a free audit.",
  },
];

const faqItems = [
  {
    category: "General" as const,
    question: "Are you an Ottawa web designer, or based somewhere else?",
    answer:
      "We work with Ottawa businesses remotely — discovery calls, email, and video meetings — the same process we use with every client, regardless of city. If an in-person conversation matters to you, say so on the call and we'll figure out what's possible.",
  },
  {
    category: "General" as const,
    question: "Do you build websites for any Ottawa business, or just certain industries?",
    answer:
      "We build exclusively for home service businesses — plumbing, HVAC, roofing, electrical, landscaping, construction, and the trades around them. Most of our clients are small business owners competing hard for local search visibility, which is exactly who this page and our small business web design work is built around.",
  },
  {
    category: "Pricing" as const,
    question: "How much does a new website cost?",
    answer:
      "It depends on the tier and scope — see the full breakdown on our Pricing page. Final scope gets confirmed on a short discovery call, not guessed at from a form.",
  },
  {
    category: "SEO" as const,
    question: "Do you also handle local SEO for Ottawa businesses, or just the website?",
    answer:
      "Both, as separate services. A well-built site is the foundation; local SEO is the ongoing work that gets it found. See our Local SEO service and our dedicated page for contractor SEO if you're ready to go beyond the build.",
  },
  {
    category: "Process" as const,
    question: "How long does an Ottawa website project take?",
    answer:
      "Essential builds in 2–3 weeks, Professional in 4–6 weeks, and Premium in 6–10 weeks, depending on scope, content readiness, and revision rounds. Nothing about being in Ottawa changes that timeline — the process is the same wherever the client is.",
  },
];

export default async function WebDesignOttawaPage() {
  const region = await getRegion();
  const copy = regionCopy[region];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: H1_TITLE, item: `${site.url}${PAGE_PATH}` },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Web Design",
    name: H1_TITLE,
    description: PAGE_DESCRIPTION,
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      url: site.url,
      telephone: site.phone.display,
      email: site.email,
    },
    areaServed: { "@type": "City", name: "Ottawa", containedInPlace: { "@type": "State", name: "Ontario" } },
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
        eyebrow="Web Design — Ottawa"
        title={H1_TITLE}
        description="A mobile-friendly, conversion-focused website for your Ottawa business — built to turn visitors into calls, not just look good on a phone. Whether you need website design from scratch or a full website redesign, every page is built around one job: lead generation."
      >
        <div className="hc-hero__ctas">
          <Button href="/contact" variant="ink" size="lg" data-cta="web-design-ottawa-hero-discovery-call" showArrow>
            Book a Discovery Call
          </Button>
          <Button href="/audit" variant="outline" size="lg" data-cta="web-design-ottawa-hero-audit">
            Get a Free Website Audit
          </Button>
        </div>
      </PageHero>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Who This Is For"
            title="Built for Ottawa's local businesses and contractors."
            description={`${copy.aboutWhoWeServeDescription} If you serve Ottawa and the surrounding communities, and you're competing against other local businesses for the same searches, this is the work we do.`}
          />
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="The Real Problem"
            title="A lot of Ottawa service businesses are losing jobs to a worse company with a better website."
            description="Search traffic in Ottawa's trades market skews mobile and impatient — someone with a leaking pipe or a dead furnace isn't reading three paragraphs before they call. If your site is slow, hard to navigate on a phone, or doesn't make the phone number obvious in the first five seconds, the visitor calls the next name on the list instead. That's not a marketing problem. It's a design problem, and it's fixable."
            tone="cream"
          />
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="What We Build"
            title="Six things every Ottawa site gets, no exceptions."
            description="Whichever tier you start on, these aren't upsells — they're the baseline every project is built around."
          />
          <div
            className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2"
            style={{ borderTop: "1px solid var(--rule)", paddingTop: 40 }}
          >
            {provides.map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll key={item.title} delay={i * 60}>
                  <div className="flex gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                      style={{ border: "1px solid var(--rule)" }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.6} style={{ color: "var(--hc-ink)" }} />
                    </div>
                    <div>
                      <h3 className="hc-heading__title" style={{ fontSize: 18 }}>
                        {item.title}
                      </h3>
                      <p className="hc-lede" style={{ marginTop: 6, fontSize: 14.5 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Process"
            title="What actually happens, week by week."
            description="The same rhythm for every project, Ottawa-based or not — only the volume of work changes by tier."
            tone="cream"
          />
          <div className="mt-14">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Industries"
            title="Industries we build for across Ottawa."
            description="Any Ottawa business where a missed call is a missed job benefits from a faster, clearer site — these are the industries we build for most."
          />
          <div className="mt-10 flex flex-wrap gap-2">
            {site.industries.map((industry) => (
              <Badge key={industry} tone="neutral">
                {industry}
              </Badge>
            ))}
          </div>
          <p className="hc-lede" style={{ marginTop: 32, maxWidth: "42rem" }}>
            Most of our work is for home service trades — plumbers, HVAC companies, roofers, electricians — though the
            portfolio below also includes concept builds for clinics and professional-service brands, if that&apos;s
            closer to what you run. Running a plumbing company specifically? See our dedicated{" "}
            <Link href="/plumber-website-design" className="hc-inline-link">
              plumber website design
            </Link>{" "}
            page.
          </p>
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Examples"
              title="Concept work from the portfolio."
              description="Every project below is a concept build created to demonstrate our own design and SEO capabilities across different home-service niches — not a completed client project."
              tone="cream"
            />
            <Link href="/portfolio" className="hc-inline-link hidden shrink-0 text-sm sm:block">
              See the full portfolio →
            </Link>
          </div>
          <PortfolioShowcase
            className="mt-14"
            featuredSlugs={["northline-plumbing", "northpeak-roofing", "northclimate-hvac"]}
          />
          <Link href="/portfolio" className="hc-inline-link mt-8 block text-sm sm:hidden">
            See the full portfolio →
          </Link>
        </div>
      </section>

      <AuditCallout
        ctaId="web-design-ottawa-free-audit"
        title="Already have a website that isn't converting?"
        description="Get a free, honest audit — we'll tell you whether a full redesign or a smaller fix is what your Ottawa site actually needs."
      />

      <section className="hc-section" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="hc-wrap">
          <SectionHeading eyebrow="FAQ" title="Common questions from Ottawa business owners." />
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
          <p className="hc-lede" style={{ marginTop: 32, textAlign: "center", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
            Ready to see local rankings move too? Read how we approach{" "}
            <Link href="/local-seo-for-contractors" className="hc-inline-link">
              local SEO for contractors
            </Link>{" "}
            or explore our{" "}
            <Link href="/services/local-seo" className="hc-inline-link">
              local SEO service
            </Link>{" "}
            directly.
          </p>
          <p
            className="hc-lede"
            style={{ marginTop: 16, textAlign: "center", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}
          >
            Want to see the work first? Browse the{" "}
            <Link href="/portfolio" className="hc-inline-link">
              full portfolio
            </Link>
            , check{" "}
            <Link href="/pricing" className="hc-inline-link">
              pricing
            </Link>
            , or explore the{" "}
            <Link href="/services/web-design" className="hc-inline-link">
              Web Design service
            </Link>{" "}
            in more detail.
          </p>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
