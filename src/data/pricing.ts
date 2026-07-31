// Real, finalized Tech Abélard pricing — mirrors the agency's internal pricing
// system (Website Packages / SEO Packages / Website Care Plans / Bundles).
// These are not placeholders and should not be invented or rounded elsewhere
// in the codebase — this file is the single integration point for THIS app.
// If the internal pricing system changes, update the values here and every
// page that renders pricing stays in sync automatically.
//
// Cross-repo source of truth: Tech Abélard OS is a separate Next.js app/repo
// with its own copy at ../../../Tech Abelard OS/src/data/pricing.ts (used by
// the SEO Audit Generator's package recommendations and the proposal
// generator). The two repos aren't in a shared monorepo, so there is no
// single importable module across both — this file is upstream; that one's
// header comment says it mirrors this one. When a price changes, update it
// here FIRST, then copy the same value into the OS copy. Both files must
// always hold identical numbers for websitePackages/seoPackages/carePlans.
//
// Bundle prices are derived from the package/SEO/care prices below at a
// 15–17% discount vs. buying each piece separately (see the math next to
// each bundle) — recompute them here if any component price changes.

// Required wherever a price from this file is shown to a visitor.
export const pricingDisclaimer = "Starting at the listed price. Final pricing depends on project scope and requirements.";

export type PricingTier = {
  name: string;
  price: string;
  cadence?: string;
  featured?: boolean;
  bestFor: string;
  features: string[];
};

export const websitePackages: PricingTier[] = [
  {
    name: "Essential",
    price: "$1,190",
    bestFor: "Ideal for businesses launching their first premium online presence.",
    features: [
      "Up to 5 custom pages",
      "Fully responsive design",
      "Mobile optimization",
      "Contact form",
      "Google Maps integration",
      "Basic on-page SEO",
      "Speed optimization",
      "Social media integration",
      "SSL ready",
      "30 days of post-launch support",
    ],
  },
  {
    name: "Professional",
    price: "$2,390",
    featured: true,
    bestFor: "Designed for growing businesses that want more leads and stronger online visibility.",
    features: [
      "Everything in Essential, plus:",
      "Up to 10 custom pages",
      "Premium custom UI/UX",
      "Advanced animations",
      "Local SEO setup",
      "Google Business Profile optimization",
      "Blog setup",
      "Conversion-focused landing pages",
      "Image optimization",
      "Performance optimization",
      "60 days of support",
    ],
  },
  {
    name: "Premium",
    price: "$4,390",
    bestFor: "Built for businesses that want a complete digital presence and long-term growth.",
    features: [
      "Everything in Professional, plus:",
      "Unlimited core pages",
      "Advanced custom functionality",
      "Multi-location support",
      "Advanced SEO foundation",
      "Priority development",
      "Content management training",
      "Quarterly strategy consultation",
      "Priority support for 90 days",
    ],
  },
];

export const seoPackages: PricingTier[] = [
  {
    name: "Essential",
    price: "$390",
    cadence: "/mo",
    bestFor: "Real local visibility for a business that's ready to stop relying on word of mouth alone.",
    features: [
      "Local keyword research & rank tracking",
      "Monthly on-page SEO optimization",
      "Google Business Profile management",
      "Local citation building",
      "Monthly performance report",
    ],
  },
  {
    name: "Growth",
    price: "$690",
    cadence: "/mo",
    featured: true,
    bestFor: "For businesses ready to actively outrank named competitors and turn search visibility into a steady flow of qualified leads.",
    features: [
      "Everything in Essential, plus:",
      "Expanded keyword targeting",
      "Bi-weekly content optimization",
      "Increased local citation building",
      "Competitor tracking",
      "Monthly strategy call",
    ],
  },
  {
    name: "Dominance",
    price: "$1,190",
    cadence: "/mo",
    bestFor: "For businesses that want to own their market — ranking for every service and every location that matters.",
    features: [
      "Everything in Growth, plus:",
      "Multi-location SEO management",
      "Weekly content & optimization",
      "Advanced technical SEO monitoring",
      "Priority strategist support",
      "Bi-weekly strategy calls",
    ],
  },
];

export const carePlans: PricingTier[] = [
  {
    name: "Essential Care",
    price: "$79",
    cadence: "/mo",
    bestFor: "A site that just needs to stay safe, online, and current.",
    features: [
      "Managed hosting + security updates",
      "Monthly automated backups",
      "Uptime monitoring",
      "Up to 30 min/mo of content edits",
    ],
  },
  {
    name: "Growth Care",
    price: "$149",
    cadence: "/mo",
    featured: true,
    bestFor: "A growing business making regular updates that wants proactive attention.",
    features: [
      "Everything in Essential Care, plus:",
      "Weekly security scans",
      "Priority backup retention",
      "Performance monitoring",
      "Up to 2 hrs/mo of content edits",
    ],
  },
  {
    name: "Premium Care",
    price: "$249",
    cadence: "/mo",
    bestFor: "A revenue-critical site that can't afford downtime or drift.",
    features: [
      "Everything in Growth Care, plus:",
      "Same-day emergency support",
      "Staging environment for safe changes",
      "Full monthly health report",
      "Up to 5 hrs/mo of content edits",
    ],
  },
];

export type Bundle = {
  name: string;
  price: string;
  standaloneValue: string;
  savings: string;
  featured?: boolean;
  includes: string[];
  bestFor: string;
};

export const bundles: Bundle[] = [
  {
    // Essential Website $1,190 + GBP Setup $597 + Essential Care x3 ($237) = $2,024 standalone
    name: "Launch Bundle",
    price: "$1,720",
    standaloneValue: "$2,024",
    savings: "Save $304 (~15%)",
    bestFor: "Businesses starting from zero — no site, no local visibility.",
    includes: ["Essential Website", "GBP One-Time Setup", "Essential Care — first 3 months"],
  },
  {
    // Professional Website $2,390 + Growth SEO x3 ($2,070) + Growth Care x3 ($447) = $4,907 standalone
    name: "Growth Bundle",
    price: "$4,120",
    standaloneValue: "$4,907",
    savings: "Save $787 (~16%)",
    featured: true,
    bestFor: "Established businesses ready to take real market share.",
    includes: ["Professional Website", "Growth SEO — first 3 months", "Growth Care — first 3 months"],
  },
  {
    // Premium Website $4,390 + Dominance SEO x3 ($3,570) + Premium Care x3 ($747) = $8,707 standalone
    name: "Market Leader Bundle",
    price: "$7,230",
    standaloneValue: "$8,707",
    savings: "Save $1,477 (~17%)",
    bestFor: "Businesses that want to own their category outright.",
    includes: ["Premium Website", "Dominance SEO — first 3 months", "Premium Care — first 3 months"],
  },
];

export const gbpPricing = {
  setup: "$597",
  setupNote: "one-time setup & optimization",
  monthly: "$297",
  monthlyNote: "/mo ongoing management (standalone clients — included free in every SEO retainer)",
};

export const pricingNote =
  "All prices in CAD, starting at, one-time unless noted. Final quote is confirmed after a short scope call — the factors that shift scope (service areas, existing photography, content readiness) take five minutes to walk through.";
