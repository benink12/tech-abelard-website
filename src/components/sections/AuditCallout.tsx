import { ScanSearch } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function AuditCallout({
  ctaId,
  title = "Not sure where to start?",
  description = "Request a free, honest website audit — SEO, mobile experience, performance, trust signals, and lead-generation opportunities, no obligation.",
  ctaLabel = "Get a Free Website Audit",
}: {
  ctaId: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl border border-brass/25 bg-cream-card p-8 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink/5">
            <ScanSearch className="h-5 w-5 text-brass-ink" strokeWidth={1.7} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-medium text-ink">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{description}</p>
          </div>
          <Button href="/free-audit" variant="outline" size="md" data-cta={ctaId} className="shrink-0" showArrow>
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
