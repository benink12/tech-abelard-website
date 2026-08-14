import type { Metadata } from "next";
import { AccessGateForm } from "./AccessGateForm";
import { Container } from "@/components/ui/Container";

// Never indexed — see src/app/robots.ts's disallow for the whole /showcase
// tree. This page itself is reachable (the "enter your code" step has to
// be), it just isn't meant to show up in search results.
export const metadata: Metadata = {
  title: "Private Showcase Access",
  robots: { index: false, follow: false },
};

export default function ShowcaseAccessPage() {
  return (
    <section className="flex min-h-[80vh] items-center py-20 sm:py-28">
      <Container className="max-w-md">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-brass-ink">Private Preview</p>
        <h1 className="text-balance text-center font-display text-3xl font-medium text-ink">Tech Abélard Private Showcase</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-ink/60">
          Enter the business email and access code from your approval email to view the interactive demo you requested.
        </p>
        <div className="mt-10">
          <AccessGateForm />
        </div>
      </Container>
    </section>
  );
}
