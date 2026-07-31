import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";

export function ProcessPreview() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="How We Work"
            title="Six stages. No surprises."
            description="From the first call to the monthly report a year later — the same process every time, so you always know what's next."
          />
          <Link href="/process" className="hidden shrink-0 text-sm font-medium text-ink/70 hover:text-brass-ink sm:block">
            See the full process →
          </Link>
        </div>

        <div className="mt-14">
          <ProcessTimeline />
        </div>

        <Link href="/process" className="mt-10 block text-sm font-medium text-ink/70 hover:text-brass-ink sm:hidden">
          See the full process →
        </Link>
      </Container>
    </section>
  );
}
