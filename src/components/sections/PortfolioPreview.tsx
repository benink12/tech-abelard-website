import Link from "next/link";
import { portfolioProjects } from "@/data/portfolio";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { PortfolioCard } from "@/components/ui/PortfolioCard";

export function PortfolioPreview() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Selected Work"
            title="Three industries. One design standard."
            description="A look at the showcase builds — each one architected for its industry's actual buying behavior, not a generic template stretched to fit."
          />
          <Link href="/portfolio" className="hidden shrink-0 text-sm font-medium text-ink/70 hover:text-brass-ink sm:block">
            View full portfolio →
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {portfolioProjects.map((project, i) => (
            <RevealOnScroll key={project.slug} delay={i * 80}>
              <PortfolioCard project={project} />
            </RevealOnScroll>
          ))}
        </div>

        <Link href="/portfolio" className="mt-10 block text-sm font-medium text-ink/70 hover:text-brass-ink sm:hidden">
          View full portfolio →
        </Link>
      </Container>
    </section>
  );
}
