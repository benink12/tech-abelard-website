import type { Metadata } from "next";
import { faqItems, localizeFaqItems } from "@/data/faq";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions we get most on discovery calls — pricing, timelines, SEO expectations, and how the process works.",
  alternates: { canonical: "/faq" },
};

export default async function FAQPage() {
  const region = await getRegion();
  const copy = regionCopy[region];

  const items = localizeFaqItems(faqItems, copy.faqAudienceAnswer);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        eyebrow="FAQ"
        title="Straight answers before you ask."
        description="The questions that come up on nearly every discovery call — pricing, timelines, SEO, and process."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={items} />
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
