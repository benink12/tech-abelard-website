"use client";

import { useState } from "react";
import { websitePackages, seoPackages, carePlans, bundles, pricingDisclaimer } from "@/data/pricing";
import { PricingCard } from "@/components/ui/PricingCard";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "websites", label: "Websites", data: websitePackages },
  { id: "seo", label: "SEO", data: seoPackages },
  { id: "care", label: "Website Care", data: carePlans },
] as const;

export function PricingTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("websites");
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div className="mx-auto flex w-fit gap-1 rounded-full border border-ink/10 bg-cream-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300",
              active === tab.id ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {activeTab.data.map((tier) => (
          <PricingCard key={tier.name} tier={tier} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-ink/45">{pricingDisclaimer}</p>
    </div>
  );
}

export function BundlesGrid() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <div
            key={bundle.name}
            className={cn(
              "flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1",
              bundle.featured
                ? "border-brass/50 bg-ink text-cream hover:shadow-2xl"
                : "border-ink/8 bg-cream-card hover:border-brass-ink/25 hover:shadow-lg hover:shadow-ink/[0.06]"
            )}
          >
            {bundle.featured && (
              <Badge tone="brass" className="mb-5 w-fit">
                Most Popular
              </Badge>
            )}
            <h3 className={cn("font-display text-2xl font-medium", bundle.featured ? "text-cream" : "text-ink")}>
              {bundle.name}
            </h3>
            <p className={cn("mt-3 text-sm leading-relaxed", bundle.featured ? "text-cream/65" : "text-ink/60")}>
              {bundle.bestFor}
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className={cn("font-display text-3xl font-medium", bundle.featured ? "text-brass-light" : "text-ink")}>
                {bundle.price}
              </span>
              <span className={cn("text-sm line-through", bundle.featured ? "text-cream/40" : "text-ink/35")}>
                {bundle.standaloneValue}
              </span>
            </div>
            <p className={cn("mt-1 text-xs font-semibold", bundle.featured ? "text-brass-light" : "text-brass-ink")}>
              {bundle.savings}
            </p>

            <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-current/10 pt-6">
              {bundle.includes.map((item) => (
                <li key={item} className={cn("text-sm", bundle.featured ? "text-cream/75" : "text-ink/65")}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-ink/45">{pricingDisclaimer}</p>
    </div>
  );
}
