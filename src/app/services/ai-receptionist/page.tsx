import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  ListChecks,
  MessageCircleQuestion,
  CalendarCheck,
  FileText,
  UserRoundCheck,
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

export const metadata: Metadata = {
  title: "AI Receptionist for Service Businesses",
  description:
    "An AI receptionist that answers calls, qualifies leads, answers common questions, and helps book appointments — even after hours. Call the live demo at (581) 499-0011.",
  alternates: { canonical: "/services/ai-receptionist" },
};

const whatItDoes = [
  {
    icon: Phone,
    title: "Call answering",
    description: "Answers in a natural, on-brand voice, day or night, so no call rings out to voicemail.",
  },
  {
    icon: ListChecks,
    title: "Lead qualification",
    description: "Asks the right questions and collects the details your team actually needs before the callback.",
  },
  {
    icon: MessageCircleQuestion,
    title: "FAQ answering",
    description: "Handles the common questions — hours, service areas, pricing ranges — without tying up a person.",
  },
  {
    icon: CalendarCheck,
    title: "Booking & appointment requests",
    description: "Collects preferred dates and details to help get a caller on the schedule.",
  },
  {
    icon: FileText,
    title: "Call summaries",
    description: "Every call is summarized and sent to you, so nothing gets lost between the call and the callback.",
  },
  {
    icon: UserRoundCheck,
    title: "Human handoff",
    description: "Recognizes when a caller needs a real person and hands off cleanly instead of trapping them in a loop.",
  },
  {
    icon: MoonStar,
    title: "After-hours coverage",
    description: "Nights, weekends, and holidays — the calls that would otherwise go straight to voicemail get answered.",
  },
];

const howItWorks = [
  {
    number: "01",
    title: "A customer calls your business number",
    description: "Whether it's during business hours or 2am on a Sunday, the call gets picked up immediately.",
  },
  {
    number: "02",
    title: "The AI receptionist has a natural conversation",
    description: "It answers common questions, qualifies the lead, and collects the details your business needs.",
  },
  {
    number: "03",
    title: "It books, transfers, or logs the call",
    description: "It can help with an appointment request, hand off to a real person when needed, or leave you a clear summary.",
  },
  {
    number: "04",
    title: "You get the summary — nothing falls through the cracks",
    description: "Every call is logged and summarized, so a missed call never means a missed lead.",
  },
];

const faqItems = [
  {
    category: "General" as const,
    question: "Does this replace my front-desk staff?",
    answer:
      "No — it's built to make sure calls get answered when your team is busy, on another line, or after hours, not to replace the people who run your business. Most clients use it alongside their existing staff, as a safety net rather than a substitute.",
  },
  {
    category: "General" as const,
    question: "How accurate is it?",
    answer:
      "It handles common questions and routine call flows well, but it isn't perfect and won't pretend to be. It's designed to recognize when a question is outside what it can confidently answer and hand off to a real person instead of guessing.",
  },
  {
    category: "General" as const,
    question: "Will customers know it's an AI?",
    answer:
      "We don't build it to deceive callers. It sounds natural, but we recommend being upfront that it's an automated receptionist — that honesty tends to build more trust than it costs.",
  },
  {
    category: "Process" as const,
    question: "Can it be customized for my business?",
    answer:
      "Yes — call flows, the questions it asks, its tone of voice, and what it's allowed to say are all configured around your specific business, services, and hours during setup.",
  },
  {
    category: "Pricing" as const,
    question: "What happens if it can't handle a call?",
    answer:
      "It's configured to recognize the edge of what it can confidently do and hand off to a real person or take a detailed message — it's not designed to keep a caller stuck in a loop.",
  },
];

const PAGE_PATH = "/services/ai-receptionist";
const PAGE_TITLE = "AI Receptionist for Service Businesses";

export default function AIReceptionistPage() {
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
    serviceType: "AI Receptionist",
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
        eyebrow="AI Receptionist"
        title="Your business can answer every call — even when you can't."
        description="An AI receptionist that answers calls, qualifies leads, answers common questions, and helps book appointments — built to make sure a busy day or an after-hours call never means a missed customer. Available for service businesses across Canada."
      >
        <div className="hc-flatcard" style={{ maxWidth: 480, marginTop: 40, borderTopColor: "var(--rule)" }}>
          <p className="hc-eyebrow">Hear it for yourself</p>
          <p className="hc-heading__title" style={{ fontSize: 28, marginTop: 8 }}>
            {site.phone.display}
          </p>
          <p style={{ marginTop: 8 }}>
            Call the live demo any time. If you like how it sounds, we can build a custom version for your business.
          </p>
          <div className="hc-hero__ctas">
            <Button href={site.phone.href} variant="ink" size="lg" data-cta="ai-receptionist-hero-call">
              <Phone className="h-4 w-4" /> Call the AI Receptionist
            </Button>
          </div>
        </div>
      </PageHero>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="What It Does"
            title="One receptionist, seven jobs."
            description="Not a phone tree, and not a voicemail box — a live conversation that gets your caller what they need."
          />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2" style={{ borderTop: "1px solid var(--rule)", paddingTop: 40 }}>
            {whatItDoes.map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll key={item.title} delay={i * 50}>
                  <div className="flex gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                      style={{ border: "1px solid var(--rule)" }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} style={{ color: "var(--hc-ink)" }} />
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
          <SectionHeading eyebrow="How It Works" title="From ringing phone to logged lead." tone="cream" />
          <div className="hc-steps" style={{ marginTop: 40 }}>
            {howItWorks.map((step, i) => (
              <RevealOnScroll key={step.number} delay={i * 60}>
                <div className="hc-step" style={{ borderBottomColor: "var(--rule-inv)" }}>
                  <span className="hc-step__n">{step.number}</span>
                  <span className="hc-step__t" style={{ color: "var(--bone)" }}>
                    {step.title}
                  </span>
                  <p className="hc-step__d" style={{ color: "rgba(230,231,226,0.62)" }}>
                    {step.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Industries"
            title="Built for service businesses that live on the phone."
            description="Any business where a missed call is a missed customer benefits — these are the industries we build for most."
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
            description="Call flows, the questions it asks, what it's allowed to promise, and its tone of voice are all set up around your specific services, hours, and service area — not a generic script."
            align="center"
            tone="cream"
            className="mx-auto"
          />
          <div style={{ marginTop: 28 }}>
            <Button href="/contact" size="lg" data-cta="ai-receptionist-custom-setup" showArrow>
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
          <p className="hc-worknote" style={{ marginTop: 32, textAlign: "center" }}>
            Not in the trades?{" "}
            <Link href="/ai-receptionist-for-small-business">See how it works for small businesses generally</Link>.
          </p>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
