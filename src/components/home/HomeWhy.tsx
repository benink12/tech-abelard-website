import { site } from "@/data/site";
import { differentiators } from "@/data/differentiators";
import { websitePackages } from "@/data/pricing";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MaskReveal } from "@/components/ui/MaskReveal";

export function HomeWhy() {
  return (
    <section className="hc-section" style={{ paddingBottom: 0 }}>
      <div className="hc-wrap">
        <RevealOnScroll>
          <p className="hc-eyebrow">Why Tech Abélard</p>
          <div className="hc-stats" style={{ marginTop: 26 }}>
            <div className="hc-stat">
              <b>{site.industries.length}</b>
              <span>Trades industries served</span>
            </div>
            <div className="hc-stat">
              <b>{websitePackages.length}</b>
              <span>Tiers built for every stage</span>
            </div>
            <div className="hc-stat">
              <b>1</b>
              <span>Team obsessed with detail</span>
            </div>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={60}>
          <h2 className="hc-claim">
            <MaskReveal>
              Premium pricing, because the work is <em>actually premium.</em>
            </MaskReveal>
          </h2>
          <p className="hc-lede" style={{ marginTop: 22 }}>
            If you&apos;re comparing us to a $500 template site, we&apos;re not for you. If you&apos;re comparing us
            to what it costs to keep losing jobs to a competitor with a better website, the math is simple.
          </p>
        </RevealOnScroll>
        <div className="hc-pts">
          {differentiators.map((item, i) => (
            <RevealOnScroll key={item.title} delay={i * 60}>
              <div className="hc-pt">
                <p className="hc-eyebrow">{String(i + 1).padStart(2, "0")}</p>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
