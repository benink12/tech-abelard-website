import Link from "next/link";
import { faqItems, localizeFaqItems } from "@/data/faq";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/ui/FAQAccordion";

export async function FAQPreview() {
  const region = await getRegion();
  const copy = regionCopy[region];

  const preview = localizeFaqItems(faqItems, copy.faqAudienceAnswer).slice(0, 5);

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="Questions"
              title="Straight answers before you ask."
              description="The questions that come up on nearly every discovery call — answered here first."
            />
            <Link
              href="/faq"
              className="mt-6 inline-block text-sm font-medium text-ink/70 hover:text-brass-ink"
            >
              View all FAQs →
            </Link>
          </div>
          <FAQAccordion items={preview} />
        </div>
      </Container>
    </section>
  );
}
