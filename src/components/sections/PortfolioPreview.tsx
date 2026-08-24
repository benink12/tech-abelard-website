import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";

export function PortfolioPreview() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Selected Work"
            title="Luxury. Platforms. Healthcare."
            description="A look at the showcase builds — each one architected for its industry's actual buying behavior, not a generic template stretched to fit."
          />
          <Link href="/portfolio" className="hidden shrink-0 text-sm font-medium text-ink/70 hover:text-brass-ink sm:block">
            View all work →
          </Link>
        </div>

        <PortfolioShowcase className="mt-14" featuredSlugs={["aurelle-medspa", "northhaven-property-management", "northpaw-veterinary-hospital"]} />

        <Link href="/portfolio" className="mt-10 block text-sm font-medium text-ink/70 hover:text-brass-ink sm:hidden">
          View all work →
        </Link>

        <p className="mt-10 text-sm text-ink/50">
          Looking for something more trade-specific? See{" "}
          <Link href="/plumber-website-design" className="text-brass-ink underline underline-offset-2 hover:text-ink">
            plumbing web design
          </Link>{" "}
          for an example built around one industry.
        </p>
      </Container>
    </section>
  );
}
