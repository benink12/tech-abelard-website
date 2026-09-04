import type { Metadata } from "next";
import { AccessGateForm } from "./AccessGateForm";
import { homeFontClassName } from "@/lib/fonts/home";

// Never indexed — see src/app/robots.ts's disallow for the whole /showcase
// tree. This page itself is reachable (the "enter your code" step has to
// be), it just isn't meant to show up in search results.
export const metadata: Metadata = {
  title: "Private Showcase Access",
  robots: { index: false, follow: false },
};

export default function ShowcaseAccessPage() {
  return (
    <div className={`home-concept ${homeFontClassName}`}>
      <section className="flex min-h-[80vh] items-center hc-section">
        <div className="hc-wrap" style={{ maxWidth: 460 }}>
          <p className="hc-eyebrow" style={{ textAlign: "center" }}>
            Private Preview
          </p>
          <h1 className="hc-h2" style={{ textAlign: "center", marginTop: 12 }}>
            Tech Abélard Private Showcase
          </h1>
          <p className="hc-lede" style={{ textAlign: "center", margin: "12px auto 0" }}>
            Enter the business email and access code from your approval email to view the interactive demo you
            requested.
          </p>
          <div className="mt-10">
            <AccessGateForm />
          </div>
        </div>
      </section>
    </div>
  );
}
