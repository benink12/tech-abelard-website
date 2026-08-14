import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { iconMap } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AuditExperience } from "@/components/sections/audit/AuditExperience";

export const metadata: Metadata = {
  title: "Instant AI Website Audit",
  description:
    "Get an instant, automated snapshot of your website's design, SEO, performance, mobile experience, trust signals, and conversion paths — scored in seconds.",
  alternates: { canonical: "/audit" },
};

const CATEGORY_PREVIEW = [
  { icon: "layout", label: "Design" },
  { icon: "search", label: "SEO" },
  { icon: "gauge", label: "Performance" },
  { icon: "smartphone", label: "Mobile Experience" },
  { icon: "shield-check", label: "Trust & Credibility" },
  { icon: "mouse-pointer-click", label: "Conversion Optimization" },
] as const;

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us about your business",
    description: "Your business name, website, and how to reach you. Takes about ten seconds.",
  },
  {
    step: "02",
    title: "We scan your site live",
    description: "Our engine reads your actual site in real time — the same page a visitor would land on.",
  },
  {
    step: "03",
    title: "Get your scored report",
    description: "Six categories, scored and explained, with specific improvements ranked by priority.",
  },
];

export default function AuditPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-[calc(env(safe-area-inset-top)+8.25rem)] text-cream sm:pb-28 sm:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(176,141,87,0.18), transparent), radial-gradient(ellipse 40% 40% at 90% 20%, rgba(176,141,87,0.1), transparent)",
          }}
        />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="brass-line mx-auto mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Instant AI Website Audit
            </p>

            <h1 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
              Find out what your website is doing <span className="text-brass-light">right now</span> —
              before your next customer does.
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-cream/65 sm:text-xl">
              An automated, real-time scan of your actual site — design, SEO, performance, mobile experience, trust
              signals, and conversion paths — scored and explained in under a minute.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-xl">
            <AuditExperience />
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-cream/35">
            This is an automated, instant snapshot of your actual site — real signals, no invented numbers.
          </p>
        </Container>
      </section>

      <section className="border-b border-ink/8 py-20 sm:py-28">
        <Container>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <RevealOnScroll key={item.step} delay={i * 80}>
                <p className="font-display text-3xl font-medium text-brass-ink">{item.step}</p>
                <h3 className="mt-3 font-display text-lg font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.description}</p>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="brass-line mx-auto mb-5 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-brass-ink">
              What Gets Scored
            </p>
            <h2 className="text-balance font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Six categories, scored from what your site actually does.
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-3">
            {CATEGORY_PREVIEW.map((item, i) => {
              const Icon = iconMap[item.icon];
              return (
                <RevealOnScroll key={item.label} delay={i * 50}>
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink/8 bg-cream-card p-6 text-center">
                    <Icon className="h-6 w-6 text-brass-ink" strokeWidth={1.6} />
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
