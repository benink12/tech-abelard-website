import Link from "next/link";
import { services } from "@/data/services";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MaskReveal } from "@/components/ui/MaskReveal";

const kickers: Record<string, string> = {
  "web-design": "Built to convert",
  "local-seo": "Built to compound",
  "ai-receptionist": "Built to answer",
};

const featuredSlugs = ["web-design", "local-seo", "ai-receptionist"];

export function HomeServices() {
  const featured = featuredSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is (typeof services)[number] => Boolean(s));
  const also = services.filter((s) => !featuredSlugs.includes(s.slug));

  return (
    <section className="hc-section" id="services" style={{ paddingBottom: 0 }}>
      <div className="hc-wrap">
        <RevealOnScroll>
          <p className="hc-eyebrow">What we do</p>
        </RevealOnScroll>
        <RevealOnScroll delay={40}>
          <h2 className="hc-h2" style={{ margin: "18px 0 20px", maxWidth: "16ch" }}>
            <MaskReveal>Seven disciplines. One growth engine.</MaskReveal>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <p className="hc-lede" style={{ margin: "0 0 clamp(34px,5vw,58px)" }}>
            Every service is built to work alone or as a system — a site that converts, feeding an SEO campaign that
            keeps finding it new customers.
          </p>
        </RevealOnScroll>
      </div>

      {featured.map((service) => (
        <RevealOnScroll key={service.slug}>
          <Link className="hc-svc" href={`/services/${service.slug}`}>
            <div className="hc-wrap">
              <div className="hc-svc__in">
                <div>
                  <span className="hc-svc__kicker">{kickers[service.slug]}</span>
                </div>
                <div>
                  <h3 className="hc-svc__title">{service.name}</h3>
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

      <div className="hc-wrap">
        <RevealOnScroll>
          <div className="hc-also">
            <span>Also:</span>
            {also.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                <b>{service.name}</b>
              </Link>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
