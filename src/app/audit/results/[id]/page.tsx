import type { Metadata } from "next";
import { getAuditResult } from "@/lib/audit/store";
import { homeFontClassName } from "@/lib/fonts/home";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { ResultsView } from "@/components/sections/audit/ResultsView";

export const metadata: Metadata = {
  title: "Your Audit Results",
  robots: { index: false, follow: false },
};

export default async function AuditResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getAuditResult(id);

  if (!result) {
    return (
      <div className={`home-concept ${homeFontClassName}`}>
        <PageHero
          eyebrow="Audit Results"
          title="This report couldn't be found."
          description="This link may be old, mistyped, or the report may no longer exist — request a fresh one below."
        />
        <section className="hc-section" style={{ padding: "clamp(60px,8vw,100px) 0" }}>
          <div className="hc-wrap" style={{ textAlign: "center" }}>
            <Button href="/audit" variant="ink" size="lg" showArrow>
              Run a New Audit
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return <ResultsView result={result} />;
}
