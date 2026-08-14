import type { Metadata } from "next";
import { site } from "@/data/site";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getRegion();
  return {
    title: "About",
    description: regionCopy[region].pageDescriptions.about,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const region = await getRegion();
  const copy = regionCopy[region];

  const beliefs = [
    {
      title: "Specificity over polish-for-its-own-sake",
      description:
        "A beautiful site that doesn't mention your actual service areas or your actual services is just expensive wallpaper. Every page is built around real specifics — your business, not a category.",
    },
    {
      title: "One industry, done properly",
      description: copy.aboutBeliefDescription,
    },
    {
      title: "Say the honest thing, even when it costs the sale",
      description:
        "If Essential fits your business better than Premium, we'll say so — and if your existing site's real problem is unmaintained infrastructure rather than a redesign, we'll say that too.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built for one kind of business, on purpose."
        description={`${copy.siteDescription} That's a deliberate narrowing, not a limitation.`}
      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Mission"
                title={copy.regionalStatement}
                description="We'd rather be the obvious choice for ten trades than a mediocre generalist for every industry at once."
              />
            </div>

            <div className="flex flex-col divide-y divide-ink/8 border-t border-ink/8">
              {beliefs.map((item, i) => (
                <RevealOnScroll key={item.title} delay={i * 80}>
                  <div className="grid grid-cols-[auto_1fr] gap-6 py-8">
                    <span className="font-display text-2xl font-medium text-brass-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-medium text-ink">{item.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-ink/60">{item.description}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/8 bg-ink-soft/5 py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Who We Serve"
            title="Every project is a home service business."
            description={copy.aboutWhoWeServeDescription}
            align="center"
            className="mx-auto"
          />
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
            {site.industries.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-ink/10 bg-cream-card px-5 py-2.5 text-sm font-medium text-ink/70"
              >
                {industry}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
