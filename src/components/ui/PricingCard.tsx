import { Check } from "lucide-react";
import type { PricingTier } from "@/data/pricing";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1",
        tier.featured
          ? "border-brass/50 bg-ink text-cream shadow-xl shadow-ink/10 hover:shadow-2xl"
          : "border-ink/8 bg-cream-card hover:border-brass-ink/25 hover:shadow-lg hover:shadow-ink/[0.06]"
      )}
    >
      {tier.featured && (
        <Badge tone="brass" className="mb-5 w-fit">
          Most Popular
        </Badge>
      )}
      <h3 className={cn("font-display text-2xl font-medium", tier.featured ? "text-cream" : "text-ink")}>
        {tier.name}
      </h3>
      <p className={cn("mt-3 text-sm leading-relaxed", tier.featured ? "text-cream/65" : "text-ink/60")}>
        {tier.bestFor}
      </p>

      <div className="mt-6">
        {tier.previousPrice && (
          <p className={cn("text-sm font-medium line-through", tier.featured ? "text-cream/40" : "text-ink/35")}>
            Was {tier.previousPrice}
          </p>
        )}
        <div className={cn("flex items-baseline gap-1.5", tier.previousPrice && "mt-1")}>
          <span className={cn("font-display text-4xl font-medium", tier.featured ? "text-brass-light" : "text-ink")}>
            {tier.price}
          </span>
          {tier.cadence && (
            <span className={cn("text-sm", tier.featured ? "text-cream/50" : "text-ink/45")}>{tier.cadence}</span>
          )}
          {!tier.cadence && (
            <span className={cn("text-sm", tier.featured ? "text-cream/50" : "text-ink/45")}>starting</span>
          )}
        </div>
        {tier.priceLabel && (
          <p className={cn("mt-2 text-xs font-semibold uppercase tracking-[0.14em]", tier.featured ? "text-brass-light" : "text-brass-ink")}>
            {tier.priceLabel}
          </p>
        )}
      </div>

      <ul className="mt-7 flex flex-1 flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check className={cn("mt-0.5 h-4 w-4 shrink-0", tier.featured ? "text-brass-light" : "text-brass-ink")} />
            <span className={tier.featured ? "text-cream/80" : "text-ink/70"}>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        href="/contact"
        variant={tier.featured ? "cream" : "outline"}
        className="mt-8 w-full"
        showArrow
      >
        Get Started
      </Button>
    </div>
  );
}
