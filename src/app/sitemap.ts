import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { portfolioProjects } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/seo",
    "/portfolio",
    "/pricing",
    "/process",
    "/about",
    "/faq",
    "/audit",
    "/contact",
    "/privacy-policy",
    "/terms",
  ];

  // Public case studies — indexable, unlike everything under /showcase
  // (the private live demo gate), which is deliberately excluded here and
  // disallowed in robots.ts.
  const caseStudyRoutes = portfolioProjects.map((project) => `/portfolio/${project.slug}`);

  return [...routes, ...caseStudyRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
