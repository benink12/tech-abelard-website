import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  tone = "cream",
}: {
  children: ReactNode;
  className?: string;
  tone?: "cream" | "ink";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1",
        tone === "cream"
          ? "border-ink/8 bg-cream-card hover:border-brass/30 hover:shadow-lg hover:shadow-ink/[0.06]"
          : "border-cream/10 bg-ink-soft hover:border-brass/30 hover:shadow-lg hover:shadow-black/20",
        className
      )}
    >
      {children}
    </div>
  );
}
