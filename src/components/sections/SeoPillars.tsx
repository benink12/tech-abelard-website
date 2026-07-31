import { seoPillars } from "@/data/seo";
import { iconMap } from "@/lib/icons";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function SeoPillars({ full = false }: { full?: boolean }) {
  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", full && "lg:grid-cols-3")}>
      {seoPillars.map((pillar, i) => {
        const Icon = iconMap[pillar.icon];
        return (
          <RevealOnScroll key={pillar.name} delay={i * 60}>
            <Card className="h-full">
              <Icon className="h-6 w-6 text-brass-ink" strokeWidth={1.6} />
              <h3 className="mt-5 font-display text-xl font-medium text-ink">{pillar.name}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/60">{pillar.description}</p>
              {full && (
                <ul className="mt-4 flex flex-col gap-2 border-t border-ink/8 pt-4">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs text-ink/55">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </RevealOnScroll>
        );
      })}
    </div>
  );
}
