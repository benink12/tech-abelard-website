import { faqItems, localizeFaqItems } from "@/data/faq";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { FAQAccordion } from "@/components/ui/FAQAccordion";

const guarantees = [
  'A specific ranking position or "page 1, guaranteed" — no honest agency can promise this. Google’s algorithm isn’t for sale.',
  "A fixed timeline — local SEO compounds over months, not days, and the starting point varies by market.",
  "Rankings that hold regardless of what happens on your end — reviews, response time and service quality still matter.",
  "Results without ongoing work — SEO is a monthly discipline. Pausing the retainer eventually pauses the compounding too.",
];

export async function HomeFaq() {
  const region = await getRegion();
  const items = localizeFaqItems(faqItems, regionCopy[region].faqAudienceAnswer);

  return (
    <section className="hc-section" id="faq" style={{ paddingBottom: 0 }}>
      <div className="hc-wrap">
        <RevealOnScroll>
          <p className="hc-eyebrow">Questions</p>
          <h2 className="hc-h2" style={{ margin: "18px 0 0", maxWidth: "16ch" }}>
            <MaskReveal>Straight answers before you ask.</MaskReveal>
          </h2>
          <p className="hc-lede" style={{ marginTop: 20 }}>
            The questions that come up on nearly every discovery call — answered here first.
          </p>
        </RevealOnScroll>

        <div style={{ marginTop: "clamp(28px, 4vw, 44px)" }}>
          <FAQAccordion items={items} />
        </div>

        <RevealOnScroll>
          <div className="hc-nog">
            <h4>What we do not guarantee</h4>
            <ul>
              {guarantees.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
