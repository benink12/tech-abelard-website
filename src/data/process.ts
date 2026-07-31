export type ProcessStep = {
  number: string;
  name: string;
  duration: string;
  description: string;
  details: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    name: "Discovery",
    duration: "Week 1",
    description:
      "A short scope call — not a sales pitch. We confirm service areas, existing content and photography, competitors you actually lose bids to, and which tier fits the business you have today.",
    details: ["Scope call", "Competitor & keyword baseline", "Content and photo audit"],
  },
  {
    number: "02",
    name: "Strategy",
    duration: "Week 1–2",
    description:
      "Before a single pixel is designed, we map the site's structure around how your customers actually search — which pages exist, what each one has to prove, and how SEO and conversion architecture reinforce each other.",
    details: ["Sitemap & information architecture", "Keyword-to-page mapping", "Conversion path planning"],
  },
  {
    number: "03",
    name: "Design",
    duration: "Week 2–4",
    description:
      "Fully custom, art-directed design — never a theme with your logo dropped in. Every layout is built around your brand and your customer's decision, then reviewed with you before a line of code ships.",
    details: ["Custom UI design, no templates", "Mobile-first art direction", "Structured revision rounds"],
  },
  {
    number: "04",
    name: "Development",
    duration: "Week 3–8",
    description:
      "Built on modern, production-grade infrastructure — fast by default, not optimized after the fact. Schema, forms, and integrations get wired in during the build, not bolted on afterward.",
    details: ["Next.js / React build", "Schema markup + Core Web Vitals tuning", "Forms & CRM integrations"],
  },
  {
    number: "05",
    name: "Launch",
    duration: "Launch week",
    description:
      "Domain, hosting, analytics, and search console — configured and verified, not left for you to figure out. Every launch includes a defined window of post-launch fixes at no extra cost.",
    details: ["DNS, hosting & SSL handoff", "GA4 + Search Console verification", "Post-launch fix window"],
  },
  {
    number: "06",
    name: "Growth",
    duration: "Ongoing",
    description:
      "Launch day is the floor, not the ceiling. Care plans keep the site fast and secure; SEO retainers compound your ranking position every month after — reported in numbers you can actually read.",
    details: ["Website Care plan", "Monthly SEO retainer", "Monthly reporting & strategy calls"],
  },
];
