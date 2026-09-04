import type { Metadata } from "next";
import { site } from "@/data/site";
import { homeFontClassName } from "@/lib/fonts/home";

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
    <div className={`home-concept ${homeFontClassName}`}>
      <section className="hc-section" style={{ paddingTop: "clamp(140px,20vh,180px)" }}>
        <div className="hc-wrap">
          <p className="hc-eyebrow">Legal</p>
          <h1 className="hc-h2" style={{ marginTop: 12 }}>
            Terms of Service
          </h1>
          <p className="hc-flatcard" style={{ marginTop: 24, maxWidth: "74ch", borderTopColor: "var(--hc-ink)" }}>
            This is a working draft written for launch and has not yet been reviewed by legal counsel. Have it
            reviewed before relying on it as a binding agreement.
          </p>

          <div className="hc-prose" style={{ marginTop: 8 }}>
            {sections.map((section) => (
              <div key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
