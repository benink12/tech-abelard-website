import type { Metadata } from "next";
import Link from "next/link";
import { homeFontClassName } from "@/lib/fonts/home";
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
    <div className={`home-concept ${homeFontClassName}`}>
      <PageHero
        eyebrow="Process"
        title="Six stages. No surprises."
        description="The same process, every project, every time — so you always know what happens next and why."
      />

      <section className="hc-section">
        <div className="hc-wrap">
          <ProcessTimeline full />
          <p className="hc-worknote" style={{ marginTop: 40 }}>
            This is the same process whether you&apos;re across the country or just down the street — see how it
            applies to <Link href="/web-design-ottawa">Ottawa website design</Link> specifically.
          </p>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
