export type AuditIncludedItem = {
  title: string;
  description: string;
  icon: "layout" | "smartphone" | "gauge" | "search" | "map-pin" | "mouse-pointer-click" | "phone" | "list-checks";
};

export const auditIncludedItems: AuditIncludedItem[] = [
  {
    title: "Design & Trust Signals",
    description: "Whether your site looks credible enough to earn a call before a competitor's does.",
    icon: "layout",
  },
  {
    title: "Mobile Experience",
    description: "How your site actually behaves on a phone — where most first impressions happen.",
    icon: "smartphone",
  },
  {
    title: "Site Speed",
    description: "Whether slow loading is quietly costing you visitors before they see anything.",
    icon: "gauge",
  },
  {
    title: "On-Page SEO",
    description: "Whether your pages are set up to be found for what you actually do.",
    icon: "search",
  },
  {
    title: "Local SEO & Google Business Profile",
    description: "Whether your business shows up in the local map pack where it matters.",
    icon: "map-pin",
  },
  {
    title: "Conversion & Calls to Action",
    description: "Whether it's obvious what a visitor should do next — call, message, or request a quote.",
    icon: "mouse-pointer-click",
  },
  {
    title: "Contact & Quote Experience",
    description: "What actually happens when someone tries to reach you through your own site.",
    icon: "phone",
  },
  {
    title: "Three Ranked Recommendations",
    description: "Not a wall of jargon — the three things worth fixing first, in order of real impact.",
    icon: "list-checks",
  },
];

export const auditTrustPoints = [
  {
    title: "A real person reviews your site",
    description: "Every audit is looked at directly — not an auto-generated report with your name pasted on top.",
  },
  {
    title: "Every finding is something we actually checked",
    description: "If we didn't verify it, we don't put a number on it. No invented traffic, rankings, or performance scores.",
  },
  {
    title: "No obligation, ever",
    description: "You'll get the audit whether you hire us or not. There's no pressure and no hard follow-up sequence.",
  },
  {
    title: "Reviewed before it reaches you",
    description: "Every audit is checked internally before it's ever sent — you're not the first read.",
  },
];

export type AuditFaqItem = {
  question: string;
  answer: string;
};

export const auditFaqItems: AuditFaqItem[] = [
  {
    question: "Is this actually free?",
    answer:
      "Yes — no card, no catch. We do this because a real, specific look at your site is a better first conversation than a generic sales pitch.",
  },
  {
    question: "What exactly will I get?",
    answer:
      "A written review covering design and trust, mobile experience, speed, on-page and local SEO, your site's calls-to-action, and your contact/quote experience — plus the three changes we'd recommend fixing first.",
  },
  {
    question: "Will you guarantee my rankings will improve or I'll get more leads?",
    answer:
      "No — and be wary of anyone who does. We'll tell you honestly what we found and what it's likely worth fixing. Real search rankings and lead volume depend on far more than a website, and we won't invent numbers to make a pitch sound better.",
  },
  {
    question: "How long does it take to receive?",
    answer:
      "Most audits are reviewed and ready within 2–3 business days. Every audit is checked internally before it's sent, so quality comes before speed.",
  },
  {
    question: "Do I have to buy anything afterward?",
    answer:
      "No. Some businesses use the audit to fix things themselves, some come back to us later, and some never do — all of that is fine.",
  },
  {
    question: "What if my website is actually fine?",
    answer:
      "Then we'll tell you that. An honest \"this is in good shape\" is a more useful answer than manufacturing problems to justify a sales pitch.",
  },
];
