import "server-only";
import { randomUUID } from "crypto";
import { fetchSiteSignals } from "./checks";
import { CATEGORY_SCORERS, priorityFromScore } from "./score";
import { CATEGORY_NARRATORS } from "./narrate";
import { buildTopOpportunities } from "./opportunities";
import { ratingForScore } from "./rating";
import { AUDIT_CATEGORY_LABELS, AUDIT_CATEGORY_ORDER, type AuditLead, type AuditResult, type AuditCategoryResult } from "./types";

// The one entry point the rest of the app calls: give it a lead, get back a
// full AuditResult. Everything upstream (the form) and downstream (the
// results page) only ever talks to this function and the AuditResult type —
// swapping the scoring/narrative internals later (e.g. adding a real LLM
// pass in narrate.ts, or a headless-browser check in checks.ts) needs no
// change here or in the UI.
export async function runAudit(lead: AuditLead): Promise<AuditResult> {
  const requestedAt = new Date().toISOString();
  const signals = await fetchSiteSignals(lead.websiteUrl);

  if (!signals.fetchOk) {
    const categories: AuditCategoryResult[] = AUDIT_CATEGORY_ORDER.map((key) => ({
      key,
      label: AUDIT_CATEGORY_LABELS[key],
      score: 50,
      summary:
        "We couldn't automatically reach this site to scan it — it may be blocking automated visits, or the address may need a second look. This category hasn't been scored.",
      strengths: [],
      problems: [],
      priority: "Medium",
    }));

    return {
      id: randomUUID(),
      lead,
      requestedAt,
      completedAt: new Date().toISOString(),
      overallScore: 50,
      overallRating: ratingForScore(50),
      scanIncomplete: true,
      categories,
      topOpportunities: [],
      siteMeta: {
        requestedUrl: lead.websiteUrl,
        finalUrl: signals.finalUrl,
        fetchOk: false,
        fetchError: signals.fetchError,
        httpStatus: signals.httpStatus,
        title: null,
      },
    };
  }

  const categories: AuditCategoryResult[] = AUDIT_CATEGORY_ORDER.map((key) => {
    const score = CATEGORY_SCORERS[key](signals);
    const narrative = CATEGORY_NARRATORS[key](signals, score);
    return {
      key,
      label: AUDIT_CATEGORY_LABELS[key],
      score,
      summary: narrative.summary,
      strengths: narrative.strengths,
      problems: narrative.problems,
      priority: priorityFromScore(score),
    };
  });

  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  return {
    id: randomUUID(),
    lead,
    requestedAt,
    completedAt: new Date().toISOString(),
    overallScore,
    overallRating: ratingForScore(overallScore),
    scanIncomplete: false,
    categories,
    topOpportunities: buildTopOpportunities(categories),
    siteMeta: {
      requestedUrl: lead.websiteUrl,
      finalUrl: signals.finalUrl,
      fetchOk: true,
      fetchError: null,
      httpStatus: signals.httpStatus,
      title: signals.title,
    },
  };
}
