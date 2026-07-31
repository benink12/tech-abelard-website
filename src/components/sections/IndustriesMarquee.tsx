import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";

export function IndustriesMarquee() {
  const items = [...site.industries, ...site.industries];

  return (
    <section className="border-y border-ink/8 bg-cream py-10">
      <Container>
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">
          Built for Canada&apos;s home service industries
        </p>
      </Container>
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream to-transparent"
        />
        <div className="animate-marquee flex w-max gap-14 whitespace-nowrap">
          {items.map((industry, i) => (
            <span
              key={`${industry}-${i}`}
              className="font-display text-xl font-medium text-ink/35 sm:text-2xl"
            >
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
