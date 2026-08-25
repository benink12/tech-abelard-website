import { NextResponse } from "next/server";
import { portfolioProjects } from "@/data/portfolio";
import { submitPortfolioAccessRequest } from "@/lib/portfolioAccess/osClient";
import { validateRequestAccessForm } from "@/lib/portfolioAccess/requestValidation";
import { checkRateLimit, getClientKey } from "@/lib/audit/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RequestBody {
  fullName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  industry?: string;
  websiteUrl?: string;
  requestedProjectSlug?: string;
  reason?: string;
  consent?: boolean;
}

// The one write path this repo has — forwards a visitor's "Request Live
// Access" submission to Tech Abélard OS server-side (see
// src/lib/portfolioAccess/osClient.ts). The browser only ever talks to
// this same-origin route, never to the OS directly.
export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const { allowed, retryAfterMs } = checkRateLimit(`request-access:${clientKey}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = (body.fullName ?? "").trim();
  const businessName = (body.businessName ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const industry = (body.industry ?? "").trim();
  const websiteUrl = (body.websiteUrl ?? "").trim();
  const requestedProjectSlug = (body.requestedProjectSlug ?? "").trim();
  const reason = (body.reason ?? "").trim();
  const consent = body.consent === true;

  const errors = validateRequestAccessForm({ fullName, businessName, email, phone, industry, websiteUrl, reason, consent });
  if (!requestedProjectSlug || !portfolioProjects.some((p) => p.slug === requestedProjectSlug)) {
    errors.requestedProjectSlug = "Select which project you'd like to view.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Invalid submission.", fieldErrors: errors }, { status: 400 });
  }

  const result = await submitPortfolioAccessRequest({
    fullName,
    businessName,
    email,
    phone: phone || null,
    industry,
    websiteUrl: websiteUrl || null,
    requestedProjectSlug,
    reason,
    consent,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Could not submit your request.", fieldErrors: result.fieldErrors }, { status: 502 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
