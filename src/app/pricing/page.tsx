import type { Metadata } from "next";
import Link from "next/link";
import { gbpPricing } from "@/data/pricing";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { homeFontClassName } from "@/lib/fonts/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { PricingTabs, BundlesGrid } from "@/components/sections/PricingTabs";
import { FinalCTA } from "@/components/sections/FinalCTA";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getRegion();
  return {
    title: "Pricing",
    description: regionCopy[region].pageDescriptions.pricing,
    alternates: { canonical: "/pricing" },
  };
}

export default async function PricingPage() {
  const region = await getRegion();
  const copy = regionCopy[region];

  return (
    <div className={`home-concept ${homeFontClassName}`}>
      <PageHero
        eyebrow="Pricing"
        title="Real numbers. Not a 'contact us for pricing' dodge."
        description={copy.pricingNote}
      />

      <section className="hc-section">
        <div className="hc-wrap">
          <PricingTabs />
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Bundles"
            title="Website + SEO + Care, priced to reward doing it right from day one."
            description="Every bundle locks in the recurring-service rate for its bundled term at 15–17% below buying each piece separately."
            align="center"
            tone="cream"
            className="mx-auto"
          />
          <div className="mt-14">
            <BundlesGrid />
          </div>
        </div>
      </section>

      <section className="hc-section">
        <div className="hc-wrap">
          <div className="mx-auto max-w-3xl hc-gbp" style={{ justifyContent: "center", textAlign: "center", flexDirection: "column", borderTop: "none" }}>
            <p className="hc-eyebrow">Google Business Profile</p>
            <h3 className="hc-heading__title" style={{ marginTop: 10 }}>
              Standalone, or free inside every SEO retainer.
            </h3>
            <div className="mt-8 flex flex-col justify-center gap-10 sm:flex-row">
              <div>
                <p className="hc-heading__title" style={{ fontSize: 28 }}>
                  {gbpPricing.setup}
                </p>
                <p className="hc-lede" style={{ marginTop: 4, maxWidth: "none" }}>
                  {gbpPricing.setupNote}
                </p>
              </div>
              <div>
                <p className="hc-heading__title" style={{ fontSize: 28 }}>
                  {gbpPricing.monthly}
                </p>
                <p className="hc-lede" style={{ marginTop: 4, maxWidth: "none" }}>
                  {gbpPricing.monthlyNote}
                </p>
              </div>
            </div>
          </div>
          <p className="hc-worknote" style={{ marginTop: 40, textAlign: "center" }}>
            Pricing questions specific to an Ottawa project? Visit our <Link href="/web-design-ottawa">Ottawa web design</Link> page for
            details built around local businesses.
          </p>
          <p className="hc-worknote" style={{ marginTop: 10, textAlign: "center" }}>
            Pricing for an SEO retainer specifically? See <Link href="/local-seo-for-contractors">SEO pricing for contractors</Link> and
            trades.
          </p>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
