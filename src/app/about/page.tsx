import type { Metadata } from "next";
import { site } from "@/data/site";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { homeFontClassName } from "@/lib/fonts/home";
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
    <div className={`home-concept ${homeFontClassName}`}>
      <PageHero
        eyebrow="About"
        title="Built for one kind of business, on purpose."
        description={`${copy.siteDescription} That's a deliberate narrowing, not a limitation.`}
      />

      <section className="hc-section">
        <div className="hc-wrap">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Mission"
                title={copy.regionalStatement}
                description="We'd rather be the obvious choice for ten trades than a mediocre generalist for every industry at once."
              />
            </div>

            <div className="hc-steps" style={{ marginTop: 0 }}>
              {beliefs.map((item, i) => (
                <RevealOnScroll key={item.title} delay={i * 80}>
                  <div className="hc-step" style={{ gridTemplateColumns: "48px 1fr" }}>
                    <span className="hc-step__n">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="hc-heading__title" style={{ fontSize: 21 }}>
                        {item.title}
                      </h3>
                      <p className="hc-step__d" style={{ marginTop: 8 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Who We Serve"
            title="Every project is a home service business."
            description={copy.aboutWhoWeServeDescription}
            align="center"
            tone="cream"
            className="mx-auto"
          />
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
            {site.industries.map((industry) => (
              <span key={industry} className="hc-badge hc-badge--cream">
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
