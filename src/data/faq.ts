export type FaqItem = {
  question: string;
  answer: string;
  category: "General" | "Pricing" | "Process" | "SEO";
};

export const faqItems: FaqItem[] = [
  {
    category: "General",
    question: "What kind of businesses do you work with?",
    answer:
      "Canadian home service businesses — plumbing, HVAC, roofing, electrical, landscaping, construction, tree services, painting, concrete, and cleaning companies. That focus means we already understand your customer's decision, not just your industry.",
  },
  {
    category: "Pricing",
    question: "Why is pricing 'starting at' instead of a fixed number?",
    answer:
      "Every package has a standard scope, but real factors move it — how many service areas you actually serve, whether professional photography exists, and how much content readiness you're starting with. We confirm final scope on a short discovery call before any quote is final, never after work has started.",
  },
  {
    category: "Process",
    question: "How long does a project take?",
    answer:
      "Essential builds in 2–3 weeks, Professional in 4–6 weeks, and Premium in 6–10 weeks — depending on scope, content readiness, and revision rounds. See the Process page for what happens week by week.",
  },
  {
    category: "SEO",
    question: "How fast will I rank?",
    answer:
      "Local SEO compounds — it isn't instant. We recommend a 3-month minimum term because that's roughly how long Google needs to trust new signals. Most clients see measurable movement in local pack visibility within 60–90 days, reported monthly so you can see it happening, not just take our word for it.",
  },
  {
    category: "Process",
    question: "Can I edit the site myself after launch?",
    answer:
      "On Professional and Premium tiers, yes — you get a client-editable CMS for text, images, and minor content. Essential tier sites are managed by us; you can add a Website Care plan any time for hands-off edits.",
  },
  {
    category: "Pricing",
    question: "Do you offer payment plans?",
    answer:
      "One-time projects run on a 50% deposit to start, 50% on delivery. Retainers (SEO, Care plans) bill monthly in advance with no long-term contract required.",
  },
  {
    category: "General",
    question: "What if I already have a website?",
    answer:
      "We can rebuild it from scratch at any package tier, or start with an SEO or Care retainer on your existing site if the build itself is sound but underperforming. We'll tell you honestly which one actually moves the needle before recommending either.",
  },
  {
    category: "SEO",
    question: "Is Google Business Profile management included, or separate?",
    answer:
      "GBP management is included at no extra cost inside every SEO retainer. It's also available standalone — a one-time $597 setup, or $297/mo ongoing — for businesses that aren't ready for a full SEO campaign yet.",
  },
];
