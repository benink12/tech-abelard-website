import { NextResponse } from "next/server";
import { validatePortfolioAccessWithOs } from "@/lib/portfolioAccess/osClient";
import { setShowcaseSessionCookie } from "@/lib/showcase/session";
import { checkRateLimit, getClientKey } from "@/lib/audit/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RequestBody {
  email?: string;
  code?: string;
}

// The /showcase/access form posts here. On success, sets a signed
// session cookie and returns the project slug to redirect to — the raw
// code is never stored anywhere after this request completes. This is a
// credential-guessing endpoint (email + access code), so it's rate
// limited per IP same as the other public routes — see
// src/lib/audit/rateLimit.ts.
export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const { allowed, retryAfterMs } = checkRateLimit(`showcase-validate:${clientKey}`);
  if (!allowed) {
    return NextResponse.json(
      { valid: false, reason: "invalid", error: "Too many attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const code = (body.code ?? "").trim();
  if (!email || !code) {
    return NextResponse.json({ valid: false, reason: "invalid" }, { status: 400 });
  }

  const result = await validatePortfolioAccessWithOs(email, code);
  if (!result.valid || !result.request || !result.projectSlug) {
    // Deliberately generic — never reveal whether the email or the code
    // was the part that didn't match (see the OS's own validate function).
    return NextResponse.json({ valid: false, reason: result.reason ?? "invalid" });
  }

  await setShowcaseSessionCookie({ requestId: result.request.id, projectSlug: result.projectSlug });
  return NextResponse.json({ valid: true, projectSlug: result.projectSlug });
}
