import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "brass" | "ink" | "cream" | "neutral";

const toneClasses: Record<Tone, string> = {
  brass: "hc-badge--accent",
  ink: "hc-badge--ink",
  cream: "hc-badge--cream",
  neutral: "",
};

export function Badge({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return <span className={cn("hc-badge", toneClasses[tone], className)}>{children}</span>;
}
