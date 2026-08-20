import Link from "next/link";
import { services } from "@/data/services";
import { iconMap } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Card } from "@/components/ui/Card";

export function ServicesOverview() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title="Seven disciplines. One growth engine."
            description="Every service is built to work alone or as a system — a site that converts, feeding an SEO campaign that keeps finding it new customers."
          />
          <Link href="/services" className="hidden shrink-0 text-sm font-medium text-ink/70 hover:text-brass-ink sm:block">
            View all services →
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <RevealOnScroll key={service.slug} delay={i * 60}>
                <Card className="h-full">
                  <Icon className="h-6 w-6 text-brass-ink" strokeWidth={1.6} />
                  <h3 className="mt-5 font-display text-xl font-medium text-ink">{service.name}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/60">{service.shortDescription}</p>
                </Card>
              </RevealOnScroll>
            );
          })}
        </div>

        <Link href="/services" className="mt-10 block text-sm font-medium text-ink/70 hover:text-brass-ink sm:hidden">
          View all services →
        </Link>
      </Container>
    </section>
  );
}
