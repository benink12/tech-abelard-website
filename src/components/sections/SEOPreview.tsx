import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SeoPillars } from "@/components/sections/SeoPillars";

export function SEOPreview() {
  return (
    <section className="bg-ink-soft/5 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Local SEO"
            title="A website is the asset. SEO is what makes it compound."
            description="Five pillars, run every month, so your ranking position keeps moving instead of quietly sliding backward."
          />
          <Link href="/seo" className="hidden shrink-0 text-sm font-medium text-ink/70 hover:text-brass-ink sm:block">
            Explore our SEO system →
          </Link>
        </div>

        <div className="mt-14">
          <SeoPillars />
        </div>

        <Link href="/seo" className="mt-10 block text-sm font-medium text-ink/70 hover:text-brass-ink sm:hidden">
          Explore our SEO system →
        </Link>
      </Container>
    </section>
  );
}
