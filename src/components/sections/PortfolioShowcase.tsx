"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { portfolioProjects } from "@/data/portfolio";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { cn } from "@/lib/utils";

export function PortfolioShowcase({
  className,
  featuredSlugs,
}: {
  className?: string;
  /** Show only these projects, in this order (e.g. the homepage's curated 3). Omit to show every project — the full /portfolio grid. */
  featuredSlugs?: string[];
}) {
  const projects = featuredSlugs
    ? featuredSlugs
        .map((slug) => portfolioProjects.find((p) => p.slug === slug))
        .filter((p): p is (typeof portfolioProjects)[number] => Boolean(p))
    : portfolioProjects;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
    if (!scroller || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const index = cards.indexOf(mostVisible.target as HTMLDivElement);
        if (index !== -1) setActive(index);
      },
      { root: scroller, threshold: [0.5, 0.75, 1] }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    const card = cardRefs.current[index];
    if (!scroller || !card) return;

    const paddingLeft = parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
    const target = Math.max(0, card.offsetLeft - paddingLeft);
    const start = scroller.scrollLeft;
    const distance = target - start;

    if (distance === 0) return;

    // Native scrollTo({behavior:"smooth"}) is unreliable together with
    // scroll-snap-type: mandatory — some engines settle back to the nearest
    // snap point instead of animating to the requested one. Animate
    // scrollLeft directly instead; the browser still snap-corrects the
    // final position, but the motion itself no longer depends on native
    // smooth-scroll support.
    const duration = 350;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      scroller.scrollLeft = start + distance * eased;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  return (
    <div className={className}>
      {/* Desktop: three-column grid (wraps to a second row when showing all 6 on /portfolio) */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
        {projects.map((project, i) => (
          <RevealOnScroll key={project.slug} delay={i * 80}>
            <PortfolioCard project={project} />
          </RevealOnScroll>
        ))}
      </div>

      {/* Mobile: horizontal swipe carousel */}
      <div className="mb-[calc(4.8125rem+env(safe-area-inset-bottom)+1rem)] lg:hidden">
        <div
          ref={scrollerRef}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 sm:-mx-8 sm:px-8"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {projects.map((project, i) => (
            <div
              key={project.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="[flex:0_0_88vw] snap-start"
            >
              <PortfolioCard project={project} />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Previous project"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/12 text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:border-brass-ink/40 enabled:hover:text-brass-ink"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {projects.map((project, i) => (
              <span
                key={project.slug}
                aria-hidden
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-5 bg-brass" : "w-1.5 bg-ink/15"
                )}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next project"
            disabled={active === projects.length - 1}
            onClick={() => goTo(active + 1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/12 text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:border-brass-ink/40 enabled:hover:text-brass-ink"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
