import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { iconMap } from "@/lib/icons";
import { homeFontClassName } from "@/lib/fonts/home";
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
    <div className={`home-concept ${homeFontClassName}`}>
      <section className="hc-section hc-section--dark" style={{ paddingTop: "clamp(140px,20vh,200px)" }}>
        <div className="hc-wrap">
          <div className="mx-auto max-w-3xl text-center">
            <p className="hc-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Instant AI Website Audit
            </p>

            <h1 className="hc-h1" style={{ marginTop: 22, fontSize: "clamp(32px,5.6vw,64px)" }}>
              Find out what your website is doing{" "}
              <em style={{ fontStyle: "normal", textDecoration: "underline", textDecorationThickness: "0.06em", textUnderlineOffset: "0.06em" }}>
                right now
              </em>{" "}
              — before
              your next customer does.
            </h1>

            <p className="hc-lede" style={{ margin: "24px auto 0", maxWidth: "60ch" }}>
              An automated, real-time scan of your actual site — design, SEO, performance, mobile experience, trust
              signals, and conversion paths — scored and explained in under a minute.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-xl">
            <AuditExperience />
          </div>

          <p className="hc-worknote" style={{ marginTop: 20, textAlign: "center", textTransform: "none", letterSpacing: 0 }}>
            This is an automated, instant snapshot of your actual site — real signals, no invented numbers.
          </p>
        </div>
      </section>

      <section className="hc-section" style={{ padding: "clamp(60px,8vw,100px) 0" }}>
        <div className="hc-wrap">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <RevealOnScroll key={item.step} delay={i * 80}>
                <p className="hc-eyebrow" style={{ color: "var(--slate)" }}>
                  {item.step}
                </p>
                <h3 className="hc-heading__title" style={{ fontSize: 18, marginTop: 8 }}>
                  {item.title}
                </h3>
                <p className="hc-lede" style={{ marginTop: 6, fontSize: 14.5 }}>
                  {item.description}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-section" style={{ padding: "clamp(60px,8vw,100px) 0" }}>
        <div className="hc-wrap">
          <div className="mx-auto max-w-2xl text-center">
            <p className="hc-eyebrow">What Gets Scored</p>
            <h2 className="hc-h2" style={{ marginTop: 14 }}>
              Six categories, scored from what your site actually does.
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-3">
            {CATEGORY_PREVIEW.map((item, i) => {
              const Icon = iconMap[item.icon];
              return (
                <RevealOnScroll key={item.label} delay={i * 50}>
                  <div className="flex flex-col items-center gap-3 hc-flatcard" style={{ textAlign: "center" }}>
                    <Icon className="h-5 w-5" strokeWidth={1.5} style={{ color: "var(--hc-ink)" }} />
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--hc-ink)", margin: 0 }}>{item.label}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
