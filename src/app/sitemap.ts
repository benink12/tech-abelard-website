import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { portfolioProjects } from "@/data/portfolio";
import { services } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/portfolio",
    "/pricing",
    "/process",
    "/about",
    "/faq",
    "/audit",
    "/contact",
    "/privacy-policy",
    "/terms",
    // Non-branded SEO landing pages — bespoke routes targeting search intent
    // that doesn't already know Tech Abélard by name, not part of the main
    // service catalog above.
    "/web-design-ottawa",
    "/local-seo-for-contractors",
    "/plumber-website-design",
    "/ai-receptionist-for-small-business",
  ];

  // Individual service pages — the three main ones (web-design, local-seo,
  // ai-receptionist) are bespoke routes, the rest render through the
  // generic /services/[slug] template. Either way, the slug is the route.
  const serviceRoutes = services.map((service) => `/services/${service.slug}`);

  // Public case studies — indexable, unlike everything under /showcase
  // (the private live demo gate), which is deliberately excluded here and
  // disallowed in robots.ts.
  const caseStudyRoutes = portfolioProjects.map((project) => `/portfolio/${project.slug}`);

  // Priority is only a crawl-budget hint, not a ranking factor — but a flat
  // 0.7 on every non-home route put /terms and /privacy-policy at the same
  // priority as the pages actually meant to rank and convert. Highest tier
  // (0.9) is the four keyword-targeted landing pages and the three core
  // service hubs; legal pages drop to 0.3; everything else lands at 0.6.
  const TOP_PRIORITY = new Set<string>([
    "/web-design-ottawa",
    "/local-seo-for-contractors",
    "/plumber-website-design",
    "/ai-receptionist-for-small-business",
    "/services/web-design",
    "/services/local-seo",
    "/services/ai-receptionist",
  ]);
  const LOW_PRIORITY = new Set<string>(["/privacy-policy", "/terms"]);

  function priorityFor(route: string): number {
    if (route === "") return 1;
    if (TOP_PRIORITY.has(route)) return 0.9;
    if (LOW_PRIORITY.has(route)) return 0.3;
    return 0.6;
  }

  return [...routes, ...serviceRoutes, ...caseStudyRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: priorityFor(route),
  }));
}
