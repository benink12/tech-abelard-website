// DEMO PLACEHOLDER DATA — Tech Abélard has no live clients yet (see the
// vault's Business Overview / Communication Standards: no fabricated
// specifics presented as fact). These entries illustrate the testimonial
// section's design and must be replaced with real, attributed client quotes
// before this section goes live in production. `isPlaceholder` drives the
// visible "Demo placeholder" badge — do not remove the flag when swapping
// in real content until every entry is genuine.

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  isPlaceholder: true;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "The site paid for itself in the first month — we stopped losing quote requests to the competitor who just looked more legitimate online.",
    name: "Placeholder Client",
    role: "Owner, Home Service Business",
    isPlaceholder: true,
  },
  {
    quote:
      "They mapped our SEO plan to the actual services we wanted more of, not just generic keywords. Rankings moved within the first quarter.",
    name: "Placeholder Client",
    role: "Operations Manager, Trades Company",
    isPlaceholder: true,
  },
  {
    quote:
      "Fast, direct, no fluff in the process. The Care plan means I've never once had to think about whether the site is still working.",
    name: "Placeholder Client",
    role: "Founder, Local Contracting Business",
    isPlaceholder: true,
  },
];
