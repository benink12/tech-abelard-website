import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  PhoneMissed,
  MessagesSquare,
  Bot,
  ListChecks,
  CalendarCheck,
  UserRoundCheck,
  FileText,
  MoonStar,
} from "lucide-react";
import { site } from "@/data/site";
import { homeFontClassName } from "@/lib/fonts/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";

const PAGE_PATH = "/ai-receptionist-for-small-business";
const PAGE_TITLE = "AI Receptionist for Small Business";
const PAGE_DESCRIPTION =
  "An AI phone receptionist for small businesses across Canada — answers calls, qualifies leads, and handles common questions day or night. Call the live demo: (581) 499-0011.";

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

const comparison = [
  {
    option: "Voicemail",
    reality: "Free, but most callers hang up instead of leaving a message — and nothing happens until someone checks it.",
  },
  {
    option: "Human answering service",
    reality: "A live person answers, but usually reading a generic script with no real knowledge of your business, billed per minute either way.",
  },
  {
    option: "AI receptionist",
    reality: "Configured around your actual services and hours, answers immediately at any hour, and hands off to a real person when a call needs one.",
  },
];

const whatItDoes = [
  {
    icon: PhoneMissed,
    title: "Picks up the calls that would otherwise be missed",
    description: "On another line, on a job, or closed for the night — the call still gets answered instead of ringing out.",
  },
  {
    icon: MessagesSquare,
    title: "Answers the questions you get every day",
    description: "Hours, service areas, rough pricing, what you do and don't handle — without pulling a person off what they're doing.",
  },
  {
    icon: ListChecks,
    title: "Qualifies the lead before the callback",
    description: "Asks the questions your team would ask anyway, so whoever calls back already has what they need.",
  },
  {
    icon: CalendarCheck,
    title: "Takes appointment requests",
    description: "Collects preferred dates and details to help get a caller onto the schedule.",
  },
  {
    icon: UserRoundCheck,
    title: "Hands off when a call needs a person",
    description: "Recognizes the edge of what it can confidently handle and transfers or flags it, instead of trapping a caller in a loop.",
  },
  {
    icon: FileText,
    title: "Sends you a summary, where configured",
    description: "A written summary of what the call was about, so a missed call never quietly becomes a missed customer.",
  },
];

const faqItems = [
  {
    category: "General" as const,
    question: "How accurate is it?",
    answer:
      "It handles routine questions and common call flows well, but it isn't perfect and we won't pretend it is. It's built to recognize when something is outside what it can confidently answer and hand off to a real person instead of guessing.",
  },
  {
    category: "General" as const,
    question: "Does this replace my staff?",
    answer:
      "No. It's a safety net for the calls that would otherwise go to voicemail — busy lines, job sites, after hours — not a substitute for the people who run your business. Most clients run it alongside their existing team.",
  },
  {
    category: "Pricing" as const,
    question: "Will this guarantee more bookings or revenue?",
    answer:
      "No — we won't promise a number we can't back up. What it does is make sure fewer calls go unanswered. Whether that turns into more booked jobs depends on your business, your follow-up, and your market, same as any other channel.",
  },
  {
    category: "General" as const,
    question: "Are the calls recorded?",
    answer:
      "It depends on the setup and the consent rules in your jurisdiction — that's a conversation we have during onboarding, not something we'll claim either way here. What every configuration includes is a written summary of the call, not necessarily an audio recording.",
  },
  {
    category: "Process" as const,
    question: "Can I get one built for my own business, not just try the demo?",
    answer:
      "Yes — the number above is a live demo you can call anytime to hear how it handles a real conversation. If you like it, we configure a version around your actual services, hours, and call flows, on your own business line.",
  },
];

export default function AIReceptionistForSmallBusinessPage() {
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
    serviceType: "AI Receptionist",
    name: "AI Receptionist for Small Business",
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
      audienceType: "Small businesses",
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
        eyebrow="AI Receptionist — Small Business"
        title="An AI receptionist that answers every call your small business misses."
        description="Built for small teams without a full-time front desk — a phone answered by voicemail is a phone call that just went to your competitor instead."
      >
        <div className="hc-flatcard" style={{ maxWidth: 480, marginTop: 40, borderTopColor: "var(--rule)" }}>
          <p className="hc-eyebrow">Hear it for yourself, right now</p>
          <p className="hc-heading__title" style={{ fontSize: 28, marginTop: 8 }}>
            {site.phone.display}
          </p>
          <p style={{ marginTop: 8 }}>
            Call the live demo any time, day or night. If you like how it sounds, we&apos;ll build a version
            configured for your business.
          </p>
          <div className="hc-hero__ctas">
            <Button href={site.phone.href} variant="ink" size="lg" data-cta="ai-receptionist-smb-hero-call">
              <Phone className="h-4 w-4" /> Call The AI Receptionist
            </Button>
          </div>
        </div>
      </PageHero>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Who This Is For"
            title="Any small business where a missed call is a missed customer."
            description="Plumbers and electricians on a job site, a medspa or clinic with one person at the front desk, a property manager fielding calls between showings, a vet practice mid-appointment — small teams across Canada that can't have someone glued to the phone all day."
          />
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="The Real Problem"
            title="Small businesses lose customers to voicemail, constantly."
            description="You're on another call, mid-appointment, or it's 9pm on a Saturday — and the customer calling right now doesn't wait. Most callers who hit voicemail simply hang up and call the next business instead of leaving a message. That's not a staffing failure; it's a structural gap most small businesses never solve, because hiring a full-time receptionist for exactly that gap rarely pencils out."
            tone="cream"
          />
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="The Honest Comparison"
            title="Voicemail, an answering service, or an AI receptionist."
            description="None of these are perfect. Here's how they actually compare, without the sales pitch."
          />
          <div
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3"
            style={{ borderTop: "1px solid var(--rule)", paddingTop: 40 }}
          >
            {comparison.map((item, i) => (
              <RevealOnScroll key={item.option} delay={i * 70}>
                <div className="hc-flatcard" style={{ height: "100%" }}>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ border: "1px solid var(--rule)" }}
                  >
                    <Bot className="h-4 w-4" strokeWidth={1.7} style={{ color: "var(--hc-ink)" }} />
                  </div>
                  <h3>{item.option}</h3>
                  <p>{item.reality}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="What It Does"
            title="One receptionist, the jobs that actually matter."
            description="Not a phone tree, and not a dead-end voicemail box — a live conversation that gets your caller what they need."
            tone="cream"
          />
          <div
            className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2"
            style={{ borderTop: "1px solid var(--rule-inv)", paddingTop: 40 }}
          >
            {whatItDoes.map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll key={item.title} delay={i * 50}>
                  <div className="flex gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                      style={{ border: "1px solid var(--rule-inv)" }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.6} style={{ color: "var(--bone)" }} />
                    </div>
                    <div>
                      <h3 className="hc-heading__title" style={{ fontSize: 18, color: "var(--bone)" }}>
                        {item.title}
                      </h3>
                      <p className="hc-lede" style={{ marginTop: 6, fontSize: 14.5, color: "rgba(230,231,226,0.62)" }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
          <div
            className="mt-10 flex items-center gap-3 hc-flatcard"
            style={{ borderTopColor: "var(--rule-inv)" }}
          >
            <MoonStar className="h-5 w-5 shrink-0" strokeWidth={1.7} style={{ color: "var(--bone)" }} />
            <p style={{ margin: 0, color: "rgba(230,231,226,0.62)" }}>
              After-hours and weekend calls get the same treatment as a call at 2pm on a Tuesday — coverage
              doesn&apos;t stop when your team goes home.
            </p>
          </div>
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Industries"
            title="Built for small teams that live on the phone."
            description="Any business where a missed call risks a missed customer benefits — these are the industries we build for most."
          />
          <div className="mt-10 flex flex-wrap gap-2">
            {site.industries.map((industry) => (
              <Badge key={industry} tone="neutral">
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap" style={{ textAlign: "center" }}>
          <SectionHeading
            eyebrow="Custom Setup"
            title="Configured around how your business actually runs."
            description="Call flows, the questions it asks, what it's allowed to promise, and its tone of voice are all set up around your specific services, hours, and team — not a generic script."
            align="center"
            tone="cream"
            className="mx-auto"
          />
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center" style={{ marginTop: 28 }}>
            <Button href={site.phone.href} variant="outline-cream" size="lg" data-cta="ai-receptionist-smb-mid-call">
              <Phone className="h-4 w-4" /> Call The AI Receptionist
            </Button>
            <Button href="/contact" variant="cream" size="lg" data-cta="ai-receptionist-smb-custom-setup" showArrow>
              Build One For My Business
            </Button>
          </div>
        </div>
      </section>

      <section className="hc-section" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="hc-wrap">
          <SectionHeading eyebrow="FAQ" title="Common questions, answered honestly." />
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
          <p className="hc-lede" style={{ marginTop: 40, textAlign: "center", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
            Serving home service trades specifically? See the full{" "}
            <Link href="/services/ai-receptionist" className="hc-inline-link">
              AI Receptionist service
            </Link>{" "}
            or pair it with{" "}
            <Link href="/local-seo-for-contractors" className="hc-inline-link">
              SEO for plumbers, HVAC, and roofing companies
            </Link>{" "}
            or{" "}
            <Link href="/plumber-website-design" className="hc-inline-link">
              plumbing-specific web design
            </Link>
            .
          </p>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
