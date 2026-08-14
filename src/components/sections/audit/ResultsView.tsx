import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ScoreRing, scoreTone } from "@/components/ui/ScoreRing";
import { CategoryCard } from "./CategoryCard";
import type { AuditResult } from "@/lib/audit/types";

const SCORE_HEADLINE: Record<ReturnType<typeof scoreTone>, string> = {
  good: "Your site is in solid shape.",
  fair: "Your site has real opportunity to improve.",
  poor: "Your site is likely costing you customers.",
};

export function ResultsView({ result }: { result: AuditResult }) {
  const tone = scoreTone(result.overallScore);

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-16 pt-[calc(env(safe-area-inset-top)+8.25rem)] text-cream sm:pb-24 sm:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(176,141,87,0.16), transparent)",
          }}
        />
        <Container className="relative">
          <RevealOnScroll>
            <div className="mx-auto max-w-2xl text-center">
              <p className="brass-line mx-auto mb-6 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brass">
                Audit Results
              </p>
              <h1 className="text-balance font-display text-3xl font-medium tracking-tight sm:text-5xl">
                {result.lead.businessName}
              </h1>
              <p className="mt-3 text-sm text-cream/50">{result.siteMeta.finalUrl ?? result.siteMeta.requestedUrl}</p>
            </div>

            {result.scanIncomplete ? (
              <div className="mx-auto mt-12 flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-brass/25 bg-cream/5 p-8 text-center">
                <AlertTriangle className="h-8 w-8 text-brass-light" strokeWidth={1.5} />
                <h2 className="font-display text-xl font-medium text-cream">We couldn&apos;t fully scan this site automatically</h2>
                <p className="text-sm leading-relaxed text-cream/60">
                  {result.siteMeta.fetchError ?? "The site didn't respond to our automated scan."} That happens — some
                  sites block automated visits. A real look from our team will still tell you exactly where you stand.
                </p>
              </div>
            ) : (
              <div className="mx-auto mt-12 flex flex-col items-center">
                <div className="relative flex items-center justify-center text-ink">
                  <ScoreRing score={result.overallScore} />
                  <div className="absolute flex flex-col items-center">
                    <span className="font-display text-4xl font-medium text-cream">{result.overallScore}</span>
                    <span className="text-xs text-cream/45">/ 100</span>
                  </div>
                </div>
                <p className="mt-6 max-w-md text-balance text-lg font-medium text-cream/85">{SCORE_HEADLINE[tone]}</p>
              </div>
            )}
          </RevealOnScroll>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {result.categories.map((category, i) => (
              <RevealOnScroll key={category.key} delay={i * 60}>
                <CategoryCard category={category} unscored={result.scanIncomplete} />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-ink py-20 text-center text-cream sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(176,141,87,0.14), transparent)",
          }}
        />
        <Container className="relative">
          <p className="brass-line mx-auto mb-7 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brass">
            What&apos;s Next
          </p>
          <h2 className="text-balance mx-auto max-w-2xl font-display text-3xl font-medium tracking-tight sm:text-5xl">
            A report tells you what&apos;s wrong. A conversation tells you what to do about it.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-cream/65 sm:text-lg">
            {result.lead.name.split(" ")[0]}, we can walk through these results together and show you exactly what a
            fix would look like — no pressure, no generic pitch.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" variant="cream" size="lg" showArrow data-cta="audit-results-discovery-call">
              Book a Discovery Call
            </Button>
            <Button href="/contact" variant="outline-cream" size="lg" data-cta="audit-results-redesign">
              Request a Website Redesign
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
