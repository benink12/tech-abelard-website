import "server-only";

// The actual interactive demo URLs — deliberately never exported from any
// module a public/client page could import (the `server-only` guard above
// makes that a build error, not a runtime surprise). Only
// src/app/showcase/[slug]/page.tsx reads this, and only after confirming a
// valid session. Unset in production means "not deployed yet" — the caller
// (PrivateShowcasePage) already renders an honest "Live demo opening soon"
// state for a null/undefined entry, so this must resolve to that rather
// than a same-machine-only localhost URL a real approved visitor could
// never reach.
const DEMO_URLS: Record<string, string | undefined> = {
  "northline-plumbing": process.env.DEMO_URL_NORTHLINE_PLUMBING,
  "northclimate-hvac": process.env.DEMO_URL_NORTHCLIMATE_HVAC,
  "northpeak-roofing": process.env.DEMO_URL_NORTHPEAK_ROOFING,
};

export function getPrivateDemoUrl(slug: string): string | null {
  return DEMO_URLS[slug] ?? null;
}
