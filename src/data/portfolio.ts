// Naive .toLowerCase() turns "HVAC" into "hvac" mid-sentence, which reads
// as a typo rather than the acronym it is — used anywhere a niche appears
// in running prose (e.g. "capabilities for ___ businesses").
const LOWERCASE_EXCEPTIONS = new Set(["HVAC"]);
export function nicheInProse(niche: string): string {
  return LOWERCASE_EXCEPTIONS.has(niche) ? niche : niche.toLowerCase();
}

export interface PortfolioScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

// Card-level preview composition — how the DeviceMockup renders this
// project's screenshots.desktop[0]/mobile[0] (not a separate image
// reference: one screenshot, one way to frame it). Every field is optional
// with sensible defaults, so a new project can just supply `screenshots`
// and get a good-looking card for free; `preview` only exists for the rare
// case a project's specific composition needs a different crop/fit than
// the default.
export interface PortfolioPreviewConfig {
  /** "desktop-phone" (default, matches Aurelle) overlaps a phone frame on the desktop frame; "desktop-only" skips the phone frame entirely for projects with no useful mobile shot or a layout that doesn't suit the overlap. */
  layout?: "desktop-phone" | "desktop-only";
  /** "cover" (default) fills the frame, cropped; "contain" always shows the full screenshot letterboxed — use for a screenshot whose important content doesn't sit near the top edge. */
  desktopFit?: "cover" | "contain";
  /** CSS object-position for the desktop image. Default "top" — every captured homepage puts its nav/headline/CTA at the very top, so anchoring there (rather than centering) is what keeps those from being cropped. */
  desktopPosition?: string;
  mobilePosition?: string;
}

export type PortfolioProject = {
  slug: string;
  name: string;
  niche: string;
  tagline: string;
  description: string;
  highlights: string[];
  accent: string;
  icon: "flame" | "droplet" | "home" | "sparkles" | "building" | "paw-print";
  // Integration points — populate once each demo is deployed / before-after
  // assets exist. Left undefined renders the corresponding card action as
  // "Coming soon" rather than a dead link. The interactive demo itself is
  // never linked here (or anywhere else public) — see "Request Live
  // Access" / /showcase/access instead.
  liveUrl?: string;
  beforeAfterUrl?: string;

  // Real captured screenshots (local-preview only — see the note above).
  // Optional: projects without this fall back to the abstract DeviceMockup
  // (gradient + icon + browser/phone chrome) used for the original three.
  screenshots?: {
    desktop: PortfolioScreenshot[];
    mobile: PortfolioScreenshot[];
  };
  /** Fine-tunes how DeviceMockup frames screenshots.desktop[0]/mobile[0]. Omit to use the defaults (desktop-phone layout, cover fit, top position) — see PortfolioPreviewConfig. */
  preview?: PortfolioPreviewConfig;

  // Case-study page content (src/app/portfolio/[slug]/page.tsx).
  servicesDemonstrated: string[];
  challenge: string;
  designApproach: string;
  keyPages: string[];
  conversionFeatures: string[];
  seoStructure: string[];
  whatWedImprove: string[];
};

// Every project below is a concept build created to demonstrate Tech
// Abélard's own capabilities, not a completed client project — see each
// case study's disclosure and /showcase (private live showcase) for the
// interactive demo, gated behind Request Live Access.
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "aurelle-medspa",
    name: "Aurelle Medspa",
    niche: "Medspa",
    tagline: "Beauty, thoughtfully refined — with treatment discovery built in.",
    description:
      "A luxury medical-aesthetics concept blending editorial design, treatment discovery and a refined consultation experience.",
    highlights: [
      "Interactive Treatment Finder",
      "4-step consultation flow",
      "11 treatments across 4 categories",
      "Editorial luxury design system",
    ],
    accent: "#262626",
    icon: "sparkles",
    screenshots: {
      desktop: [
        { src: "/portfolio/aurelle/desktop-home.jpg", alt: "Aurelle Medspa desktop homepage hero", caption: "Homepage" },
        { src: "/portfolio/aurelle/desktop-treatments-grid.jpg", alt: "Aurelle Medspa desktop treatments grid with category filters", caption: "Treatments" },
        { src: "/portfolio/aurelle/desktop-finder.jpg", alt: "Aurelle Medspa desktop Treatment Finder concern selection", caption: "Treatment Finder" },
        { src: "/portfolio/aurelle/desktop-consultation.jpg", alt: "Aurelle Medspa desktop 4-step consultation wizard, step one", caption: "Consultation" },
      ],
      mobile: [
        { src: "/portfolio/aurelle/mobile-home.jpg", alt: "Aurelle Medspa mobile homepage hero", caption: "Homepage" },
        { src: "/portfolio/aurelle/mobile-treatments.jpg", alt: "Aurelle Medspa mobile treatments grid", caption: "Treatments" },
        { src: "/portfolio/aurelle/mobile-finder.jpg", alt: "Aurelle Medspa mobile Treatment Finder concern options", caption: "Treatment Finder" },
        { src: "/portfolio/aurelle/mobile-consultation.jpg", alt: "Aurelle Medspa mobile consultation wizard and FAQ", caption: "Consultation" },
      ],
    },
    servicesDemonstrated: ["Web Design", "UX Design", "Local SEO"],
    challenge:
      "Medical-aesthetic marketing has to sell a premium experience while staying honest about what a website can promise — no diagnosing a visitor's skin, no guaranteed outcomes, no treatment booked without a licensed provider's sign-off. Most medspa sites either read as generic beauty templates or overreach on medical claims to sound credible.",
    designApproach:
      "An editorial luxury system: warm ivory and charcoal, a serif display face paired with a restrained sans for body copy, botanical line-art used sparingly and always non-interactive (pointer-events: none), and alternating light/dark sections instead of one long scroll. Motion is deliberately restrained — content is visible by default and only progressively enhanced with a reveal animation, so nothing depends on JavaScript to be seen.",
    keyPages: ["Home", "Treatments", "Treatment Finder", "About", "Consultation", "Privacy policy", "Terms", "Medical disclaimer"],
    conversionFeatures: [
      "Interactive Treatment Finder that suggests categories to discuss at consultation — never a diagnosis",
      "4-step consultation wizard (Treatment Interest → Goals → Preferred Date → Contact) instead of one long form",
      "Sticky mobile consultation CTA bar with safe-area handling",
      "Treatment catalog filterable by Skin / Injectables / Body / Consultation",
    ],
    seoStructure: [
      "MedicalBusiness schema (JSON-LD) plus BreadcrumbList schema on every treatment page",
      "11 dedicated treatment detail pages instead of one generic services page",
      "sitemap.xml + robots.txt + dynamic OG image",
      "A dedicated Medical Disclaimer page for compliance-minded, educational-not-diagnostic content",
    ],
    whatWedImprove: [
      "Wire the consultation form to a real inbox or CRM instead of a stub",
      "Deploy to a real hosting environment — currently local-preview only",
      "Replace placeholder provider name and credentials with real, verified information before any real-world use",
      "Add real treatment and interior photography once a licensed practice is attached",
    ],
  },
  {
    slug: "northhaven-property-management",
    name: "Northhaven Property Management",
    niche: "Property Management",
    tagline: "Property management that feels like a platform, not a brochure.",
    description:
      "A large property-management concept featuring rental discovery, property detail experiences, owner tools and resident workflows.",
    highlights: [
      "20-listing rental inventory with filters",
      "Owner dashboard with portfolio metrics",
      "Resident portal with lease + payments",
      "Multi-step maintenance request flow",
    ],
    accent: "#151515",
    icon: "building",
    preview: { desktopPosition: "top left", mobilePosition: "top left" },
    screenshots: {
      desktop: [
        { src: "/portfolio/northhaven/desktop-home-1.jpg", alt: "Northhaven desktop homepage hero", caption: "Homepage" },
        { src: "/portfolio/northhaven/desktop-rentals.jpg", alt: "Northhaven desktop rentals browser with filters", caption: "Rentals" },
        { src: "/portfolio/northhaven/desktop-property.jpg", alt: "Northhaven desktop property detail photo gallery", caption: "Property detail" },
        { src: "/portfolio/northhaven/desktop-owner.jpg", alt: "Northhaven desktop owner dashboard with portfolio metrics", caption: "Owner dashboard" },
        { src: "/portfolio/northhaven/desktop-resident.jpg", alt: "Northhaven desktop resident portal with lease and messages", caption: "Resident portal" },
      ],
      mobile: [
        { src: "/portfolio/northhaven/mobile-home.jpg", alt: "Northhaven mobile homepage hero", caption: "Homepage" },
        { src: "/portfolio/northhaven/mobile-rentals.jpg", alt: "Northhaven mobile rentals browser", caption: "Rentals" },
        { src: "/portfolio/northhaven/mobile-property.jpg", alt: "Northhaven mobile property detail page", caption: "Property detail" },
        { src: "/portfolio/northhaven/mobile-owner.jpg", alt: "Northhaven mobile owner dashboard", caption: "Owner dashboard" },
      ],
    },
    servicesDemonstrated: ["Web Design", "Platform UX", "Conversion Optimization"],
    challenge:
      "Property-management sites usually stop at marketing brochure — a few photos, a contact form. But owners and residents need working tools: search real inventory, track rent and maintenance, submit requests. The challenge is making a marketing site and product-grade dashboards feel like one platform instead of a brochure with an admin panel bolted on.",
    designApproach:
      "A warm ivory-and-midnight palette with a serif display face for headlines and a clean sans for data-dense screens, editorial real-estate photography on the marketing pages, and dashboard components (stat tiles, tables, activity feeds) styled to match the rest of the site rather than defaulting to generic admin-panel UI. Owner and resident dashboards are clearly labeled as sample-data previews in both the UI and page metadata.",
    keyPages: [
      "Home",
      "Rentals",
      "Property detail",
      "Neighborhoods",
      "Owners",
      "Owner Dashboard (preview)",
      "Residents",
      "Resident Portal (preview)",
      "Maintenance Request",
      "Apply",
      "Schedule a Viewing",
      "About",
      "Contact",
      "FAQ",
    ],
    conversionFeatures: [
      "20-listing rental browser with neighborhood, property type, and price filters plus grid/list/map views",
      "Multi-step maintenance request flow (category → description → urgency → photos → entry access → contact)",
      "Separate Apply and Schedule a Viewing flows instead of routing everything through one contact form",
      "Owner and resident portals demonstrate real account-style UX using clearly labeled sample data",
    ],
    seoStructure: [
      "Per-page metadata (title/description) across every route, including dynamic property and neighborhood pages",
      "Dedicated /properties/[slug] and /neighborhoods/[slug] pages instead of one generic listings page",
      "Owner/resident dashboard pages labeled 'preview' in both UI and metadata to avoid indexing confusion",
    ],
    whatWedImprove: [
      "Add sitemap.xml, robots.txt, and JSON-LD schema (structured listing data) — not yet implemented on this concept",
      "Explicitly noindex the demo owner/resident dashboard routes",
      "Wire the application, contact, and maintenance forms to a real inbox or CRM instead of a stub",
      "Connect the owner/resident dashboards to real backend data instead of demo fixtures",
      "Deploy to a real hosting environment — currently local-preview only",
    ],
  },
  {
    slug: "northpaw-veterinary-hospital",
    name: "Northpaw Veterinary Hospital",
    niche: "Veterinary",
    tagline: "Care for every chapter of their life — with service discovery and a pet portal built in.",
    description:
      "A modern veterinary-hospital concept combining warm healthcare design, service discovery, appointment UX and a pet portal experience.",
    highlights: [
      "Interactive Pet Care Guide",
      "4-step appointment request flow",
      "9 services across 3 categories",
      "Concept Pet Portal dashboard",
    ],
    accent: "#2b2b2b",
    icon: "paw-print",
    screenshots: {
      desktop: [
        { src: "/portfolio/northpaw/desktop-home.jpg", alt: "Northpaw Veterinary Hospital desktop homepage hero", caption: "Homepage" },
        { src: "/portfolio/northpaw/desktop-services.jpg", alt: "Northpaw desktop services list with wellness, vaccination, and dental care", caption: "Services" },
        { src: "/portfolio/northpaw/desktop-pet-guide.jpg", alt: "Northpaw desktop “What Does Your Pet Need?” interactive guide, life stage step", caption: "Pet Care Guide" },
        { src: "/portfolio/northpaw/desktop-appointment.jpg", alt: "Northpaw desktop 4-step appointment request flow, pet type step", caption: "Appointment" },
        { src: "/portfolio/northpaw/desktop-portal.jpg", alt: "Northpaw desktop Pet Portal concept demo showing a sample pet profile and upcoming appointment", caption: "Pet Portal" },
      ],
      mobile: [
        { src: "/portfolio/northpaw/mobile-home.jpg", alt: "Northpaw mobile homepage hero", caption: "Homepage" },
        { src: "/portfolio/northpaw/mobile-services.jpg", alt: "Northpaw mobile services list", caption: "Services" },
        { src: "/portfolio/northpaw/mobile-pet-guide.jpg", alt: "Northpaw mobile “What Does Your Pet Need?” interactive guide", caption: "Pet Care Guide" },
        { src: "/portfolio/northpaw/mobile-appointment.jpg", alt: "Northpaw mobile appointment request flow, pet type step", caption: "Appointment" },
      ],
    },
    servicesDemonstrated: ["Web Design", "UX Design", "Local SEO"],
    challenge:
      "Veterinary sites tend to fall into one of two failure modes: a sterile, purely clinical brochure that feels cold to an anxious pet owner, or an overly cute pet-brand aesthetic that undersells the medical seriousness of the practice. Pet owners searching for a new vet also rarely know which of nine-plus services they actually need — most sites just dump a flat service list and leave that judgment call entirely to the visitor.",
    designApproach:
      "A healthcare-clean but pet-warm system — deep forest green, cobalt blue, and a clay/terracotta accent instead of the soft pastels most veterinary sites default to, paired with a slab-serif display face for a trustworthy, editorial feel. An interactive \"What Does Your Pet Need?\" guide replaces the flat service list, walking a pet owner through pet type, life stage, and reason for visit to surface relevant services — explicitly framed as informational, never diagnostic.",
    keyPages: [
      "Home",
      "Services",
      "New Patients",
      "Our Hospital",
      "Team",
      "Pet Resources",
      "FAQ",
      "Contact",
      "Request Appointment",
      "Emergency Info",
      "Pet Portal (concept demo)",
    ],
    conversionFeatures: [
      "Interactive \"What Does Your Pet Need?\" guide matching pet type, life stage, and reason for visit to relevant services",
      "4-step appointment request flow (Pet → Reason → Date → Owner Details) instead of one long form",
      "Sticky mobile action bar with Call and Request Appointment",
      "Dedicated Emergency Info page with a clear triage layout, separate from routine appointment requests",
    ],
    seoStructure: [
      "VeterinaryCare schema (JSON-LD) plus per-page metadata across every route",
      "9 dedicated service detail pages (/services/[slug]) instead of one generic services page",
      "sitemap.xml + robots.txt + dynamic OG image + app icon",
      "Clean lint, typecheck, and production build across 27 static routes",
    ],
    whatWedImprove: [
      "Wire the appointment request and contact forms to a real inbox or CRM instead of a stub",
      "Deploy to a real hosting environment — currently local-preview only",
      "Replace placeholder clinic name, address, and phone number with real, verified information before any real-world use",
      "Connect the Pet Portal to real backend data instead of demo fixtures",
    ],
  },
  {
    slug: "northpeak-roofing",
    name: "NorthPeak Roofing",
    niche: "Roofing",
    tagline: "A roofing brand built to survive a hailstorm of competitors.",
    description:
      "A premium, conversion-focused roofing concept with a dark architectural design, strong mobile experience, emergency-service messaging, insurance-claims support, and full SEO/schema foundations.",
    highlights: ["Full service + gallery architecture", "Insurance claims assistance section", "Before/after project gallery", "Storm-season urgency messaging"],
    accent: "#3a3a3a",
    icon: "home",
    screenshots: {
      desktop: [{ src: "/portfolio/northpeak-roofing/desktop-home.jpg", alt: "NorthPeak Roofing desktop homepage hero", caption: "Homepage" }],
      mobile: [{ src: "/portfolio/northpeak-roofing/mobile-home.jpg", alt: "NorthPeak Roofing mobile homepage hero", caption: "Homepage" }],
    },
    servicesDemonstrated: ["Web Design", "Local SEO", "Conversion Optimization"],
    challenge:
      "After a storm, a homeowner is comparing five roofing sites in ten minutes, often confused about what their insurance actually covers. A site that doesn't immediately address urgency and insurance clarity reads as just another contractor, not the obvious choice.",
    designApproach:
      "A premium, editorial dark design — full-bleed architectural photography, a serif wordmark, and a warm copper/brass accent against near-black backgrounds — built to feel like the higher-end option in the search results, backed by a real insurance-claims assistance section and an estimate flow that doesn't bury the phone number.",
    keyPages: ["Home", "Services", "Gallery", "FAQ", "About", "Contact", "Privacy policy", "Terms"],
    conversionFeatures: [
      "Emergency roof repair CTA",
      "Insurance claims assistance section",
      "Before/after project gallery with slider",
      "FAQ accordion + testimonials + trust bar",
    ],
    seoStructure: [
      "Full JSON-LD schema coverage, sitemap.xml + robots.txt + opengraph-image + icon + apple-icon",
      "6 real per-service pages (/services/[slug]) instead of one generic page",
      "21 static pages total, clean build and lint",
      "Mobile-first responsive layout, verified desktop + mobile",
    ],
    whatWedImprove: [
      "Remove the explicitly-fictional demo stats (16 yrs / 4,200 roofs / 4.9★ / 860 reviews) from JSON-LD's aggregateRating before any real launch — same issue flagged on the HVAC concept",
      "Wire the estimate form to a real inbox or CRM instead of a stub",
      "Deploy to a real hosting environment — currently local-preview only",
    ],
  },
  {
    slug: "northclimate-hvac",
    name: "NorthClimate HVAC",
    niche: "HVAC",
    tagline: "Comfort, sold with a live weather-driven call to action.",
    description:
      "A heating/cooling concept built around a real local-weather widget and emergency no-heat/no-cooling messaging, with financing, reviews, and full service-area coverage.",
    highlights: ["Real-time weather-driven CTA", "Financing calculator", "Before/after comparison slider", "Emergency service banner"],
    accent: "#0d0d0d",
    icon: "flame",
    screenshots: {
      desktop: [{ src: "/portfolio/northclimate-hvac/desktop-home.jpg", alt: "NorthClimate HVAC desktop homepage hero with live weather widget", caption: "Homepage" }],
      mobile: [{ src: "/portfolio/northclimate-hvac/mobile-home.jpg", alt: "NorthClimate HVAC mobile homepage hero", caption: "Homepage" }],
    },
    servicesDemonstrated: ["Web Design", "Local SEO", "Conversion Optimization"],
    challenge:
      "HVAC is a weather-triggered business — a customer with no heat in a cold snap searches and books within minutes. A generic \"contact us\" site misses that urgency entirely, and financing sticker-shock stalls a lot of otherwise-ready customers before they ever call.",
    designApproach:
      "A bright, modern utility-brand design (white background, navy typography) with a real Open-Meteo API weather widget used as a functional hero element, not decoration — the copy and CTA shift with actual local conditions. A financing calculator sits close to the estimate flow so cost becomes a conversation instead of an objection raised after the call.",
    keyPages: ["Home", "Services", "Financing", "Gallery", "Reviews", "FAQ", "Service areas", "About", "Contact"],
    conversionFeatures: [
      "Live local-weather widget driving a temperature-aware headline/CTA",
      "Financing calculator placed near the estimate flow",
      "Emergency no-heat/no-cooling banner",
      "Before/after photo gallery slider",
    ],
    seoStructure: [
      "HVACBusiness, Service, FAQPage, and BreadcrumbList schema (JSON-LD)",
      "sitemap.xml + robots.txt + dynamic OG image + app icon",
      "Dedicated service pages per offering",
      "FAQ page structured for featured-snippet eligibility",
    ],
    whatWedImprove: [
      "Remove the fabricated aggregateRating (4.9★/612 reviews) from JSON-LD before any real launch — reviews must be real, sourced ratings only",
      "Wire the estimate form to a real inbox or CRM instead of a stub",
      "Add aria-invalid states to the estimate form's fields",
      "Make the weather widget's coordinates configurable instead of hardcoded to one city",
    ],
  },
  {
    slug: "northline-plumbing",
    name: "NorthLine Plumbing & Drain",
    niche: "Plumbing",
    tagline: "A 24/7 emergency plumber that reads like the obvious call.",
    description:
      "A mobile-first plumbing concept designed to make emergency calls and quote requests easier — trust-forward design, same-day availability messaging, and a straightforward booking path.",
    highlights: ["Clear emergency call action", "Fast mobile navigation", "Local SEO structure", "Conversion-focused layout"],
    accent: "#454545",
    icon: "droplet",
    screenshots: {
      desktop: [{ src: "/portfolio/northline-plumbing/desktop-home.jpg", alt: "NorthLine Plumbing & Drain desktop homepage hero", caption: "Homepage" }],
      mobile: [{ src: "/portfolio/northline-plumbing/mobile-home.jpg", alt: "NorthLine Plumbing & Drain mobile homepage hero", caption: "Homepage" }],
    },
    servicesDemonstrated: ["Web Design", "Local SEO", "Mobile Optimization"],
    challenge:
      "A plumbing business loses jobs in the first five seconds on a phone: if a visitor can't find the call button or confirm \"yes, they cover my area,\" they call the next name in the search results instead.",
    designApproach:
      "A navy/blue, trust-forward corporate-service design built around a single job on every page: get the visitor to call or request a quote before they scroll past the fold. A sticky mobile call bar keeps the phone number one tap away on every screen, and service-area coverage is stated plainly rather than implied.",
    keyPages: ["Home", "Services", "Service areas", "About", "Contact", "Privacy policy", "Terms"],
    conversionFeatures: [
      "Sticky mobile call bar on every page",
      "Emergency + same-day service messaging above the fold",
      "Accessible, validated contact/request forms",
      "Service-area coverage page so visitors can self-qualify fast",
    ],
    seoStructure: [
      "LocalBusiness and Service schema (JSON-LD)",
      "Dedicated service pages instead of one generic services page",
      "sitemap.xml + robots.txt configured for indexing",
      "Fast, mobile-first Core Web Vitals baseline",
    ],
    whatWedImprove: [
      "Wire the request/contact forms to a real inbox or CRM instead of a stub",
      "Add BreadcrumbList schema alongside the existing Service schema",
      "Pull the business name into service-page schema from shared data instead of hardcoding it per page",
      "Add a dynamic OG image and app icon for link-preview polish",
    ],
  },
];
