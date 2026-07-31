import { processSteps } from "@/data/process";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

export function ProcessTimeline({ full = false }: { full?: boolean }) {
  return (
    <div className="relative">
      <div className="absolute left-[27px] top-2 hidden h-[calc(100%-2rem)] w-px bg-ink/10 sm:block" />
      <div className="flex flex-col gap-10">
        {processSteps.map((step, i) => (
          <RevealOnScroll key={step.number} delay={i * 70}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[56px_1fr] sm:gap-6">
              <div className="relative hidden h-14 w-14 items-center justify-center rounded-full border border-brass-ink/30 bg-cream font-display text-lg font-medium text-brass-ink sm:flex">
                {step.number}
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">{step.name}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wide text-brass-ink">{step.duration}</span>
                </div>
                <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/60 sm:text-base">
                  {step.description}
                </p>
                {full && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className={cn(
                          "rounded-full border border-ink/10 bg-cream-card px-3 py-1 text-xs text-ink/60"
                        )}
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
