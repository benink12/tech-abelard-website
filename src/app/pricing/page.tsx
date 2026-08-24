import type { Metadata } from "next";
import Link from "next/link";
import { gbpPricing } from "@/data/pricing";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { Container } from "@/components/ui/Container";
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
    <>
      <PageHero
        eyebrow="Pricing"
        title="Real numbers. Not a 'contact us for pricing' dodge."
        description={copy.pricingNote}
      />

      <section className="py-24 sm:py-32">
        <Container>
          <PricingTabs />
        </Container>
      </section>

      <section className="border-t border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Bundles"
            title="Website + SEO + Care, priced to reward doing it right from day one."
            description="Every bundle locks in the recurring-service rate for its bundled term at 15–17% below buying each piece separately."
            align="center"
            className="mx-auto"
          />
          <div className="mt-14">
            <BundlesGrid />
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink/8 bg-cream-card p-8 text-center sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-ink">Google Business Profile</p>
            <h3 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl">
              Standalone, or free inside every SEO retainer.
            </h3>
            <div className="mt-6 flex flex-col justify-center gap-8 sm:flex-row">
              <div>
                <p className="font-display text-3xl font-medium text-ink">{gbpPricing.setup}</p>
                <p className="mt-1 text-sm text-ink/55">{gbpPricing.setupNote}</p>
              </div>
              <div>
                <p className="font-display text-3xl font-medium text-ink">{gbpPricing.monthly}</p>
                <p className="mt-1 text-sm text-ink/55">{gbpPricing.monthlyNote}</p>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-ink/50">
            Pricing questions specific to an Ottawa project? Visit our{" "}
            <Link href="/web-design-ottawa" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              Ottawa web design
            </Link>{" "}
            page for details built around local businesses.
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-ink/50">
            Pricing for an SEO retainer specifically? See{" "}
            <Link href="/local-seo-for-contractors" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              SEO pricing for contractors
            </Link>{" "}
            and trades.
          </p>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
