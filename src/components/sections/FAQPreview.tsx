import Link from "next/link";
import { faqItems } from "@/data/faq";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/ui/FAQAccordion";

export function FAQPreview() {
  const preview = faqItems.slice(0, 5);

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
