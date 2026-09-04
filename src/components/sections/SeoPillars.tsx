import { seoPillars } from "@/data/seo";
import { iconMap } from "@/lib/icons";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

export function SeoPillars({ full = false }: { full?: boolean }) {
  return (
    <div className={cn("grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2", full && "lg:grid-cols-3")}>
      {seoPillars.map((pillar, i) => {
        const Icon = iconMap[pillar.icon];
        return (
          <RevealOnScroll key={pillar.name} delay={i * 60}>
            <div className="hc-flatcard h-full">
              <Icon className="h-5 w-5" strokeWidth={1.5} style={{ color: "var(--hc-ink)" }} />
              <h3>{pillar.name}</h3>
              <p>{pillar.description}</p>
              {full && (
                <ul style={{ marginTop: 14, borderTop: "1px solid var(--rule)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs" style={{ color: "var(--slate)" }}>
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--slate)" }} />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </RevealOnScroll>
        );
      })}
    </div>
  );
}
