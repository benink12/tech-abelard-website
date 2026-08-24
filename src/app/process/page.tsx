import type { Metadata } from "next";
import Link from "next/link";
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
          <p className="mt-10 text-sm text-ink/50">
            This is the same process whether you&apos;re across the country or just down the street — see how it applies to{" "}
            <Link href="/web-design-ottawa" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              Ottawa website design
            </Link>{" "}
            specifically.
          </p>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
