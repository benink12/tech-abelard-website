// Overall-score rating bands shown at the top of the results dashboard.
// Deliberately separate from `scoreTone` (components/ui/ScoreRing.tsx),
// which only needs three buckets to pick a ring color — this is the
// five-band label a visitor actually reads.

export type AuditRatingLabel = "Excellent" | "Strong" | "Needs Improvement" | "Weak" | "Critical";

export function ratingForScore(score: number): AuditRatingLabel {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Needs Improvement";
  if (score >= 40) return "Weak";
  return "Critical";
}

export const AUDIT_RATING_DESCRIPTIONS: Record<AuditRatingLabel, string> = {
  Excellent: "Your website is in strong shape across the board — small refinements from here.",
  Strong: "Your website is solid overall, with a handful of worthwhile improvements.",
  "Needs Improvement": "Your website has real opportunity — several fixes could meaningfully help.",
  Weak: "Your website has a number of gaps that are likely costing you visitors and leads.",
  Critical: "Your website has significant gaps across most areas we checked.",
};
