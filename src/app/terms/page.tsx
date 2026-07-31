import type { Metadata } from "next";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing engagements, payments, and website use for Tech Abélard clients.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "Engagements",
    body: "Project scope, timelines, and deliverables for any website, SEO, or care engagement are confirmed in a written proposal or contract before work begins. This page governs general site use; a signed agreement governs the specifics of any paid engagement.",
  },
  {
    title: "Payment terms",
    body: "One-time projects require a 50% deposit to begin, with the remaining 50% due on delivery. Retainers (SEO, Website Care) bill monthly in advance. Invoices are due within 7 days; accounts more than 30 days late accrue 1.5% monthly interest.",
  },
  {
    title: "Intellectual property",
    body: "Full rights to final website files, copy, and design assets transfer to the client upon final payment. Stock imagery remains subject to its original license terms.",
  },
  {
    title: "Cancellation",
    body: "One-time projects may be cancelled before completion; work performed to date is billed at the agreed rate. Retainers may be cancelled with 30 days' written notice — no long-term contract is required.",
  },
  {
    title: "Website use",
    body: "This website and its contents are provided for informational purposes. You may not copy, resell, or misrepresent the content on this site as your own.",
  },
  {
    title: "Contact",
    body: `Questions about these terms can be directed to ${site.email}.`,
  },
];

export default function TermsPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-ink">Legal</p>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">Terms of Service</h1>
        <p className="mt-5 rounded-2xl border border-ink/10 bg-cream-card px-5 py-4 text-sm leading-relaxed text-ink/55">
          This is a working draft written for launch and has not yet been reviewed by legal counsel.
          Have it reviewed before relying on it as a binding agreement.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-lg font-medium text-ink">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{section.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
