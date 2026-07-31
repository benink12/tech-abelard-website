import { cn } from "@/lib/utils";

export function Logo({ tone = "ink", className }: { tone?: "ink" | "cream"; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M4 7h13M10.5 7v18"
          stroke="var(--color-brass)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M15 25 22 7l7 18M17.2 19h9.6"
          stroke="var(--color-brass)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          "font-display text-lg font-medium tracking-tight",
          tone === "ink" ? "text-ink" : "text-cream"
        )}
      >
        Tech Abélard
      </span>
    </span>
  );
}
