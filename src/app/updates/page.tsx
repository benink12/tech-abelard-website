import type { Metadata } from "next";
import Link from "next/link";
import { homeFontClassName } from "@/lib/fonts/home";

export const metadata: Metadata = {
  title: "Latest Updates",
  description: "News, releases, and what Tech Abélard is building next.",
  alternates: { canonical: "/updates" },
  // Placeholder page — no real posts yet. Kept out of the sitemap and out
  // of search results until there's substantive content to index.
  robots: { index: false, follow: true },
};

export default function UpdatesPage() {
  return (
    <div className={`home-concept ${homeFontClassName}`}>
      <section className="hc-section" style={{ paddingTop: "clamp(140px,20vh,180px)" }}>
        <div className="hc-wrap">
          <p className="hc-eyebrow">Updates</p>
          <h1 className="hc-h2" style={{ marginTop: 12 }}>
            Latest Updates
          </h1>
          <p className="hc-flatcard" style={{ marginTop: 24, maxWidth: "60ch", borderTopColor: "var(--hc-ink)" }}>
            This page is where we&apos;ll post news, releases, and what we&apos;re building next. Nothing to share
            yet — check back soon.
          </p>

          <Link href="/" className="hc-notfound__link" style={{ marginTop: 32, display: "inline-flex" }}>
            Back home <span className="hc-btn__arrow">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
