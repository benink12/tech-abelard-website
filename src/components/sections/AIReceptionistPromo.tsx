import { Phone, ArrowRight } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";

export function AIReceptionistPromo() {
  return (
    <section className="border-y border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
      <Container>
        <RevealOnScroll>
          <div className="mx-auto max-w-4xl rounded-3xl border border-brass/25 bg-cream-card p-8 text-center sm:p-14">
            <SectionHeading
              eyebrow="AI Receptionist"
              title="Never miss a potential customer."
              description="Tech Abélard builds AI receptionists that can answer calls, speak naturally with customers, qualify leads, answer common questions, collect information, help book appointments, and transfer callers to a real person when needed."
              align="center"
              className="mx-auto"
            />

            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-ink/8 bg-cream p-6">
              <p className="text-sm font-medium text-ink/80">Want to hear it for yourself?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                Call {site.phone.display} and speak directly with our AI Receptionist. If you like how it works, we
                can build a custom version for your business.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={site.phone.href} size="lg" data-cta="homepage-ai-receptionist-call">
                <Phone className="h-4 w-4" /> Call the AI Receptionist
              </Button>
              <Button href="/contact" variant="outline" size="lg" data-cta="homepage-ai-receptionist-build">
                Build One For My Business <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
