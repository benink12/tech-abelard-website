import type { Metadata } from "next";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Tech Abélard collects, uses, and protects information submitted through this website.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "Information we collect",
    body: "When you submit the contact form, book a discovery call, or email us directly, we collect the information you provide — your name, email, phone number, business name, and project details.",
  },
  {
    title: "How we use your information",
    body: "Information submitted through this site is used solely to respond to your inquiry, schedule a discovery call, and prepare a proposal or quote for the services you've asked about.",
  },
  {
    title: "Information sharing",
    body: "We do not sell your personal information. It may be shared with the tools we use to run the business (email, CRM, scheduling) solely to deliver the service you've requested, or as required by law.",
  },
  {
    title: "Cookies & analytics",
    body: "This site may use privacy-respecting analytics to understand aggregate traffic patterns. No information collected is used to build advertising profiles.",
  },
  {
    title: "Data retention",
    body: "Contact and project information is retained for as long as reasonably necessary to service an active or prospective client relationship, or as required for our own tax and business records.",
  },
  {
    title: "Contact us",
    body: `Questions about this policy can be directed to ${site.email}.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-ink">Legal</p>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">Privacy Policy</h1>
        <p className="mt-5 rounded-2xl border border-ink/10 bg-cream-card px-5 py-4 text-sm leading-relaxed text-ink/55">
          This is a working draft written for launch and has not yet been reviewed by legal counsel.
          Have it reviewed before relying on it for compliance purposes (e.g. PIPEDA).
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
