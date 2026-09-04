"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Same masked slide-up technique as the hero headline's .hc-line-mask (see
// src/styles/home.css), but IntersectionObserver-triggered instead of
// playing once on page load — for major section headlines that scroll INTO
// view well after first paint. TinyWins reserves this "text emerges from
// behind a hard edge" treatment specifically for its big statement
// headlines (confirmed by inspecting their DOM — duplicated text nodes
// driving a clip/mask reveal), never for body copy, which is why this is a
// separate component from RevealOnScroll's plain fade-up rather than a
// variant applied everywhere.
export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
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

    // Same iOS Safari safety net as RevealOnScroll — never leave content
    // permanently masked-out waiting on a callback that might not fire.
    const fallback = window.setTimeout(reveal, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <span
      ref={ref}
      className={cn("hc-mask-reveal", primed && !visible && "is-pending", className)}
    >
      <span
        className={cn("hc-mask-reveal__inner", visible && "is-visible")}
        style={visible && delay ? { animationDelay: `${delay}ms` } : undefined}
      >
        {children}
      </span>
    </span>
  );
}
