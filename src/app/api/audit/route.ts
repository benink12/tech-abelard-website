import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit/engine";
import { saveAuditResult } from "@/lib/audit/store";
import { assertSafeUrl, UnsafeUrlError } from "@/lib/audit/ssrfGuard";
import { checkRateLimit, getClientKey } from "@/lib/audit/rateLimit";
import { normalizeWebsiteUrl, validateAuditForm, type AuditFormValues, type AuditIndustry } from "@/lib/audit/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RequestBody {
  businessName?: string;
  websiteUrl?: string;
  industry?: string;
  name?: string;
  email?: string;
  phone?: string;
}

// Runs the instant audit synchronously and returns its id — the client
// polls nothing; it just navigates to /audit/results/[id] once this
// resolves. Public and unauthenticated by design (it's the free instant
// audit), so it's protected by: a per-IP rate limit, the same shared
// validation the client form uses (validateAuditForm, so the two can never
// drift), and (in checks.ts, via ssrfGuard.safeFetch) DNS-resolution checks
// on the target host plus a response-size cap — see ssrfGuard.ts.
export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const { allowed, retryAfterMs } = checkRateLimit(clientKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many audit requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const values: AuditFormValues = {
    businessName: (body.businessName ?? "").trim(),
    websiteUrl: (body.websiteUrl ?? "").trim(),
    industry: (body.industry ?? "").trim(),
    name: (body.name ?? "").trim(),
    email: (body.email ?? "").trim(),
    phone: (body.phone ?? "").trim(),
  };

  const errors = validateAuditForm(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Invalid submission.", fieldErrors: errors }, { status: 400 });
  }

  try {
    await assertSafeUrl(normalizeWebsiteUrl(values.websiteUrl));
  } catch (err) {
    if (err instanceof UnsafeUrlError) {
      return NextResponse.json(
        { error: "Invalid submission.", fieldErrors: { websiteUrl: "That address can't be audited." } },
        { status: 400 }
      );
    }
    throw err;
  }

  // Safe: validateAuditForm already confirmed values.industry is a valid AuditIndustry.
  const result = await runAudit({
    businessName: values.businessName,
    websiteUrl: values.websiteUrl,
    industry: values.industry as AuditIndustry,
    name: values.name,
    email: values.email,
    phone: values.phone || null,
  });

  await saveAuditResult(result);

  return NextResponse.json({ id: result.id }, { status: 201 });
}
