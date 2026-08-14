import type { AuditCategoryKey, AuditPriority } from "./types";
import type { SiteSignals } from "./checks";

// Deterministic, signal-grounded scoring — every deduction below traces to
// a concrete thing this audit actually measured on the fetched page. No
// number here is invented or randomized; that's a deliberate match to the
// "no fabricated findings" promise made on /audit. Categories with a
// real accuracy ceiling (Local SEO's Google Business Profile signals,
// Accessibility's color contrast and keyboard navigation, Performance's real
// Core Web Vitals) lean on structural proxies only, and narrate.ts says so
// explicitly in those categories' summaries — nothing here scores a signal
// this repo doesn't actually measure.

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function deduct(score: number, amount: number): number {
  return score - amount;
}

export function scoreTechnicalHealth(s: SiteSignals): number {
  let score = 100;
  if (!s.isHttps) score = deduct(score, 15);
  if (s.robotsTxtPresent === false) score = deduct(score, 12);
  if (s.sitemapPresent === false) score = deduct(score, 12);
  if (!s.canonicalPresent) score = deduct(score, 12);
  if (s.structuredDataCount === 0) score = deduct(score, 15);
  if (!s.charsetPresent) score = deduct(score, 8);
  if (!s.langPresent) score = deduct(score, 8);
  if (!s.faviconPresent) score = deduct(score, 8);
  return clampScore(score);
}

export function scorePerformance(s: SiteSignals): number {
  let score = 100;
  const weightMb = (s.pageWeightBytes ?? 0) / (1024 * 1024);
  if (weightMb > 3) score = deduct(score, 25);
  else if (weightMb > 1.5) score = deduct(score, 12);

  const time = s.responseTimeMs ?? 0;
  if (time > 3000) score = deduct(score, 20);
  else if (time > 1500) score = deduct(score, 10);

  if (s.scriptCount > 15) score = deduct(score, 10);
  else if (s.scriptCount > 8) score = deduct(score, 5);

  if (s.stylesheetCount > 8) score = deduct(score, 5);
  return clampScore(score);
}

export function scoreMobile(s: SiteSignals): number {
  let score = 100;
  if (!s.viewportPresent) score = deduct(score, 45);
  else if (!/width\s*=\s*device-width/i.test(s.viewportContent ?? "")) score = deduct(score, 18);

  if (s.imageCount > 0 && s.imagesMissingAlt / s.imageCount > 0.5) score = deduct(score, 10);
  if (!s.faviconPresent) score = deduct(score, 5);
  const weightMb = (s.pageWeightBytes ?? 0) / (1024 * 1024);
  if (weightMb > 3) score = deduct(score, 15);
  return clampScore(score);
}

export function scoreSeo(s: SiteSignals): number {
  let score = 100;
  if (!s.title) score = deduct(score, 25);
  else if (s.titleLength < 10) score = deduct(score, 10);
  else if (s.titleLength > 60) score = deduct(score, 6);

  if (!s.metaDescription) score = deduct(score, 20);
  else if (s.metaDescriptionLength < 50 || s.metaDescriptionLength > 160) score = deduct(score, 8);

  if (s.h1Count === 0) score = deduct(score, 15);
  else if (s.h1Count > 1) score = deduct(score, 5);

  if (!s.headingHierarchyOk) score = deduct(score, 8);
  if (s.internalLinkCount === 0) score = deduct(score, 8);
  return clampScore(score);
}

export function scoreLocalSeo(s: SiteSignals): number {
  let score = 100;
  if (!s.hasNapPhoneSignal) score = deduct(score, 22);
  if (!s.hasAddressSignal) score = deduct(score, 20);
  if (!s.hasServiceAreaSignal) score = deduct(score, 15);
  if (!s.localBusinessSchemaPresent) score = deduct(score, 18);
  if (!s.telLinkPresent) score = deduct(score, 10);
  return clampScore(score);
}

export function scoreAccessibility(s: SiteSignals): number {
  let score = 100;
  if (s.imageCount > 0) {
    const missingRatio = s.imagesMissingAlt / s.imageCount;
    if (missingRatio > 0.5) score = deduct(score, 22);
    else if (missingRatio > 0) score = deduct(score, 10);
  }
  if (!s.langPresent) score = deduct(score, 15);
  if (!s.headingHierarchyOk) score = deduct(score, 15);
  if (s.formInputCount > 0) {
    const labeledRatio = s.formLabeledInputCount / s.formInputCount;
    if (labeledRatio < 0.5) score = deduct(score, 20);
    else if (labeledRatio < 1) score = deduct(score, 8);
  }
  if (!s.viewportPresent) score = deduct(score, 10);
  return clampScore(score);
}

export function scoreTrust(s: SiteSignals): number {
  let score = 100;
  if (!s.isHttps) score = deduct(score, 25);
  if (!s.telLinkPresent && !s.mailtoLinkPresent) score = deduct(score, 15);
  if (!s.hasPrivacyPolicyLink) score = deduct(score, 15);
  if (!s.hasTermsLink) score = deduct(score, 8);
  if (!s.hasTestimonialSignal) score = deduct(score, 17);
  if (s.imageCount === 0) score = deduct(score, 10);
  return clampScore(score);
}

export function scoreConversion(s: SiteSignals): number {
  let score = 100;
  if (s.formCount === 0) score = deduct(score, 25);
  if (!s.telLinkPresent) score = deduct(score, 25);
  if (!s.hasCallToActionSignal) score = deduct(score, 25);
  if (s.formCount === 0 && !s.telLinkPresent) score = deduct(score, 10); // no conversion path at all
  return clampScore(score);
}

export const CATEGORY_SCORERS: Record<AuditCategoryKey, (s: SiteSignals) => number> = {
  technicalHealth: scoreTechnicalHealth,
  performance: scorePerformance,
  mobile: scoreMobile,
  seo: scoreSeo,
  localSeo: scoreLocalSeo,
  accessibility: scoreAccessibility,
  trust: scoreTrust,
  conversion: scoreConversion,
};

export function priorityFromScore(score: number): AuditPriority {
  if (score < 40) return "Critical";
  if (score < 60) return "High";
  if (score < 80) return "Medium";
  return "Low";
}
