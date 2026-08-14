import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PortfolioProject } from "@/data/portfolio";

// Only rendered for projects with real captured screenshots
// (project.screenshots) — the original three projects have no interactive
// demo deployed publicly, so this section simply doesn't render for them
// (see DeviceMockup's abstract fallback instead).
export function ProjectGallery({ project }: { project: PortfolioProject }) {
  const shots = project.screenshots;
  if (!shots) return null;

  // First desktop shot is already used as the page hero above — the
  // gallery shows what's left so nothing repeats.
  const remainingDesktop = shots.desktop.slice(1);

  return (
    <section className="border-t border-ink/8 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Project Gallery" title="More of the experience" description="Real screens captured from the working build — not mockups." />

        {remainingDesktop.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {remainingDesktop.map((shot) => (
              <figure key={shot.src} className="overflow-hidden rounded-2xl border border-ink/8 bg-cream-card">
                <div className="relative aspect-[4/3] w-full">
                  <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 640px) 45vw, 90vw" className="object-cover object-top" />
                </div>
                {shot.caption && (
                  <figcaption className="border-t border-ink/8 px-4 py-2.5 text-xs font-medium text-ink/55">{shot.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        {shots.mobile.length > 0 && (
          <div className="mt-16">
            <h3 className="font-display text-lg font-medium text-ink">Mobile experience</h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink/60">
              Designed mobile-first and verified on a real device viewport before desktop, not adapted afterward.
            </p>
            <div className="no-scrollbar mt-7 flex gap-5 overflow-x-auto pb-2">
              {shots.mobile.map((shot) => (
                <figure key={shot.src} className="flex shrink-0 flex-col items-center gap-3">
                  <div className="relative h-[360px] w-[180px] overflow-hidden rounded-[1.75rem] border-[6px] border-ink bg-ink shadow-lg">
                    <div className="absolute left-1/2 top-0 z-10 h-4 w-20 -translate-x-1/2 rounded-b-lg bg-ink" />
                    <Image src={shot.src} alt={shot.alt} fill sizes="180px" className="object-cover object-top" />
                  </div>
                  {shot.caption && <figcaption className="text-xs font-medium text-ink/55">{shot.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
