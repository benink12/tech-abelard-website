"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function RevealOnScroll({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // `primed` only ever becomes true from inside a mounted effect — i.e. it is
  // proof JS actually ran. Content stays at the CSS default (fully visible,
  // see .reveal-on-scroll in globals.css) until then, so a hydration failure
  // or a JS error anywhere else on the page can never leave this content
  // stuck invisible.
  const [primed, setPrimed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    setPrimed(true);
    const reveal = () => setVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);

    // Some iOS Safari sessions never fire an intersection callback (fast
    // flicks, throttled callbacks in low-power mode). Never leave content
    // permanently invisible waiting on it.
    const fallback = window.setTimeout(reveal, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal-on-scroll", primed && !visible && "reveal-pending", visible && "is-visible", className)}
      style={visible && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
