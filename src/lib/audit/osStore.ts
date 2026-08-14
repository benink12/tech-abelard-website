import "server-only";
import type { AuditResult } from "./types";

// Persists instant-audit results to Tech Abélard OS — the extension point
// documented in store.ts, now wired up. Same shared-secret pattern as
// src/lib/portfolioAccess/osClient.ts: this repo has no database of its
// own, every write forwards server-side to OS's internal API, and the
// shared key never reaches the browser.

function osApiBaseUrl(): string {
  return process.env.OS_API_BASE_URL ?? "http://localhost:3010";
}

function internalKey(): string {
  const key = process.env.PORTFOLIO_ACCESS_INTERNAL_KEY;
  if (!key) throw new Error("PORTFOLIO_ACCESS_INTERNAL_KEY is not set.");
  return key;
}

export async function saveAuditResultToOs(result: AuditResult): Promise<boolean> {
  try {
    const res = await fetch(`${osApiBaseUrl()}/api/audit-results`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-portfolio-access-key": internalKey() },
      body: JSON.stringify({
        id: result.id,
        businessName: result.lead.businessName,
        websiteUrl: result.lead.websiteUrl,
        industry: result.lead.industry,
        contactName: result.lead.name,
        email: result.lead.email,
        phone: result.lead.phone,
        requestedAt: result.requestedAt,
        completedAt: result.completedAt,
        overallScore: result.overallScore,
        overallRating: result.overallRating,
        scanIncomplete: result.scanIncomplete,
        categories: result.categories,
        topOpportunities: result.topOpportunities,
        siteMeta: result.siteMeta,
      }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getAuditResultFromOs(id: string): Promise<AuditResult | null> {
  try {
    const res = await fetch(`${osApiBaseUrl()}/api/audit-results/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { "x-portfolio-access-key": internalKey() },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    if (!data) return null;

    return {
      id: data.id as string,
      lead: {
        businessName: data.businessName as string,
        websiteUrl: data.websiteUrl as string,
        industry: data.industry as AuditResult["lead"]["industry"],
        name: data.contactName as string,
        email: data.email as string,
        phone: (data.phone as string | null) ?? null,
      },
      requestedAt: data.requestedAt as string,
      completedAt: data.completedAt as string,
      overallScore: data.overallScore as number,
      overallRating: data.overallRating as AuditResult["overallRating"],
      scanIncomplete: Boolean(data.scanIncomplete),
      categories: data.categories as AuditResult["categories"],
      topOpportunities: data.topOpportunities as AuditResult["topOpportunities"],
      siteMeta: data.siteMeta as AuditResult["siteMeta"],
    };
  } catch {
    return null;
  }
}
