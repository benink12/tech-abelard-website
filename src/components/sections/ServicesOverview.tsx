import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { iconMap } from "@/lib/icons";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

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
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink/8 bg-cream-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brass/30 hover:shadow-lg hover:shadow-ink/[0.06]"
                >
                  <Icon className="h-6 w-6 text-brass-ink" strokeWidth={1.6} />
                  <h3 className="mt-5 font-display text-xl font-medium text-ink">{service.name}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/60">{service.shortDescription}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brass-ink">
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>

        <Link href="/services" className="mt-10 block text-sm font-medium text-ink/70 hover:text-brass-ink sm:hidden">
          View all services →
        </Link>

        <p className="mt-10 text-sm text-ink/50">
          Serving Ottawa? See our dedicated{" "}
          <Link href="/web-design-ottawa" className="text-brass-ink underline underline-offset-2 hover:text-ink">
            Ottawa web design services
          </Link>{" "}
          page.
        </p>
      </Container>
    </section>
  );
}
