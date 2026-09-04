import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import "@/styles/home.css";
import { site } from "@/data/site";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { homeFontClassName } from "@/lib/fonts/home";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeFooter } from "@/components/home/HomeFooter";

// Google tag (gtag.js) — GA4 measurement ID. Loaded site-wide via
// @next/third-parties/google's GoogleAnalytics component, the Next.js-
// recommended way to add gtag.js (see node_modules/next/dist/docs/01-app/
// 02-guides/third-party-libraries.md): it injects the script after
// hydration with the correct loading strategy, rather than a raw <script>
// tag pasted into the layout.
const GA_MEASUREMENT_ID = "G-CW6ZC7PJ4W";

// Site-wide type system. Reference: tinywins.com, inspected via computed
// styles — every weight of their body copy and display type is a single
// commercial/licensed family ("suisseIntl", Swiss Typefaces), which we
// can't ship. Inter is the closest fully free (SIL OFL, Google Fonts)
// neo-grotesque with comparable metrics, used here as one family for both
// body and display — matching the one-typeface-multiple-weights structure
// their site actually uses, not our previous two-family (Instrument Sans +
// Bricolage Grotesque) pairing. Variable names kept as --font-body/
// --font-display-face since nothing outside this file and globals.css's
// `--font-sans`/`--font-display` mapping ever references the font-loader
// variable names directly.
const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500"],
});

const displayFont = Inter({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
  // 400 added for the hero statement — see .hc-h1 in home.css, which now
  // renders at genuinely regular weight rather than a browser-synthesized
  // "fake bold" fallback.
  weight: ["400", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const region = await getRegion();
  const copy = regionCopy[region];

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} | ${site.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: copy.siteDescription,
    keywords: copy.metadataKeywords,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.name,
      description: copy.siteDescription,
      locale: copy.ogLocale,
      url: site.url,
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: copy.siteDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const region = await getRegion();
  const copy = regionCopy[region];

  const professionalServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: copy.siteDescription,
    email: site.email,
    telephone: site.phone.display,
    url: site.url,
    ...(copy.jsonLd.countryName && copy.jsonLd.addressCountry
      ? {
          areaServed: {
            "@type": "Country",
            name: copy.jsonLd.countryName,
          },
          address: {
            "@type": "PostalAddress",
            addressCountry: copy.jsonLd.addressCountry,
          },
        }
      : {}),
    sameAs: [site.social.instagram, site.social.linkedin],
    priceRange: "$$",
  };

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-cream text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cream"
        >
          Skip to main content
        </a>
        {/* HomeHeader/HomeFooter are each wrapped in their own small
            .home-concept-scoped div — deliberately NOT wrapping <main> — so
            their hc-* variables/reset apply only to the chrome. Wrapping the
            whole body would leak `.home-concept :where(a){color:inherit}`
            onto every other page's Tailwind-styled buttons/links, the same
            invisible-button-text bug already fixed twice on the homepage
            itself (see HomeFinalCTA/HomeFooter history). */}
        <div className={`home-concept ${homeFontClassName}`}>
          <HomeHeader />
        </div>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <div className={`home-concept ${homeFontClassName}`}>
          <HomeFooter />
        </div>
      </body>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
