import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { homeFontClassName } from "@/lib/fonts/home";
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
    <div className={`home-concept ${homeFontClassName}`}>
      <PageHero
        eyebrow="Services"
        title="Seven disciplines. One growth engine."
        description="Every service works alone, or as a system — a site engineered to convert, an SEO campaign engineered to keep finding it new customers."
      />

      <section className="hc-section" style={{ paddingBottom: 0 }}>
        {services.map((service, i) => (
          <RevealOnScroll key={service.slug} delay={i * 40}>
            <Link className="hc-svc" href={`/services/${service.slug}`}>
              <div className="hc-wrap">
                <div className="hc-svc__in">
                  <div>
                    <span className="hc-svc__kicker">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <h2 className="hc-svc__title">{service.name}</h2>
                  </div>
                  <div>
                    <p className="hc-svc__desc">{service.description}</p>
                    <ul className="hc-svc__list">
                      {service.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="hc-svc__go">↗</span>
                </div>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </section>

      <div className="hc-wrap" style={{ paddingBottom: "clamp(60px,8vw,100px)" }}>
        <p className="hc-worknote">
          Looking for web design specifically for Ottawa businesses? See our{" "}
          <Link href="/web-design-ottawa">website design for Ottawa businesses</Link> page.
        </p>
        <p className="hc-worknote" style={{ marginTop: 10 }}>
          Never miss another call? Read more about our{" "}
          <Link href="/ai-receptionist-for-small-business">AI receptionist for service businesses</Link>.
        </p>
      </div>

      <AuditCallout
        ctaId="services-free-audit"
        title="Not sure which service you need?"
        description="Start with a free, honest audit of your current site — we'll tell you exactly what to prioritize first."
      />

      <FinalCTA />
    </div>
  );
}
