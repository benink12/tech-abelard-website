export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  deliverables: string[];
  icon: "layout" | "search" | "map-pin" | "shield-check" | "panel-top" | "gauge" | "phone";
};

export const services: Service[] = [
  {
    slug: "web-design",
    name: "Web Design",
    shortDescription: "Custom sites built to convert, not just exist.",
    description:
      "A fully custom site — not a page builder theme with your logo dropped in. Every page is designed around one job: turning a visitor who found you on their phone into a call, a form fill, or a booked estimate.",
    deliverables: [
      "Fully custom, art-directed design — no template feel",
      "Mobile-first UX with sticky call-to-action patterns",
      "Conversion-focused service and location pages",
      "Client-editable CMS on Professional and Premium tiers",
    ],
    icon: "layout",
  },
  {
    slug: "seo",
    name: "Local SEO",
    shortDescription: "Local rankings that compound month over month.",
    description:
      "Local SEO is compounding proof to Google that you're the real, active, trustworthy answer to \"best [service] near me.\" We run monthly retainers built around technical fixes, content, citations, and review generation — not a one-time audit and a promise.",
    deliverables: [
      "Local keyword research and search-intent mapping",
      "Technical SEO audits and continuous fixes",
      "Monthly content and internal linking",
      "Ranking + traffic reporting you can actually read",
    ],
    icon: "search",
  },
  {
    slug: "ai-receptionists",
    name: "AI Receptionists",
    shortDescription: "Never miss a call, even after hours.",
    description:
      "AI receptionists that answer calls, qualify leads, answer common questions, help book appointments, and hand callers off to a real person when needed.",
    deliverables: [
      "Answers calls in a natural, on-brand voice",
      "Qualifies leads and collects the details you need",
      "Answers common questions automatically",
      "Books appointments and transfers to a real person when needed",
    ],
    icon: "phone",
  },
  {
    slug: "google-business-profile",
    name: "Google Business Profile",
    shortDescription: "The listing that wins the local map pack.",
    description:
      "Your Google Business Profile is often the first thing a customer sees — before your homepage loads. We claim, clean up, and actively manage it so it earns the local-pack visibility your reviews and reputation have already paid for.",
    deliverables: [
      "Full claim, verification, and category audit",
      "Profile fill-out: hours, service areas, attributes",
      "Weekly posts, Q&A seeding, review-response management",
      "Duplicate-listing cleanup",
    ],
    icon: "map-pin",
  },
  {
    slug: "website-care",
    name: "Website Care",
    shortDescription: "Ongoing maintenance so nothing quietly breaks.",
    description:
      "A website is infrastructure, not a one-time purchase. Care plans keep it backed up, patched, monitored, and current — with real content-edit hours included, so small updates don't wait on a developer's schedule.",
    deliverables: [
      "Managed hosting, security patching, uptime monitoring",
      "Automated backups with defined retention",
      "Monthly Core Web Vitals checks",
      "Included content-edit hours every month",
    ],
    icon: "shield-check",
  },
  {
    slug: "landing-pages",
    name: "Landing Pages",
    shortDescription: "Single-purpose pages for a single campaign goal.",
    description:
      "For a seasonal promotion, a new service area, or a paid ad campaign — a landing page built around one offer and one action, with none of the navigation friction of a full site.",
    deliverables: [
      "Single-offer, single-CTA page architecture",
      "Built for paid traffic — fast load, no distractions",
      "A/B-ready structure for headline and offer testing",
      "Conversion tracking wired in from day one",
    ],
    icon: "panel-top",
  },
  {
    slug: "performance-optimization",
    name: "Performance Optimization",
    shortDescription: "Fast on a job-site phone with two bars of signal.",
    description:
      "Your customer is standing in front of a leaking pipe, not on fiber internet. We tune Core Web Vitals, image delivery, and caching so the site loads fast on the exact conditions your real customers are searching from.",
    deliverables: [
      "Core Web Vitals tuning (LCP, CLS, INP)",
      "Next-gen image formats and lazy loading",
      "Caching and CDN configuration",
      "Ongoing monitoring on Professional and Premium tiers",
    ],
    icon: "gauge",
  },
];
