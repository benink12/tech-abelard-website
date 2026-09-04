import { ScanSearch } from "lucide-react";
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
    <section style={{ padding: "clamp(40px,5vw,64px) 0" }}>
      <div className="hc-wrap">
        <div
          className="hc-flatcard"
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: "1 1 320px" }}>
            <ScanSearch className="h-5 w-5" strokeWidth={1.5} style={{ marginTop: 4, color: "var(--hc-ink)", flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: 0 }}>{title}</h3>
              <p style={{ marginTop: 6 }}>{description}</p>
            </div>
          </div>
          <Button href="/audit" variant="outline" size="md" data-cta={ctaId} showArrow>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
