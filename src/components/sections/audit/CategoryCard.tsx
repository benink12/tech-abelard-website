import { CheckCircle2, ArrowUpCircle, ChevronDown } from "lucide-react";
import { iconMap } from "@/lib/icons";
import { scoreTone } from "@/components/ui/ScoreRing";
import { cn } from "@/lib/utils";
import type { AuditCategoryResult } from "@/lib/audit/types";

const CATEGORY_ICON: Record<AuditCategoryResult["key"], keyof typeof iconMap> = {
  technicalHealth: "server-cog",
  performance: "gauge",
  mobile: "smartphone",
  seo: "search",
  localSeo: "map-pin",
  accessibility: "accessibility",
  trust: "shield-check",
  conversion: "mouse-pointer-click",
};

/* No red/gold/green tone-coding — severity reads through ink weight
   instead of hue. Poor scores stay full-strength (need attention); good
   ones fade toward the background (already fine). */
const TONE_CLASSES: Record<ReturnType<typeof scoreTone>, { bar: string; text: string }> = {
  good: { bar: "bg-ink/35", text: "text-ink/45" },
  fair: { bar: "bg-ink/65", text: "text-ink/75" },
  poor: { bar: "bg-ink", text: "text-ink" },
};

const PRIORITY_CLASSES: Record<AuditCategoryResult["priority"], string> = {
  Critical: "border-ink bg-ink text-cream",
  High: "border-ink bg-ink/10 text-ink",
  Medium: "border-ink/40 bg-ink/5 text-ink/70",
  Low: "border-ink/20 bg-transparent text-ink/45",
};

export function CategoryCard({ category, unscored = false }: { category: AuditCategoryResult; unscored?: boolean }) {
  const Icon = iconMap[CATEGORY_ICON[category.key]];
  const tone = TONE_CLASSES[scoreTone(category.score)];

  return (
    <div className="rounded-2xl border border-ink/8 bg-cream-card p-7 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/8">
            <Icon className="h-5 w-5 text-ink" strokeWidth={1.75} />
          </span>
          <h3 className="font-display text-lg font-medium text-ink">{category.label}</h3>
        </div>
        {!unscored && (
          <span className={cn("shrink-0 font-display text-2xl font-medium", tone.text)}>{category.score}</span>
        )}
      </div>

      {!unscored && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
          <div className={cn("h-full rounded-full", tone.bar)} style={{ width: `${category.score}%` }} />
        </div>
      )}

      <p className="mt-5 text-sm leading-relaxed text-ink/65">{category.summary}</p>

      {category.strengths.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Strengths</p>
          <ul className="mt-2.5 space-y-2">
            {category.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink/70">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ink/45" strokeWidth={1.75} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {category.problems.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Problems &amp; Recommended Actions</p>
            {!unscored && (
              <span className={cn("shrink-0 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide", PRIORITY_CLASSES[category.priority])}>
                {category.priority} Priority
              </span>
            )}
          </div>
          <ul className="mt-3 space-y-4">
            {category.problems.map((problem) => (
              <li key={problem.id} className="flex items-start gap-2.5">
                <ArrowUpCircle className="mt-0.5 h-4 w-4 shrink-0 text-ink/70" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-relaxed text-ink/85">{problem.issue}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/65">{problem.recommendedFix}</p>
                  {problem.technicalDetail && (
                    <details className="group mt-1.5">
                      <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-ink/40 transition-colors hover:text-ink/60">
                        <ChevronDown className="h-3 w-3 shrink-0 transition-transform duration-200 group-open:rotate-180" strokeWidth={2} />
                        Technical detail
                      </summary>
                      <p className="mt-1.5 rounded-lg bg-ink/[0.03] px-3 py-2 text-xs leading-relaxed text-ink/55">
                        {problem.technicalDetail}
                      </p>
                    </details>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
