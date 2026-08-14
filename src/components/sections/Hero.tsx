import { site } from "@/data/site";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export async function Hero() {
  const region = await getRegion();
  const copy = regionCopy[region];

  return (
    <section className="relative overflow-hidden bg-ink pb-24 pt-20 text-cream sm:pb-32 sm:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(176,141,87,0.16), transparent), radial-gradient(ellipse 40% 40% at 90% 20%, rgba(176,141,87,0.08), transparent)",
        }}
      />

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="brass-line mx-auto mb-8 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brass">
            {copy.heroEyebrow}
          </p>

          <h1 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Websites that make the phone ring <span className="text-brass-light">before the pitch does.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-cream/65 sm:text-xl">
            Tech Abélard designs and ranks premium websites for plumbers, roofers, HVAC companies, and the trades around
            them — built to convert the moment someone lands, and to compound in search results every month after.
          </p>

          <div className="mt-11 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" variant="cream" size="lg" showArrow>
              {site.cta.primary}
            </Button>
            <Button href="/audit" variant="outline-cream" size="lg" data-cta="hero-free-audit">
              Get a Free Website Audit
            </Button>
            <Button href="/portfolio" variant="outline-cream" size="lg">
              {site.cta.secondary}
            </Button>
          </div>

          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-cream/10 pt-10">
            {[
              ["10", "Trades industries served"],
              ["3", "Tiers built for every stage"],
              ["1", "Team obsessed with detail"],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-medium text-brass-light sm:text-4xl">{value}</p>
                <p className="mt-1 text-xs text-cream/50 sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
