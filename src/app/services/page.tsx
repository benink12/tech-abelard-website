import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { iconMap } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PageHero } from "@/components/sections/PageHero";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getRegion();
  return {
    title: "Services",
    description: regionCopy[region].pageDescriptions.services,
    alternates: { canonical: "/services" },
  };
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Seven disciplines. One growth engine."
        description="Every service works alone, or as a system — a site engineered to convert, an SEO campaign engineered to keep finding it new customers."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-col gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon];
              return (
                <RevealOnScroll key={service.slug} delay={i * 60}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group grid grid-cols-1 gap-8 rounded-2xl border border-ink/8 bg-cream-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brass/30 hover:shadow-lg hover:shadow-ink/[0.06] sm:p-10 lg:grid-cols-[auto_1fr_auto_auto] lg:items-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5">
                      <Icon className="h-6 w-6 text-brass-ink" strokeWidth={1.6} />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-medium text-ink">{service.name}</h2>
                      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/60 sm:text-base">
                        {service.description}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-2 lg:w-64">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-ink/55">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brass-ink lg:justify-self-end">
                      Explore Service
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
          <p className="mt-10 text-sm text-ink/50">
            Looking for web design specifically for Ottawa businesses? See our{" "}
            <Link href="/web-design-ottawa" className="text-brass-ink underline underline-offset-2 hover:text-ink">
              website design for Ottawa businesses
            </Link>{" "}
            page.
          </p>
        </Container>
      </section>

      <AuditCallout
        ctaId="services-free-audit"
        title="Not sure which service you need?"
        description="Start with a free, honest audit of your current site — we'll tell you exactly what to prioritize first."
      />

      <FinalCTA />
    </>
  );
}
