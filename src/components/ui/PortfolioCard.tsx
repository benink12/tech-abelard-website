import type { PortfolioProject } from "@/data/portfolio";
import { iconMap } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";

function ActionSlot({
  label,
  href,
}: {
  label: string;
  href?: string;
}) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-ink/12 px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brass-ink/50 hover:text-brass-ink"
      >
        {label}
      </a>
    );
  }
  return (
    <span className="cursor-not-allowed rounded-full border border-ink/8 px-3.5 py-1.5 text-xs font-medium text-ink/35">
      {label} · Soon
    </span>
  );
}

export function PortfolioCard({ project }: { project: PortfolioProject }) {
  const Icon = iconMap[project.icon];

  return (
    <div className="group overflow-hidden rounded-2xl border border-ink/8 bg-cream-card transition-all duration-300 hover:-translate-y-1 hover:border-brass/30 hover:shadow-lg hover:shadow-ink/[0.08]">
      <div
        className="relative flex h-52 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(140deg, ${project.accent} 0%, #1c2230 130%)` }}
      >
        <div
          aria-hidden
          className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-110"
          style={{ background: "radial-gradient(circle, #b08d57, transparent 70%)" }}
        />
        <Icon className="h-12 w-12 text-cream/90" strokeWidth={1.3} />
        <Badge tone="cream" className="absolute left-4 top-4">
          {project.niche}
        </Badge>
      </div>

      <div className="p-7">
        <h3 className="font-display text-xl font-medium text-ink">{project.name}</h3>
        <p className="mt-1.5 text-sm font-medium text-brass-ink">{project.tagline}</p>
        <p className="mt-3.5 text-sm leading-relaxed text-ink/60">{project.description}</p>

        <ul className="mt-5 flex flex-col gap-1.5">
          {project.highlights.map((point) => (
            <li key={point} className="flex items-start gap-2 text-xs text-ink/55">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-ink/8 pt-5">
          <ActionSlot label="Live Demo" href={project.liveUrl} />
          <ActionSlot label="Case Study" href={project.caseStudyUrl} />
          <ActionSlot label="Before / After" href={project.beforeAfterUrl} />
        </div>
      </div>
    </div>
  );
}
