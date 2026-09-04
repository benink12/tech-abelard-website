import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { site } from "@/data/site";
import { homeFontClassName } from "@/lib/fonts/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

const PAGE_PATH = "/local-seo-for-contractors";
const PAGE_TITLE = "Local SEO for Contractors & Home Service Businesses";
const PAGE_DESCRIPTION =
  "Local SEO for contractors — plumbers, HVAC, roofing, and electrical companies. Service-area targeting, technical SEO, and citations. Rankings vary; never guaranteed.";

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

const CONTRACTOR_INDUSTRIES = new Set([
  "Plumbing",
  "HVAC",
  "Roofing",
  "Electrical",
  "Landscaping",
  "Construction",
  "Tree Services",
  "Painting",
  "Concrete",
]);
const contractorIndustries = site.industries.filter((industry) => CONTRACTOR_INDUSTRIES.has(industry));

const checklist = [
  {
    title: "Local keyword research",
    description: "\"[Service] + [city]\" terms mapped to how people actually search, not a guess at what sounds right.",
  },
  {
    title: "Service-area pages",
    description: "One real page per city or region you actually serve — see below for why that's different from a doorway page.",
  },
  {
    title: "On-page SEO",
    description: "Titles, headings, and copy that name your services and service areas explicitly, instead of vague marketing language.",
  },
  {
    title: "Technical SEO",
    description: "Core Web Vitals, LocalBusiness / Service / FAQ schema, and sitemap and robots hygiene — the infrastructure Google actually crawls.",
  },
  {
    title: "Google Business Profile",
    description: "Full claim and category audit, weekly posts, Q&A seeding, and review-response management.",
  },
  {
    title: "Citation building",
    description: "Consistent name, address, and phone number across the directories contractors actually get found on — HomeStars, Yelp, BBB, trade associations.",
  },
  {
    title: "Conversion tracking",
    description: "Calls and form fills tied back to the keywords and pages driving them, not just a raw traffic number.",
  },
  {
    title: "Monthly reporting",
    description: "Rankings and traffic reported in plain language every month — what moved, why, and what's next.",
  },
];

const monthlyRhythm = [
  { week: "Week 1", title: "Audit & Prioritize", detail: "Review current rankings, GBP insights, and citation consistency. Confirm this month's content and fix list." },
  { week: "Week 2", title: "Execute", detail: "Publish and optimize service and service-area content, complete technical fixes, and push GBP posts." },
  { week: "Week 3", title: "Build", detail: "Continue citation building, run an internal linking pass, and update competitor tracking for your market." },
  { week: "Week 4", title: "Report & Plan", detail: "Compile the monthly report, hold the strategy call, and lock next month's priorities." },
];

const doNotGuarantee = [
  "A specific ranking position or \"page 1, guaranteed\" — no honest agency can promise this. Google's algorithm isn't for sale, and results vary by market, competition, and starting point.",
  "A fixed timeline — local SEO compounds over months, not days. A contractor in a low-competition market moves faster than one competing against ten established companies for the same searches.",
  "Rankings that hold regardless of what happens on your end — review volume, response time, and actual service quality still matter, to both customers and to Google.",
  "Results without ongoing work — SEO is a monthly discipline. Pausing the retainer eventually pauses the compounding too.",
];

const faqItems = [
  {
    category: "SEO" as const,
    question: "How is SEO for contractors different from SEO for other businesses?",
    answer:
      "It's almost entirely local and service-area driven — a plumber doesn't need to rank nationally, they need to rank for \"[service] near me\" and every city they actually truck out to. That changes what gets prioritized: service-area pages and Google Business Profile matter more than they would for an e-commerce brand chasing national keywords.",
  },
  {
    category: "SEO" as const,
    question: "Do you build a page for every city we work in?",
    answer:
      "For the cities and regions you genuinely serve, yes — each with real, specific content about your work in that area, not a template with the city name swapped in. We won't build pages for areas you don't actually service; that's the doorway-page pattern search engines penalize, and it doesn't convert anyway.",
  },
  {
    category: "Pricing" as const,
    question: "Is citation building included, or a separate cost?",
    answer:
      "It's included in every SEO retainer, alongside Google Business Profile management. There's no upsell menu — the pillars listed above are the standard scope.",
  },
  {
    category: "SEO" as const,
    question: "How do you track whether it's actually working?",
    answer:
      "Ranking position tracking for your target keywords, plus call and form-fill attribution tied to the pages driving them — reported monthly in a format you can read without a decoder ring, not a raw analytics export.",
  },
  {
    category: "General" as const,
    question: "Do I need a new website too, or can you run SEO on my current site?",
    answer:
      "SEO can run on an existing site if the underlying build is technically sound. If the site itself is the bottleneck — slow, hard to navigate on mobile, no schema — we'll say so plainly during the audit rather than selling a retainer on top of a broken foundation.",
  },
];

export default function LocalSEOForContractorsPage() {
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
    serviceType: "Local SEO",
    name: "Local SEO for Contractors",
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
      audienceType: "Contractors and home service businesses",
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
    <div className={`home-concept ${homeFontClassName}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PageHero
        eyebrow="Local SEO — Contractors & Trades"
        title="Local SEO for contractors who want the phone ringing, not just traffic."
        description="Built for plumbers, HVAC companies, roofers, electricians, and the trades around them — SEO that targets the searches that actually turn into jobs, with monthly reporting you can read yourself."
      >
        <div className="hc-hero__ctas">
          <Button href="/audit" variant="ink" size="lg" data-cta="contractor-seo-hero-free-audit" showArrow>
            Get a Free Website Audit
          </Button>
        </div>
      </PageHero>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Who This Is For"
            title="Service-area businesses competing for “near me” searches."
            description="Plumbing, HVAC, roofing, electrical, landscaping, construction, and the trades around them — businesses that live or die by local and service-area search, not national brand awareness."
          />
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="The Real Problem"
            title="Good contractors lose jobs to worse companies with better SEO, constantly."
            description="Great work doesn't show up in the map pack by itself. A thin site, an unmanaged Google Business Profile, no citations, and no service-area pages mean you're invisible for the exact searches your next customer is typing — while a mediocre competitor with a well-optimized profile gets the call instead."
            tone="cream"
          />
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="What's Included"
            title="Eight things every contractor SEO retainer covers."
            description="No upsell tiers hidden behind the pitch — this is the actual monthly scope."
          />
          <div
            className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2"
            style={{ borderTop: "1px solid var(--rule)", paddingTop: 40 }}
          >
            {checklist.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 50}>
                <div className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--hc-ink)" }} />
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
            ))}
          </div>
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Service-Area Targeting"
            title="One real page per city, never a city-name find-and-replace."
            description="A service-area page only works if it says something a generic “areas we serve” list doesn't — the specific neighborhoods, the response time in that market, the jobs you've actually done there. Swap the city name across twenty identical pages and you've built a doorway page: exactly what search engines are built to detect and demote, and it reads as thin to a real visitor too. We only build pages for cities you genuinely service, each with distinct, useful content and clear internal links back to your core service pages."
            tone="cream"
          />
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Every Month"
            title="What actually happens on a retainer."
            description="Only the volume changes by market size and competition — the rhythm is the same for every client."
            align="center"
            className="mx-auto"
          />
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {monthlyRhythm.map((item) => (
              <div key={item.week} className="hc-flatcard">
                <p className="hc-eyebrow">{item.week}</p>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading eyebrow="Industries" title="Built for the trades that live on local search." tone="cream" />
          <div className="mt-10 flex flex-wrap gap-2">
            {contractorIndustries.map((industry) => (
              <Badge key={industry} tone="cream">
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Capability, Not Case Studies"
            title="SEO structure, demonstrated on real builds."
            description="These concept projects aren't running client campaigns — there's no fabricated ranking or traffic data here. What you can see is the actual SEO architecture (schema, page structure, local-intent content) built into each one."
          />
          <PortfolioShowcase
            className="mt-14"
            featuredSlugs={["northline-plumbing", "northpeak-roofing", "northclimate-hvac"]}
          />
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <div className="mx-auto max-w-3xl hc-flatcard" style={{ borderTopColor: "var(--rule-inv)" }}>
            <div className="hc-flatcard__kicker">
              <ShieldAlert className="h-4 w-4" strokeWidth={1.5} />
              What we do not guarantee
            </div>
            <ul style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12, padding: 0, listStyle: "none" }}>
              {doNotGuarantee.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed"
                  style={{ color: "rgba(230,231,226,0.62)" }}
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(230,231,226,0.62)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <AuditCallout
        ctaId="contractor-seo-free-audit-bottom"
        title="Want to see where your rankings actually stand?"
        description="Get a free, honest audit of your current site before you commit to a retainer."
      />

      <section className="hc-section" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="hc-wrap">
          <SectionHeading eyebrow="FAQ" title="Common questions from contractors." />
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
          <p className="hc-lede" style={{ marginTop: 40, textAlign: "center", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
            Need the website rebuilt first? See{" "}
            <Link href="/plumber-website-design" className="hc-inline-link">
              plumbing website design
            </Link>
            , our{" "}
            <Link href="/web-design-ottawa" className="hc-inline-link">
              website redesign for Ottawa businesses
            </Link>
            , or the full{" "}
            <Link href="/services/local-seo" className="hc-inline-link">
              Local SEO service
            </Link>{" "}
            overview.
          </p>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
