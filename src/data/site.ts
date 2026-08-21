// Tech Abélard's real agency identity — sourced from the vault's Brand Identity
// and Business Overview docs. `site.url` is the canonical production origin
// (live as of 2026-08-20) — every absolute URL the site emits (metadataBase,
// canonical tags, OG/Twitter, sitemap.ts, robots.ts, the ProfessionalService
// JSON-LD in layout.tsx) derives from this single value, so this is the only
// place that needs to change if the canonical domain ever does. Always use
// the www subdomain here, not the bare apex — the apex redirects to it.
//
// Business email — single source of truth. Verified 2026-07-23 as the Gmail
// account actually connected via Claude's Gmail connector (see chat history
// for how). Tech Abélard OS and the Client Portal each keep their own
// identical copy of these three constants at src/lib/business.ts (separate
// repos, no shared package) — update all three together if this ever
// changes, and re-verify the connected Gmail account before relying on it
// for real outreach.
export const BUSINESS_NAME = "Tech Abélard";
export const BUSINESS_EMAIL = "hellotechabelard@gmail.com";
export const BUSINESS_EMAIL_DISPLAY = `${BUSINESS_NAME} <${BUSINESS_EMAIL}>`;

export const site = {
  name: "Tech Abélard",
  shortName: "Abélard",
  tagline: "Websites that make the phone ring before the pitch does.",
  description:
    "Tech Abélard is a web design and local SEO agency for home service businesses — plumbers, roofers, HVAC companies, electricians, and the trades around them. We build sites that convert and rankings that compound.",
  url: "https://www.techabelard.com",
  email: BUSINESS_EMAIL,
  phone: {
    display: "(581) 499-0011",
    href: "tel:+15814990011",
  },
  social: {
    instagram: "https://instagram.com/techabelard",
    linkedin: "https://linkedin.com/company/techabelard",
  },
  calendlyUrl: "https://calendly.com/techabelard/discovery-call",
  nav: [
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "SEO", href: "/seo" },
    { label: "Pricing", href: "/pricing" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
  ] as const,
  footerColumns: [
    {
      title: "Agency",
      links: [
        { label: "Services", href: "/services" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Process", href: "/process" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Growth",
      links: [
        { label: "SEO", href: "/seo" },
        { label: "Pricing", href: "/pricing" },
        { label: "Free Website Audit", href: "/audit" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
  industries: [
    "Plumbing",
    "HVAC",
    "Roofing",
    "Electrical",
    "Landscaping",
    "Construction",
    "Tree Services",
    "Painting",
    "Concrete",
    "Cleaning",
    "Medspa / Aesthetic Wellness",
    "Property Management",
    "Veterinary / Animal Healthcare",
  ] as const,
  cta: {
    primary: "Book a Discovery Call",
    secondary: "See Our Work",
  },
} as const;
