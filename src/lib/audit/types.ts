// Shared shape for the instant AI audit — this is the single source of truth
// that the landing form, the analyzing UI, the results page, and (later) a
// branded PDF renderer or an automated-email/CRM sync can all read from
// without touching how a result is produced. See src/lib/audit/engine.ts for
// how a result is built, and src/lib/audit/store.ts for how it's persisted.

import type { AuditIndustry } from "./validation";
import type { AuditRatingLabel } from "./rating";

export type AuditCategoryKey =
  | "technicalHealth"
  | "performance"
  | "mobile"
  | "seo"
  | "localSeo"
  | "accessibility"
  | "trust"
  | "conversion";

/** Category-level severity, driven by score. Used for the priority badge on each report card. */
export type AuditPriority = "Critical" | "High" | "Medium" | "Low";

/** How much fixing an issue is likely to help — a directional signal, never a fabricated revenue number. */
export type AuditImpact = "High" | "Medium" | "Low";

export interface AuditCategoryIssue {
  /** Stable slug, e.g. "seo-missing-title" — lets the same issue be de-duplicated/ranked across categories. */
  id: string;
  /** Client-friendly description of the problem. No jargon. */
  issue: string;
  /** Why a non-technical business owner should care. */
  whyItMatters: string;
  /** Plain-language recommended fix. */
  recommendedFix: string;
  /** Optional technical layer, shown behind an expandable disclosure — for the visitor who wants specifics. */
  technicalDetail?: string;
  /** Drives ranking into the cross-category "Top Opportunities" list. */
  severity: "critical" | "high" | "medium" | "low";
}

export interface AuditCategoryResult {
  key: AuditCategoryKey;
  label: string;
  score: number; // 0-100
  summary: string;
  strengths: string[];
  problems: AuditCategoryIssue[];
  priority: AuditPriority;
}

/** A single "Top Opportunities" card — the 3-5 highest-impact findings pulled across all categories. */
export interface AuditFinding {
  id: string;
  category: AuditCategoryKey;
  categoryLabel: string;
  title: string;
  whyItMatters: string;
  recommendedFix: string;
  technicalDetail?: string;
  estimatedImpact: AuditImpact;
  priority: AuditPriority;
}

export interface AuditLead {
  businessName: string;
  websiteUrl: string;
  industry: AuditIndustry;
  name: string;
  email: string;
  phone: string | null;
}

export interface AuditSiteMeta {
  requestedUrl: string;
  finalUrl: string | null;
  fetchOk: boolean;
  fetchError: string | null;
  httpStatus: number | null;
  title: string | null;
}

export interface AuditResult {
  id: string;
  lead: AuditLead;
  requestedAt: string; // ISO 8601
  completedAt: string; // ISO 8601 — shown as the "audit date"
  overallScore: number; // 0-100
  overallRating: AuditRatingLabel;
  /** True when the automated scan couldn't reach the site — scores are placeholders, not a real read. */
  scanIncomplete: boolean;
  categories: AuditCategoryResult[];
  topOpportunities: AuditFinding[];
  siteMeta: AuditSiteMeta;
}

export const AUDIT_CATEGORY_LABELS: Record<AuditCategoryKey, string> = {
  technicalHealth: "Technical Health",
  performance: "Performance",
  mobile: "Mobile Experience",
  seo: "SEO",
  localSeo: "Local SEO",
  accessibility: "Accessibility",
  trust: "Trust & Credibility",
  conversion: "Conversion Opportunity",
};

export const AUDIT_CATEGORY_ORDER: AuditCategoryKey[] = [
  "technicalHealth",
  "performance",
  "mobile",
  "seo",
  "localSeo",
  "accessibility",
  "trust",
  "conversion",
];
