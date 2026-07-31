import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Discovery, Strategy, Design, Development, Launch, Growth — the six-stage process behind every Tech Abélard website.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="Six stages. No surprises."
        description="The same process, every project, every time — so you always know what happens next and why."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <ProcessTimeline full />
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
