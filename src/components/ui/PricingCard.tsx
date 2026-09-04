import type { PricingTier } from "@/data/pricing";
import { Button } from "@/components/ui/Button";

export function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div className={`hc-tier${tier.featured ? " hc-tier--pop" : ""}`}>
      <span className="hc-tier__flag">{tier.featured ? "Most Popular" : ""}</span>
      <h3 className="hc-tier__name">{tier.name}</h3>
      <p className="hc-tier__for">{tier.bestFor}</p>
      <span className="hc-tier__was" style={!tier.previousPrice ? { visibility: "hidden" } : undefined}>
        {tier.previousPrice ? `Was ${tier.previousPrice}` : "—"}
      </span>
      <p className="hc-tier__price">
        {tier.price}
        <small>{tier.cadence ?? "starting"}</small>
      </p>
      {tier.priceLabel && (
        <p className="hc-eyebrow" style={{ marginTop: 8 }}>
          {tier.priceLabel}
        </p>
      )}
      <ul className="hc-tier__list">
        {tier.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <Button href="/contact" variant={tier.featured ? "cream" : "outline"} className="w-full" showArrow>
        Get Started
      </Button>
    </div>
  );
}
