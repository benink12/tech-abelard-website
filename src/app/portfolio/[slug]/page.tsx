import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Smartphone, ShieldCheck } from "lucide-react";
import { portfolioProjects, nicheInProse } from "@/data/portfolio";
import { Container } from "@/components/ui/Container";
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
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/65">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brass-ink" strokeWidth={1.5} />
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

  return (
    <>
      <PageHero eyebrow={project.niche} title={project.name} description={project.tagline}>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.servicesDemonstrated.map((service) => (
            <Badge key={service} tone="cream">
              {service}
            </Badge>
          ))}
        </div>
      </PageHero>

      {project.screenshots && project.screenshots.desktop.length > 0 && (
        <Container className="relative -mt-10 sm:-mt-16">
          <div className="overflow-hidden rounded-2xl border border-ink/8 shadow-xl shadow-ink/10">
            <div className="relative aspect-[16/10] w-full sm:aspect-[16/8]">
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
        </Container>
      )}

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-12">
              <div>
                <SectionHeading eyebrow="Overview" title="What this project is" />
                <p className="mt-5 text-base leading-relaxed text-ink/65">{project.description}</p>
              </div>

              <div>
                <SectionHeading eyebrow="The Challenge" title="Business challenge" />
                <p className="mt-5 text-base leading-relaxed text-ink/65">{project.challenge}</p>
              </div>

              <div>
                <SectionHeading eyebrow="The Approach" title="Design approach" />
                <p className="mt-5 text-base leading-relaxed text-ink/65">{project.designApproach}</p>
              </div>

              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <ListSection title="Conversion features" items={project.conversionFeatures} />
                <ListSection title="SEO structure" items={project.seoStructure} />
              </div>

              <div>
                <h3 className="font-display text-lg font-medium text-ink">Key pages</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.keyPages.map((page) => (
                    <Badge key={page} tone="neutral">
                      {page}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-ink/8 bg-cream-card p-7">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-brass-ink" strokeWidth={1.5} />
                  <h3 className="font-display text-lg font-medium text-ink">What Tech Abélard would improve for a real client</h3>
                </div>
                <ul className="mt-4 flex flex-col gap-2">
                  {project.whatWedImprove.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/60">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-ink/8">
                <DeviceMockup project={project} />
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-ink/8 bg-cream-card p-4 text-xs leading-relaxed text-ink/55">
                <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-brass-ink" strokeWidth={1.5} />
                <p>
                  <span className="font-semibold text-ink/70">Mobile experience —</span> every page above was designed
                  mobile-first and verified on real device viewports before desktop, not adapted afterward.
                </p>
              </div>

              <div className="rounded-xl border border-ink/12 bg-ink p-5 text-cream">
                <p className="text-xs font-semibold uppercase tracking-wide text-brass-light">Concept Project</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">
                  Created to demonstrate Tech Abélard&apos;s capabilities for {nicheInProse(project.niche)} businesses. It
                  is not presented as a completed client project.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ProjectGallery project={project} />

      <section id="request-access" className="border-t border-ink/8 bg-ink-soft/5 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Go Further"
            title="Want to explore the full interactive demo?"
            description={`Request live access to the private, fully interactive ${project.name} showcase — we review every request personally.`}
            align="center"
            className="mx-auto mb-12"
          />
          <div className="mx-auto max-w-2xl">
            <RequestAccessForm projectSlug={project.slug} projectName={project.name} />
            <div className="mt-6 flex justify-center">
              <Button href="/contact" variant="outline" showArrow>
                Book a Discovery Call
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
