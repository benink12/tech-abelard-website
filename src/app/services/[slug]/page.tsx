import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { services } from "@/data/services";
import { iconMap } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

// The three main services (web-design, local-seo, ai-receptionist) get their
// own bespoke routes at src/app/services/<slug>/page.tsx — a literal
// directory always wins over this dynamic segment for those exact paths, so
// excluding them here just keeps this template from generating a redundant,
// thinner duplicate at build time.
const MAIN_SERVICE_SLUGS = new Set(["web-design", "local-seo", "ai-receptionist"]);

export function generateStaticParams() {
  return services.filter((service) => !MAIN_SERVICE_SLUGS.has(service.slug)).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service || MAIN_SERVICE_SLUGS.has(slug)) notFound();

  const Icon = iconMap[service.icon];

  return (
    <>
      <PageHero eyebrow="Services" title={service.name} description={service.description}>
        <div className="mt-8">
          <Button href="/contact" variant="cream" size="lg" data-cta={`${service.slug}-hero-discovery-call`} showArrow>
            Book a Discovery Call
          </Button>
        </div>
      </PageHero>

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[auto_1fr] lg:items-start">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5">
              <Icon className="h-6 w-6 text-brass-ink" strokeWidth={1.6} />
            </div>
            <div>
              <SectionHeading eyebrow="What's Included" title="What you get." />
              <ul className="mt-8 flex flex-col gap-3.5">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/65 sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brass-ink" strokeWidth={1.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <AuditCallout
        ctaId={`${service.slug}-free-audit`}
        title="Not sure which service you need?"
        description="Start with a free, honest audit of your current site — we'll tell you exactly what to prioritize first."
      />

      <FinalCTA />
    </>
  );
}
