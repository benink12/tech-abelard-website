import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Client Voices"
            title="What it's like to work with us."
            align="left"
          />
          <Badge tone="neutral">Demo placeholders — pending real client reviews</Badge>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <RevealOnScroll key={testimonial.name + i} delay={i * 70}>
              <Card className="flex h-full flex-col">
                <Quote className="h-6 w-6 text-brass-ink/60" strokeWidth={1.6} />
                <p className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-ink/75">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-ink/8 pt-4">
                  <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-xs text-ink/50">{testimonial.role}</p>
                </div>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
