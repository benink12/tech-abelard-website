import Link from "next/link";
import { websitePackages, pricingDisclaimer } from "@/data/pricing";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PricingCard } from "@/components/ui/PricingCard";

export function PricingPreview() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Investment"
            title="Three website tiers. Real prices, not ranges."
            description="Plus SEO retainers, Care plans, and bundled packages — all detailed on the full pricing page."
          />
          <Link href="/pricing" className="hidden shrink-0 text-sm font-medium text-ink/70 hover:text-brass-ink sm:block">
            See full pricing →
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {websitePackages.map((tier, i) => (
            <RevealOnScroll key={tier.name} delay={i * 80}>
              <PricingCard tier={tier} />
            </RevealOnScroll>
          ))}
        </div>

        <Link href="/pricing" className="mt-10 block text-sm font-medium text-ink/70 hover:text-brass-ink sm:hidden">
          See full pricing →
        </Link>

        <p className="mt-8 text-center text-xs text-ink/45 sm:text-left">{pricingDisclaimer}</p>
      </Container>
    </section>
  );
}
