export type PortfolioProject = {
  slug: string;
  name: string;
  niche: string;
  tagline: string;
  description: string;
  highlights: string[];
  accent: string;
  icon: "flame" | "droplet" | "home";
  // Integration points — populate once each demo is deployed / a case study
  // is written / before-after assets exist. Left undefined renders the
  // corresponding card action as "Coming soon" rather than a dead link.
  liveUrl?: string;
  caseStudyUrl?: string;
  beforeAfterUrl?: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "northline-plumbing",
    name: "NorthLine Plumbing & Drain",
    niche: "Plumbing",
    tagline: "A 24/7 emergency plumber that reads like the obvious call.",
    description:
      "A Next.js 16 build with full local SEO scaffolding — LocalBusiness and Service schema, per-service landing pages, and a sticky mobile call bar built for someone standing over a leaking pipe.",
    highlights: ["10 dedicated service pages", "JSON-LD Service + FAQ schema", "Multi-step request form"],
    accent: "#2C4A5E",
    icon: "droplet",
  },
  {
    slug: "northclimate-hvac",
    name: "NorthClimate HVAC",
    niche: "HVAC",
    tagline: "Comfort, sold with a live weather-driven call to action.",
    description:
      "Ontario's Greater Golden Horseshoe HVAC demo — a real (not fake) live weather widget drives a temperature-aware CTA, alongside a financing calculator and before/after gallery slider.",
    highlights: ["Real-time weather-driven CTA", "Financing calculator", "Before/after comparison slider"],
    accent: "#0B0D10",
    icon: "flame",
  },
  {
    slug: "northpeak-roofing",
    name: "NorthPeak Roofing",
    niche: "Roofing",
    tagline: "A roofing brand built to survive a hailstorm of competitors.",
    description:
      "The newest build in the showcase set — full route architecture for services, gallery, and FAQ, built on the same design-system primitives as the other two demos for a consistent, fast foundation.",
    highlights: ["Full service + gallery architecture", "Shared design-system primitives", "Built for storm-season urgency"],
    accent: "#4A3728",
    icon: "home",
  },
];
