import type { Metadata } from "next";
import { site } from "@/data/site";
import { homeFontClassName } from "@/lib/fonts/home";

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
    <div className={`home-concept ${homeFontClassName}`}>
      <section className="hc-section" style={{ paddingTop: "clamp(140px,20vh,180px)" }}>
        <div className="hc-wrap">
          <p className="hc-eyebrow">Legal</p>
          <h1 className="hc-h2" style={{ marginTop: 12 }}>
            Privacy Policy
          </h1>
          <p className="hc-flatcard" style={{ marginTop: 24, maxWidth: "74ch", borderTopColor: "var(--hc-ink)" }}>
            This is a working draft written for launch and has not yet been reviewed by legal counsel. Have it
            reviewed before relying on it for compliance purposes (e.g. PIPEDA).
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
