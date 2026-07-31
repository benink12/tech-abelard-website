import { differentiators } from "@/data/differentiators";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function WhyTechAbelard() {
  return (
    <section className="bg-ink py-24 text-cream sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Why Tech Abélard"
              title="Premium pricing, because the work is actually premium."
              description="If you're comparing us to a $500 template site, we're not for you. If you're comparing us to what it costs to keep losing jobs to a competitor with a better website, the math is simple."
              tone="cream"
            />
          </div>

          <div className="flex flex-col divide-y divide-cream/10 border-t border-cream/10">
            {differentiators.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 80}>
                <div className="grid grid-cols-[auto_1fr] gap-6 py-8">
                  <span className="font-display text-2xl font-medium text-brass-light">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-medium">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-cream/60">{item.description}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
