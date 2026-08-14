import type { AuditCategoryIssue, AuditCategoryResult, AuditFinding, AuditImpact, AuditPriority } from "./types";

// Ranks every issue found across all eight categories into the "Top
// Opportunities" list shown at the top of the results dashboard — the 3-5
// highest-impact findings, so a visitor doesn't have to read all eight
// category cards to know what to fix first.

const SEVERITY_RANK: Record<AuditCategoryIssue["severity"], number> = { critical: 0, high: 1, medium: 2, low: 3 };
const IMPACT_FOR_SEVERITY: Record<AuditCategoryIssue["severity"], AuditImpact> = {
  critical: "High",
  high: "High",
  medium: "Medium",
  low: "Low",
};
const PRIORITY_FOR_SEVERITY: Record<AuditCategoryIssue["severity"], AuditPriority> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const MAX_FINDINGS = 5;

export function buildTopOpportunities(categories: AuditCategoryResult[]): AuditFinding[] {
  const allIssues = categories.flatMap((category) => category.problems.map((issue) => ({ category, issue })));

  allIssues.sort((a, b) => {
    const severityDiff = SEVERITY_RANK[a.issue.severity] - SEVERITY_RANK[b.issue.severity];
    if (severityDiff !== 0) return severityDiff;
    return a.category.score - b.category.score; // lower-scoring category first as a tiebreak
  });

  return allIssues.slice(0, Math.min(MAX_FINDINGS, allIssues.length)).map(({ category, issue }) => ({
    id: issue.id,
    category: category.key,
    categoryLabel: category.label,
    title: issue.issue,
    whyItMatters: issue.whyItMatters,
    recommendedFix: issue.recommendedFix,
    technicalDetail: issue.technicalDetail,
    estimatedImpact: IMPACT_FOR_SEVERITY[issue.severity],
    priority: PRIORITY_FOR_SEVERITY[issue.severity],
  }));
}
