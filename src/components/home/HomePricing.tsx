import Link from "next/link";
import { websitePackages, bundles, gbpPricing } from "@/data/pricing";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MaskReveal } from "@/components/ui/MaskReveal";

// Short presentational hooks for the bundle cards — cosmetic copy only,
// paired with the real bestFor sentence below each one (from pricing.ts).
const bundleHooks: Record<string, string> = {
  "Launch Bundle": "Starting from zero",
  "Growth Bundle": "Taking real market share",
  "Market Leader Bundle": "Owning the category",
};

export async function HomePricing() {
  const region = await getRegion();
  const pricingNote = regionCopy[region].pricingNote;

  return (
    <section className="hc-section" id="pricing" style={{ paddingBottom: 0 }}>
      <div className="hc-wrap">
        <RevealOnScroll>
          <p className="hc-eyebrow">Investment</p>
          <h2 className="hc-h2" style={{ margin: "18px 0 0", maxWidth: "20ch" }}>
            <MaskReveal>Real numbers. Not a &lsquo;contact us for pricing&rsquo; dodge.</MaskReveal>
          </h2>
          <p className="hc-lede" style={{ marginTop: 20 }}>
            Three website tiers, plus SEO retainers, Care plans and bundled packages. Final quote is confirmed
            after a short scope call — the factors that shift scope take five minutes to walk through.
          </p>
        </RevealOnScroll>

        <div className="hc-tiers">
          {websitePackages.map((tier, i) => (
            <RevealOnScroll key={tier.name} delay={i * 60}>
              <div className={`hc-tier${tier.featured ? " hc-tier--pop" : ""}`}>
                <span className="hc-tier__flag">{tier.featured ? "Most Popular" : ""}</span>
                <h3 className="hc-tier__name">{tier.name}</h3>
                <p className="hc-tier__for">{tier.bestFor}</p>
                <span className="hc-tier__was" style={!tier.previousPrice ? { visibility: "hidden" } : undefined}>
                  {tier.previousPrice ? `Was ${tier.previousPrice}` : "—"}
                </span>
                <p className="hc-tier__price">
                  {tier.price}
                  <small>starting</small>
                </p>
                <ul className="hc-tier__list">
                  {tier.features.slice(0, 6).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`hc-btn ${tier.featured ? "hc-btn--fill" : "hc-btn--ghost"}`}
                  data-cta={`home-pricing-${tier.name.toLowerCase()}`}
                >
                  Get Started
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="hc-bundles">
          {bundles.map((bundle, i) => (
            <RevealOnScroll key={bundle.name} delay={i * 60}>
              <div className="hc-bundle">
                <p className="hc-eyebrow">{bundle.name}{bundle.featured ? " · Most Popular" : ""}</p>
                <h4>{bundleHooks[bundle.name] ?? bundle.name}</h4>
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
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="hc-gbp">
            <span className="hc-gbp__k">Google Business Profile</span>
            <span className="hc-gbp__v">
              <b>{gbpPricing.setup}</b> {gbpPricing.setupNote}
            </span>
            <span className="hc-gbp__v">
              <b>{gbpPricing.monthly}</b> {gbpPricing.monthlyNote}
            </span>
          </div>

          <p className="hc-fineprint">
            {pricingNote} Every bundle locks in the recurring-service rate for its bundled term at 15–17% below
            buying each piece separately. SEO retainer and Website Care plan rates are listed in full on the{" "}
            <Link href="/pricing">pricing page</Link>.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
