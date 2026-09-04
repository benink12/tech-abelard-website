import Link from "next/link";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MaskReveal } from "@/components/ui/MaskReveal";

const auditList = [
  "Technical SEO review",
  "Mobile and usability review",
  "Conversion and CTA review",
  "Top three recommended improvements",
  "No obligation",
];

export function HomeAudit() {
  return (
    <section
      className="hc-section hc-section--dark"
      style={{ paddingTop: "clamp(64px,8vw,130px)", paddingBottom: 0 }}
    >
      <div className="hc-wrap hc-audit">
        <RevealOnScroll>
          <p className="hc-eyebrow">Free Website Audit</p>
          <h2 className="hc-h2" style={{ margin: "18px 0 20px", maxWidth: "14ch" }}>
            <MaskReveal>Not sure what your website needs?</MaskReveal>
          </h2>
          <p className="hc-lede">
            Request a free website audit and receive a clear review of your SEO, mobile experience, performance,
            trust signals and lead-generation opportunities. We&apos;ll tell you exactly what&apos;s actually
            holding it back first.
          </p>
          <div className="hc-hero__ctas">
            <Link href="/audit" className="hc-btn hc-btn--fill" data-cta="home-audit-request">
              Request My Free Audit <span className="hc-btn__arrow">→</span>
            </Link>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <ul className="hc-audit__list">
            {auditList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
