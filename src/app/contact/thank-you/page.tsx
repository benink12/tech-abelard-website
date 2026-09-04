import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { homeFontClassName } from "@/lib/fonts/home";
import { Button } from "@/components/ui/Button";
import { GoogleAdsConversion } from "@/components/analytics/GoogleAdsConversion";

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
    <div className={`home-concept ${homeFontClassName}`}>
      <section className="hc-section" style={{ paddingTop: "clamp(140px,20vh,200px)" }}>
        <GoogleAdsConversion />
        <div className="hc-wrap">
          <div role="status" className="mx-auto flex max-w-lg flex-col items-center text-center">
            <CheckCircle2 className="h-11 w-11" strokeWidth={1.5} style={{ color: "var(--oxblood)" }} />
            <h1 className="hc-h2" style={{ marginTop: 22 }}>
              Thank you — we received your request.
            </h1>
            <p className="hc-lede" style={{ marginTop: 14 }}>
              We&apos;ll get back to you shortly — usually within one business day.
            </p>
            <div className="hc-hero__ctas" style={{ justifyContent: "center" }}>
              <Button href="/" variant="ink" size="lg">
                Return to Homepage
              </Button>
              <Button href="/services" variant="outline" size="lg">
                Explore Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
