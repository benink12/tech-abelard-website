import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Smartphone, ShieldCheck } from "lucide-react";
import { portfolioProjects, nicheInProse } from "@/data/portfolio";
import { site } from "@/data/site";
import { homeFontClassName } from "@/lib/fonts/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { RequestAccessForm } from "@/components/sections/RequestAccessForm";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { DeviceMockup } from "@/components/ui/PortfolioCard";

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — Case Study`,
    description: project.description,
    alternates: { canonical: `/portfolio/${project.slug}` },
  };
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="hc-heading__title" style={{ fontSize: 18 }}>
        {title}
      </h3>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "var(--slate)" }}>
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} style={{ color: "var(--hc-ink)" }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function PortfolioCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: `${site.url}/portfolio` },
      { "@type": "ListItem", position: 3, name: project.name, item: `${site.url}/portfolio/${project.slug}` },
    ],
  };

  return (
    <div className={`home-concept ${homeFontClassName}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <PageHero eyebrow={project.niche} title={project.name} description={project.tagline}>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.servicesDemonstrated.map((service) => (
            <Badge key={service} tone="ink">
              {service}
            </Badge>
          ))}
        </div>
      </PageHero>

      {project.screenshots && project.screenshots.desktop.length > 0 && (
        <div className="hc-wrap" style={{ marginTop: 40 }}>
          <div className="relative aspect-[16/10] w-full sm:aspect-[16/8]" style={{ border: "1px solid var(--rule)" }}>
            <Image
              src={project.screenshots.desktop[0].src}
              alt={project.screenshots.desktop[0].alt}
              fill
              priority
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      )}

      <section className="hc-section">
        <div className="hc-wrap">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-12">
              <div>
                <SectionHeading eyebrow="Overview" title="What this project is" />
                <p className="hc-lede" style={{ marginTop: 18, maxWidth: "none" }}>
                  {project.description}
                </p>
              </div>

              <div>
                <SectionHeading eyebrow="The Challenge" title="Business challenge" />
                <p className="hc-lede" style={{ marginTop: 18, maxWidth: "none" }}>
                  {project.challenge}
                </p>
              </div>

              <div>
                <SectionHeading eyebrow="The Approach" title="Design approach" />
                <p className="hc-lede" style={{ marginTop: 18, maxWidth: "none" }}>
                  {project.designApproach}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <ListSection title="Conversion features" items={project.conversionFeatures} />
                <ListSection title="SEO structure" items={project.seoStructure} />
              </div>

              <div>
                <h3 className="hc-heading__title" style={{ fontSize: 18 }}>
                  Key pages
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.keyPages.map((page) => (
                    <Badge key={page} tone="neutral">
                      {page}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="hc-flatcard">
                <div className="hc-flatcard__kicker">
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                  What Tech Abélard would improve for a real client
                </div>
                <ul style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, padding: 0, listStyle: "none" }}>
                  {project.whatWedImprove.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "var(--slate)" }}>
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--slate)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div style={{ border: "1px solid var(--rule)" }}>
                <DeviceMockup project={project} />
              </div>

              <div className="flex items-start gap-2.5 hc-flatcard" style={{ paddingBottom: 4 }}>
                <Smartphone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} style={{ color: "var(--hc-ink)" }} />
                <p style={{ fontSize: 13 }}>
                  <strong style={{ color: "var(--hc-ink)" }}>Mobile experience —</strong> every page above was designed
                  mobile-first and verified on real device viewports before desktop, not adapted afterward.
                </p>
              </div>

              <div className="hc-flatcard" style={{ borderTopColor: "var(--hc-ink)" }}>
                <p className="hc-eyebrow" style={{ color: "var(--slate)" }}>
                  Concept Project
                </p>
                <p style={{ marginTop: 8 }}>
                  Created to demonstrate Tech Abélard&apos;s capabilities for {nicheInProse(project.niche)}{" "}
                  businesses. It is not presented as a completed client project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectGallery project={project} />

      <section id="request-access" className="hc-section hc-section--dark">
        <div className="hc-wrap">
          <SectionHeading
            eyebrow="Go Further"
            title="Want to explore the full interactive demo?"
            description={`Request live access to the private, fully interactive ${project.name} showcase — we review every request personally.`}
            align="center"
            tone="cream"
            className="mx-auto mb-12"
          />
          <div className="mx-auto max-w-2xl">
            <RequestAccessForm projectSlug={project.slug} projectName={project.name} />
            <div className="mt-6 flex justify-center">
              <Button href="/contact" variant="outline-cream" showArrow>
                Book a Discovery Call
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
