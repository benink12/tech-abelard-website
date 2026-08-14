import { cache } from "react";
import { cookies, headers } from "next/headers";
import { DEFAULT_REGION, isRegion, REGION_COOKIE, type Region } from "@/data/localization";

// Maps an ISO 3166-1 alpha-2 country code to a Region. Returns null for any
// code that isn't Canada or Burundi, so callers can fall through to the next
// signal in the chain instead of guessing.
function matchCountryCode(code: string | null): Region | null {
  if (!code) return null;
  const upper = code.trim().toUpperCase();
  if (upper === "CA") return "canada";
  if (upper === "BI") return "burundi";
  return null;
}

// Accept-Language can plausibly indicate Canada (en-CA/fr-CA), but it cannot
// reliably distinguish "Burundi" from "generic French speaker" — so this only
// ever resolves to canada or the default, never a guessed burundi.
function matchAcceptLanguage(acceptLanguage: string | null): Region {
  const lower = acceptLanguage?.toLowerCase() ?? "";
  if (lower.includes("-ca")) return "canada";
  return DEFAULT_REGION;
}

// Resolves the visitor's region from request headers alone (no cookie
// lookup) — used both here as a cookie-miss fallback and by src/proxy.ts when
// first setting the cookie, so the two stay in lockstep.
export function resolveRegionFromHeaders(headerList: Headers): Region {
  const fromVercel = matchCountryCode(headerList.get("x-vercel-ip-country"));
  if (fromVercel) return fromVercel;

  const fromCloudflare = matchCountryCode(headerList.get("cf-ipcountry"));
  if (fromCloudflare) return fromCloudflare;

  return matchAcceptLanguage(headerList.get("accept-language"));
}

// Cached per request (React's cache()) so every Server Component in the tree
// can independently `await getRegion()` without re-parsing cookies/headers or
// needing prop-drilling.
export const getRegion = cache(async (): Promise<Region> => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(REGION_COOKIE)?.value;
  if (isRegion(cookieValue)) return cookieValue;

  const headerStore = await headers();
  return resolveRegionFromHeaders(headerStore);
});
