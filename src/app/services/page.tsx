import type { Metadata } from "next";
import { services } from "@/data/services";
import { iconMap } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PageHero } from "@/components/sections/PageHero";
import { AuditCallout } from "@/components/sections/AuditCallout";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web design, local SEO, Google Business Profile management, website care, landing pages, and performance optimization for Canadian home service businesses.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Six disciplines. One growth engine."
        description="Every service works alone, or as a system — a site engineered to convert, an SEO campaign engineered to keep finding it new customers."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-col gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon];
              return (
                <RevealOnScroll key={service.slug} delay={i * 60}>
                  <div className="grid grid-cols-1 gap-8 rounded-2xl border border-ink/8 bg-cream-card p-8 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
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
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
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
