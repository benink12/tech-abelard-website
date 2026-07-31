import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  return (
    <As className={cn("mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10", className)}>
      {children}
    </As>
  );
}
