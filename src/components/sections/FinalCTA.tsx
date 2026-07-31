import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-cream sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(176,141,87,0.14), transparent)",
        }}
      />
      <Container className="relative text-center">
        <p className="brass-line mx-auto mb-7 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brass">
          Let&apos;s Talk
        </p>
        <h2 className="text-balance mx-auto max-w-3xl font-display text-3xl font-medium tracking-tight sm:text-5xl">
          Your competitor&apos;s website isn&apos;t better than yours by accident.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-cream/65 sm:text-lg">
          Book a short discovery call — we&apos;ll tell you honestly which tier fits your business,
          no pressure and no generic pitch.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/contact" variant="cream" size="lg" showArrow>
            {site.cta.primary}
          </Button>
          <Button href="/pricing" variant="outline-cream" size="lg">
            View Pricing
          </Button>
        </div>
      </Container>
    </section>
  );
}
