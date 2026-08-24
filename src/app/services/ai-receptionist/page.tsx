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
import { Container } from "@/components/ui/Container";
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

export default function AIReceptionistPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Receptionist"
        title="Your business can answer every call — even when you can't."
        description="An AI receptionist that answers calls, qualifies leads, answers common questions, and helps book appointments — built to make sure a busy day or an after-hours call never means a missed customer."
      >
        <div className="mt-10 max-w-xl rounded-2xl border border-cream/15 bg-cream/[0.06] p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-light">Hear it for yourself</p>
          <p className="mt-2 font-display text-2xl font-medium text-cream sm:text-3xl">{site.phone.display}</p>
          <p className="mt-2 text-sm leading-relaxed text-cream/65">
            Call the live demo any time. If you like how it sounds, we can build a custom version for your business.
          </p>
          <div className="mt-6">
            <Button href={site.phone.href} variant="cream" size="lg" data-cta="ai-receptionist-hero-call">
              <Phone className="h-4 w-4" /> Call the AI Receptionist
            </Button>
          </div>
        </div>
      </PageHero>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="What It Does"
            title="One receptionist, seven jobs."
            description="Not a phone tree, and not a voicemail box — a live conversation that gets your caller what they need."
          />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-ink/8 pt-10 sm:grid-cols-2">
            {whatItDoes.map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll key={item.title} delay={i * 50}>
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
            eyebrow="How It Works"
            title="From ringing phone to logged lead."
          />
          <div className="relative mt-14">
            <div className="absolute left-[27px] top-2 hidden h-[calc(100%-2rem)] w-px bg-ink/10 sm:block" />
            <div className="flex flex-col gap-10">
              {howItWorks.map((step, i) => (
                <RevealOnScroll key={step.number} delay={i * 70}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[56px_1fr] sm:gap-6">
                    <div className="relative hidden h-14 w-14 items-center justify-center rounded-full border border-brass-ink/30 bg-cream font-display text-lg font-medium text-brass-ink sm:flex">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">{step.title}</h3>
                      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/60 sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
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
        </Container>
      </section>

      <section className="border-t border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl border border-brass/25 bg-cream-card p-8 text-center sm:p-10">
            <SectionHeading
              eyebrow="Custom Setup"
              title="Configured around how your business actually runs."
              description="Call flows, the questions it asks, what it's allowed to promise, and its tone of voice are all set up around your specific services, hours, and service area — not a generic script."
              align="center"
              className="mx-auto"
            />
            <Button href="/contact" size="lg" data-cta="ai-receptionist-custom-setup" showArrow>
              Build One For My Business
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/8 py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Common questions, answered honestly." />
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink/50">
            Not in the trades?{" "}
            <Link href="/ai-receptionist-for-small-business" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              See how it works for small businesses generally
            </Link>
            .
          </p>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
