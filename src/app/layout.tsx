import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTABar } from "@/components/layout/MobileCTABar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full`}>
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
        <Header />
        <main
          id="main-content"
          className="flex-1 pb-[calc(4.8125rem+env(safe-area-inset-bottom)+1rem)] xl:pb-0"
        >
          {children}
        </main>
        <Footer />
        <MobileCTABar />
      </body>
    </html>
  );
}
