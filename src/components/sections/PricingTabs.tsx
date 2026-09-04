"use client";

import { useState } from "react";
import { websitePackages, seoPackages, carePlans, bundles, pricingDisclaimer } from "@/data/pricing";
import { PricingCard } from "@/components/ui/PricingCard";

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
      <div style={{ display: "flex", gap: "clamp(20px,3vw,36px)", borderBottom: "1px solid var(--rule)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className="hc-eyebrow"
            style={{
              padding: "0 0 14px",
              color: active === tab.id ? "var(--hc-ink)" : undefined,
              borderBottom: active === tab.id ? "2px solid var(--oxblood)" : "2px solid transparent",
              marginBottom: -1,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hc-tiers">
        {activeTab.data.map((tier) => (
          <PricingCard key={tier.name} tier={tier} />
        ))}
      </div>

      <p className="hc-fineprint" style={{ maxWidth: "none" }}>
        {pricingDisclaimer}
      </p>
    </div>
  );
}

export function BundlesGrid() {
  return (
    <div>
      <div className="hc-bundles">
        {bundles.map((bundle) => (
          <div key={bundle.name} className="hc-bundle">
            <p className="hc-eyebrow">{bundle.name}{bundle.featured ? " · Most Popular" : ""}</p>
            <h4>{bundle.name}</h4>
            <p>{bundle.bestFor}</p>
            <div className="hc-bundle__price">
              {bundle.price} <s>{bundle.standaloneValue}</s>
            </div>
            <div className="hc-bundle__save">{bundle.savings}</div>
            <ul>
              {bundle.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="hc-fineprint" style={{ maxWidth: "none" }}>
        {pricingDisclaimer}
      </p>
    </div>
  );
}
