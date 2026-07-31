import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "brass" | "ink" | "cream" | "neutral";

const toneClasses: Record<Tone, string> = {
  brass: "bg-brass/10 text-brass border border-brass/25",
  ink: "bg-ink text-cream border border-ink",
  cream: "bg-cream/10 text-cream border border-cream/25",
  neutral: "bg-neutral/10 text-neutral border border-neutral/25",
};

export function Badge({
  children,
  tone = "brass",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em]",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
