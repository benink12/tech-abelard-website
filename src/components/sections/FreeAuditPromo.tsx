import { Search, Smartphone, MousePointerClick, ListChecks, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";

const benefits = [
  { icon: Search, label: "Technical SEO review" },
  { icon: Smartphone, label: "Mobile and usability review" },
  { icon: MousePointerClick, label: "Conversion and CTA review" },
  { icon: ListChecks, label: "Top three recommended improvements" },
  { icon: ShieldCheck, label: "No obligation" },
];

export function FreeAuditPromo() {
  return (
    <section className="border-y border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
      <Container>
        <RevealOnScroll>
          <div className="mx-auto max-w-4xl rounded-3xl border border-brass/25 bg-cream-card p-8 text-center sm:p-14">
            <SectionHeading
              eyebrow="Free Website Audit"
              title="Not sure what your website needs?"
              description="Request a free website audit and receive a clear review of your SEO, mobile experience, performance, trust signals, and lead-generation opportunities."
              align="center"
              className="mx-auto"
            />

            <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-4">
              {benefits.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-ink/70">
                  <Icon className="h-4 w-4 shrink-0 text-brass-ink" strokeWidth={1.8} />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex justify-center">
              <Button href="/free-audit" size="lg" data-cta="homepage-free-audit" showArrow>
                Request My Free Audit
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
