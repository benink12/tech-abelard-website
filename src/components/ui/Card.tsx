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
      className={cn("hc-flatcard", className)}
      style={tone === "ink" ? { borderTopColor: "var(--rule-inv)" } : undefined}
    >
      {children}
    </div>
  );
}
