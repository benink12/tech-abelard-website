import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-ink/8 bg-ink pb-16 pt-16 text-cream sm:pb-20 sm:pt-24">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          tone="cream"
          titleAs="h1"
          className="max-w-3xl"
        />
        {children}
      </Container>
    </section>
  );
}
