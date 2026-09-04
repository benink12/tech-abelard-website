"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/data/faq";
import { cn } from "@/lib/utils";

// Shared across the homepage FAQ section, the standalone /faq page, and
// every service/SEO-landing page's FAQ block — one accordion, one visual
// language. Only one row open at a time (single `openIndex`, not a Set),
// which is also what keeps the section compact. The + icon rotating 45deg
// into an × is the actual mechanism, not a swapped icon — Plus and X are
// the same glyph 45deg apart, so there's nothing to cross-fade or swap.
export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const idPrefix = useId();

  return (
    <div style={{ borderBottom: "1px solid var(--rule)" }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const buttonId = `${idPrefix}-question-${i}`;
        const panelId = `${idPrefix}-answer-${i}`;
        return (
          <div key={item.question} className={cn("hc-faqacc-row", isOpen && "is-open")}>
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="hc-faqacc-q"
              >
                <span className="hc-faqacc-q__text">{item.question}</span>
                <span className="hc-faqacc-q__icon" aria-hidden="true">
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} aria-hidden={!isOpen} className="hc-faqacc-panel">
              <div className="hc-faqacc-panel__inner">
                <p className="hc-faqacc-answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
