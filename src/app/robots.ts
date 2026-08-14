import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private live showcase — gated by /showcase/access, never meant to
      // be crawled/indexed. Each page under here also sets its own
      // noindex/nofollow meta (see src/app/showcase/*/page.tsx) — this
      // disallow is belt-and-suspenders so a crawler doesn't even fetch it.
      disallow: "/showcase",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
