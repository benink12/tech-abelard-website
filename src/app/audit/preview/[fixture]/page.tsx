import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MOCK_AUDIT_FIXTURES, type MockAuditFixtureKey } from "@/lib/audit/mock-data/fixtures";
import { ResultsView } from "@/components/sections/audit/ResultsView";

// Dev-only QA route: renders the results dashboard against the mock
// fixtures (src/lib/audit/mock-data/fixtures.ts) instead of a live scan, so
// the report UI can be reviewed at every score band without waiting on a
// real outbound fetch. Disabled outside development — never linked from
// anywhere in the live site.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AuditPreviewPage({ params }: { params: Promise<{ fixture: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();

  const { fixture } = await params;
  const result = MOCK_AUDIT_FIXTURES[fixture as MockAuditFixtureKey];
  if (!result) notFound();

  return <ResultsView result={result} />;
}
