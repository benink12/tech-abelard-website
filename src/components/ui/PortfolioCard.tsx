import Image from "next/image";
import Link from "next/link";
import { nicheInProse, type PortfolioProject } from "@/data/portfolio";
import { iconMap } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";

// A representative desktop+mobile device mockup. For projects with real
// captured screenshots (project.screenshots), the same browser-chrome +
// phone-outline composition below is filled with the actual first desktop
// and mobile screenshots instead of the icon — sized and cropped per
// project.preview (see PortfolioPreviewConfig; every field defaults, so
// most projects never need to set this at all). For projects with no
// screenshots — no interactive demo is deployed publicly (see /showcase,
// gated behind Request Live Access), so there is nothing real to
// screenshot — it falls back to the icon-only abstract version, built from
// the card's accent gradient.
export function DeviceMockup({ project }: { project: PortfolioProject }) {
  const Icon = iconMap[project.icon];
  const desktopShot = project.screenshots?.desktop[0];
  const mobileShot = project.screenshots?.mobile[0];
  const preview = project.preview;
  const layout = preview?.layout ?? "desktop-phone";
  const desktopFit = preview?.desktopFit ?? "cover";
  const desktopPosition = preview?.desktopPosition ?? "top";
  const mobilePosition = preview?.mobilePosition ?? "top";
  const showPhone = layout === "desktop-phone" && Boolean(mobileShot);

  return (
    <div
      className="relative flex h-64 items-center justify-center overflow-hidden p-4 sm:h-72 sm:p-5"
      style={{ background: `linear-gradient(140deg, ${project.accent} 0%, #1c2230 130%)` }}
    >
      <div
        aria-hidden
        className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-110"
        style={{ background: "radial-gradient(circle, #b08d57, transparent 70%)" }}
      />

      {/* Desktop frame — sized close to captured screenshots' real aspect ratio (~2:1) so "cover" rarely has much to crop */}
      <div className="relative flex aspect-[2/1] w-full max-w-[420px] flex-col overflow-hidden rounded-lg border border-cream/20 bg-black/10 shadow-lg backdrop-blur-sm">
        <div className="flex shrink-0 items-center gap-1 border-b border-cream/10 bg-black/10 px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cream/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-cream/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-cream/30" />
        </div>
        {desktopShot ? (
          <div className={desktopFit === "contain" ? "relative flex-1 bg-black/20" : "relative flex-1"}>
            <Image
              src={desktopShot.src}
              alt={desktopShot.alt}
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              className={desktopFit === "contain" ? "object-contain" : "object-cover"}
              style={{ objectPosition: desktopPosition }}
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <Icon className="h-9 w-9 text-cream/80" strokeWidth={1.3} />
          </div>
        )}
      </div>

      {/* Phone frame, overlapping bottom-right of the desktop frame */}
      {layout === "desktop-phone" && (
        <div className="absolute bottom-4 right-[10%] flex h-32 w-[4.5rem] flex-col overflow-hidden rounded-xl border border-cream/25 bg-black/20 shadow-lg backdrop-blur-sm sm:h-36 sm:w-20">
          <div className="mx-auto mt-1.5 h-1 w-5 shrink-0 rounded-full bg-cream/30" />
          {showPhone && mobileShot ? (
            <div className="relative flex-1">
              <Image
                src={mobileShot.src}
                alt={mobileShot.alt}
                fill
                sizes="80px"
                className="object-cover"
                style={{ objectPosition: mobilePosition }}
              />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <Icon className="h-4 w-4 text-cream/70" strokeWidth={1.3} />
            </div>
          )}
        </div>
      )}

      <Badge tone="cream" className="absolute left-4 top-4">
        {project.niche}
      </Badge>
    </div>
  );
}

export function PortfolioCard({ project }: { project: PortfolioProject }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-cream-card transition-all duration-300 hover:-translate-y-1 hover:border-brass/30 hover:shadow-lg hover:shadow-ink/[0.08]">
      <DeviceMockup project={project} />

      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-xl font-medium text-ink">{project.name}</h3>
        <p className="mt-1.5 text-sm font-medium text-brass-ink">{project.tagline}</p>
        <p className="mt-3.5 text-sm leading-relaxed text-ink/60">{project.description}</p>

        <ul className="mt-5 flex flex-col gap-1.5">
          {project.highlights.slice(0, 4).map((point) => (
            <li key={point} className="flex items-start gap-2 text-xs text-ink/55">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.servicesDemonstrated.map((service) => (
            <Badge key={service} tone="neutral" className="text-[10px]">
              {service}
            </Badge>
          ))}
        </div>

        <p className="mt-5 hidden rounded-lg border border-ink/8 bg-cream px-3 py-2.5 text-[11px] leading-relaxed text-ink/50 lg:block">
          <span className="font-semibold text-ink/65">Concept Project</span> — Created to demonstrate Tech Abélard&apos;s
          capabilities for {nicheInProse(project.niche)} businesses.
        </p>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-ink/8 pt-5">
          <Link
            href={`/portfolio/${project.slug}`}
            className="rounded-full border border-ink/12 px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brass-ink/50 hover:text-brass-ink"
          >
            View Case Study
          </Link>
          <Link
            href={`/portfolio/${project.slug}#request-access`}
            className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-cream transition-colors hover:bg-ink/85"
          >
            Request Live Access
          </Link>
        </div>
      </div>
    </div>
  );
}
