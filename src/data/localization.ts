// Single source of truth for country-based localization (Canada / Burundi /
// International). Drives currency, pricing, and backend SEO/geo signals only
// — every visitor-facing string below is intentionally identical across
// regions so the public site never announces which country it thinks the
// visitor is in (see src/lib/region.ts and src/proxy.ts for the detection
// itself). Add new visitor-facing strings here, keyed by Region, rather than
// hardcoding a country check somewhere in a component — just keep the copy
// itself region-neutral.

export type Region = "canada" | "burundi" | "international";

export const REGION_COOKIE = "ta_region";
export const DEFAULT_REGION: Region = "international";

export interface RegionCopy {
  heroEyebrow: string;
  regionalStatement: string;
  siteDescription: string;
  footerStatement: string;
  industriesHeading: string;
  ogImageSubtitle: string;
  aboutWhoWeServeDescription: string;
  aboutBeliefDescription: string;
  faqAudienceAnswer: string;
  metadataKeywords: string[];
  ogLocale: string;
  pageDescriptions: {
    about: string;
    contact: string;
    pricing: string;
    services: string;
  };
  jsonLd: {
    countryName: string | null;
    addressCountry: string | null;
  };
  pricingCurrency: "CAD" | "USD";
  pricingNote: string;
}

export const regionCopy: Record<Region, RegionCopy> = {
  canada: {
    heroEyebrow: "Web Design & Local SEO for Home Service Businesses",
    regionalStatement:
      "Become the web design and local SEO partner of choice for home service businesses — by being the best at one thing first.",
    siteDescription:
      "Tech Abélard is a web design and local SEO agency for home service businesses — plumbers, roofers, HVAC companies, electricians, and the trades around them. We build sites that convert and rankings that compound.",
    footerStatement: "Built for ambitious businesses ready to grow online.",
    industriesHeading: "Built for home service industries everywhere",
    ogImageSubtitle: "Web Design & Local SEO for Home Service Businesses",
    aboutWhoWeServeDescription:
      "Plumbing, HVAC, roofing, electrical, landscaping, construction, tree services, painting, concrete, and cleaning companies.",
    aboutBeliefDescription:
      "We build exclusively for home service businesses. That focus means less time explaining your customer's decision to us, and more time on the parts that actually move rank and revenue.",
    faqAudienceAnswer:
      "Home service businesses — plumbing, HVAC, roofing, electrical, landscaping, construction, tree services, painting, concrete, and cleaning companies. That focus means we already understand your customer's decision, not just your industry.",
    metadataKeywords: [
      "web design agency Canada",
      "local SEO agency",
      "home service business website design",
      "plumber website design",
      "HVAC website design",
      "roofing company website design",
      "Google Business Profile optimization",
    ],
    ogLocale: "en_CA",
    pageDescriptions: {
      about:
        "Tech Abélard is a web design and local SEO agency built exclusively for home service businesses — plumbers, roofers, and HVAC companies.",
      contact:
        "Book a discovery call or send a message to Tech Abélard — a web design and local SEO agency for home service businesses.",
      pricing:
        "Real pricing for premium web design, local SEO, and website care for home service businesses — Essential, Professional, and Premium tiers.",
      services:
        "Web design, local SEO, Google Business Profile management, website care, landing pages, and performance optimization for home service businesses.",
    },
    jsonLd: { countryName: "Canada", addressCountry: "CA" },
    // All tier/bundle numerals in src/data/pricing.ts are plain USD figures
    // with no FX conversion logic anywhere in the app — labeling them "CAD"
    // here would relabel a USD number as a currency it was never converted
    // into. Show USD to every region until real conversion is built; see
    // LAUNCH_AUDIT.md Phase 8 for the decision this is standing in for.
    pricingCurrency: "USD",
    pricingNote:
      "All prices in USD, starting at, one-time unless noted. Final quote is confirmed after a short scope call — the factors that shift scope (service areas, existing photography, content readiness) take five minutes to walk through.",
  },
  burundi: {
    heroEyebrow: "Web Design & Local SEO for Home Service Businesses",
    regionalStatement:
      "Become the web design and local SEO partner of choice for home service businesses — by being the best at one thing first.",
    siteDescription:
      "Tech Abélard is a web design and local SEO agency for home service businesses — plumbers, roofers, HVAC companies, electricians, and the trades around them. We build sites that convert and rankings that compound.",
    footerStatement: "Built for ambitious businesses ready to grow online.",
    industriesHeading: "Built for home service industries everywhere",
    ogImageSubtitle: "Web Design & Local SEO for Home Service Businesses",
    aboutWhoWeServeDescription:
      "Plumbing, HVAC, roofing, electrical, landscaping, construction, tree services, painting, concrete, and cleaning companies.",
    aboutBeliefDescription:
      "We build exclusively for home service businesses. That focus means less time explaining your customer's decision to us, and more time on the parts that actually move rank and revenue.",
    faqAudienceAnswer:
      "Home service businesses — plumbing, HVAC, roofing, electrical, landscaping, construction, tree services, painting, concrete, and cleaning companies. That focus means we already understand your customer's decision, not just your industry.",
    metadataKeywords: [
      "web design Burundi",
      "website designer Burundi",
      "SEO Burundi",
      "web development Bujumbura",
      "local SEO agency",
      "home service business website design",
      "Google Business Profile optimization",
    ],
    ogLocale: "en_BI",
    pageDescriptions: {
      about:
        "Tech Abélard is a web design and local SEO agency built exclusively for home service businesses — plumbers, roofers, and HVAC companies.",
      contact:
        "Book a discovery call or send a message to Tech Abélard — a web design and local SEO agency for home service businesses.",
      pricing:
        "Real pricing for premium web design, local SEO, and website care for home service businesses — Essential, Professional, and Premium tiers.",
      services:
        "Web design, local SEO, Google Business Profile management, website care, landing pages, and performance optimization for home service businesses.",
    },
    jsonLd: { countryName: "Burundi", addressCountry: "BI" },
    pricingCurrency: "USD",
    pricingNote:
      "All prices in USD, starting at, one-time unless noted. Final quote is confirmed after a short scope call — the factors that shift scope (service areas, existing photography, content readiness) take five minutes to walk through.",
  },
  international: {
    heroEyebrow: "Web Design & Local SEO for Home Service Businesses",
    regionalStatement:
      "Become the web design and local SEO partner of choice for home service businesses — by being the best at one thing first.",
    siteDescription:
      "Tech Abélard is a web design and local SEO agency for home service businesses — plumbers, roofers, HVAC companies, electricians, and the trades around them. We build sites that convert and rankings that compound.",
    footerStatement: "Built for ambitious businesses ready to grow online.",
    industriesHeading: "Built for home service industries everywhere",
    ogImageSubtitle: "Web Design & Local SEO for Home Service Businesses",
    aboutWhoWeServeDescription:
      "Plumbing, HVAC, roofing, electrical, landscaping, construction, tree services, painting, concrete, and cleaning companies.",
    aboutBeliefDescription:
      "We build exclusively for home service businesses. That focus means less time explaining your customer's decision to us, and more time on the parts that actually move rank and revenue.",
    faqAudienceAnswer:
      "Home service businesses — plumbing, HVAC, roofing, electrical, landscaping, construction, tree services, painting, concrete, and cleaning companies. That focus means we already understand your customer's decision, not just your industry.",
    metadataKeywords: [
      "web design agency",
      "local SEO agency",
      "home service business website design",
      "plumber website design",
      "HVAC website design",
      "roofing company website design",
      "Google Business Profile optimization",
    ],
    ogLocale: "en_US",
    pageDescriptions: {
      about:
        "Tech Abélard is a web design and local SEO agency built exclusively for home service businesses — plumbers, roofers, and HVAC companies.",
      contact:
        "Book a discovery call or send a message to Tech Abélard — a web design and local SEO agency for home service businesses.",
      pricing:
        "Real pricing for premium web design, local SEO, and website care for home service businesses — Essential, Professional, and Premium tiers.",
      services:
        "Web design, local SEO, Google Business Profile management, website care, landing pages, and performance optimization for home service businesses.",
    },
    jsonLd: { countryName: null, addressCountry: null },
    pricingCurrency: "USD",
    pricingNote:
      "All prices in USD, starting at, one-time unless noted. Final quote is confirmed after a short scope call — the factors that shift scope (service areas, existing photography, content readiness) take five minutes to walk through.",
  },
};

export function isRegion(value: string | undefined | null): value is Region {
  return value === "canada" || value === "burundi" || value === "international";
}
