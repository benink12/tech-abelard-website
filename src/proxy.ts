import { NextResponse, type NextRequest } from "next/server";
import { isRegion, REGION_COOKIE } from "@/data/localization";
import { resolveRegionFromHeaders } from "@/lib/region";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// Automatic detection runs once, on first visit (no cookie yet). Any cookie
// already present — from a prior auto-detection, or the dev-only ?region=
// override below — is left untouched, so detection never silently flips it.
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Development-only test override, e.g. ?region=burundi — never active in
  // a production build/start, so it can't be used to spoof region live.
  if (process.env.NODE_ENV === "development") {
    const forced = request.nextUrl.searchParams.get("region");
    if (isRegion(forced)) {
      response.cookies.set(REGION_COOKIE, forced, {
        path: "/",
        maxAge: ONE_YEAR_SECONDS,
        sameSite: "lax",
      });
      return response;
    }
  }

  if (request.cookies.has(REGION_COOKIE)) {
    return response;
  }

  const region = resolveRegionFromHeaders(request.headers);
  response.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
