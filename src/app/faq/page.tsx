import type { Metadata } from "next";
import { faqItems } from "@/data/faq";
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FAQPage() {
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
            <FAQAccordion items={faqItems} />
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
