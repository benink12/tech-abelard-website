export type SeoPillar = {
  name: string;
  description: string;
  points: string[];
  icon: "map-pin" | "search-check" | "code" | "file-text" | "bar-chart";
};

export const seoPillars: SeoPillar[] = [
  {
    name: "Local SEO",
    description:
      "Ranking for \"[service] near me\" and every city you actually serve — not just your home base.",
    points: [
      "Local keyword research mapped to real search intent",
      "Location and service-area landing pages",
      "Citation building across top local directories",
    ],
    icon: "map-pin",
  },
  {
    name: "Google Business Profile",
    description: "Often the first thing a customer sees, before your homepage even loads.",
    points: [
      "Full claim, verification, and category audit",
      "Weekly posts, Q&A seeding, review-response management",
      "Photo refresh and duplicate-listing cleanup",
    ],
    icon: "search-check",
  },
  {
    name: "Technical SEO",
    description: "The infrastructure Google actually crawls — invisible to visitors, decisive for rank.",
    points: [
      "Core Web Vitals and page-speed tuning",
      "Schema markup: LocalBusiness, Service, FAQ, Breadcrumb",
      "Sitemap, robots, canonical URL hygiene",
    ],
    icon: "code",
  },
  {
    name: "Content",
    description: "Monthly content that targets the terms your customers actually type.",
    points: [
      "Service and location pages built to rank, not just exist",
      "Blog / resource content mapped to buyer questions",
      "Internal linking passes every month",
    ],
    icon: "file-text",
  },
  {
    name: "Monthly Reporting",
    description: "Rankings and traffic reported in numbers you can read without a decoder ring.",
    points: [
      "Ranking position tracking for target keywords",
      "Traffic, calls, and form-fill attribution",
      "A strategy call to plan next month's priorities",
    ],
    icon: "bar-chart",
  },
];
