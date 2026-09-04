import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="hc-section hc-section--dark hc-finalcta">
      <div className="hc-wrap hc-finalcta__wrap">
        <p className="hc-eyebrow">Let&apos;s Talk</p>
        <h2 className="hc-claim" style={{ marginTop: 18 }}>
          The difference is in how your business <em>shows up.</em>
        </h2>
        <p className="hc-lede">
          Book a short discovery call — we&apos;ll tell you honestly which tier fits your business, no pressure and
          no generic pitch.
        </p>
        <div className="hc-hero__ctas">
          <Button href="/contact" variant="cream" size="lg" showArrow>
            {site.cta.primary}
          </Button>
          <Button href="/pricing" variant="outline-cream" size="lg">
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
