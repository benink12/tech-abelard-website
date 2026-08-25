import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// Google Ads conversion destination — reached only via the client-side
// redirect in ContactForm.tsx after /api/contact confirms success (see
// that file). Deliberately not linked from nav, footer, or any other page,
// and kept out of the sitemap (src/app/sitemap.ts) and out of the index —
// this is a conversion event marker, not a page anyone should land on
// organically or find via search.
export const metadata: Metadata = {
  title: "Thank You",
  description: "Your message has been received.",
  alternates: { canonical: "/contact/thank-you" },
  robots: { index: false, follow: true },
};

export default function ContactThankYouPage() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div
          role="status"
          className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-ink/8 bg-cream-card p-10 text-center sm:p-14"
        >
          <CheckCircle2 className="h-12 w-12 text-brass-ink" strokeWidth={1.5} />
          <h1 className="mt-6 font-display text-3xl font-medium text-ink sm:text-4xl">
            Thank you — we received your request.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">
            We&apos;ll get back to you shortly — usually within one business day.
          </p>
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/" variant="ink" size="lg">
              Return to Homepage
            </Button>
            <Button href="/services" variant="outline" size="lg">
              Explore Our Services
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
