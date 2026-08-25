import { NextResponse } from "next/server";
import { checkRateLimit, getClientKey } from "@/lib/audit/rateLimit";
import { sendLeadNotificationEmail } from "@/lib/notifyLead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RequestBody {
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  message?: string;
  // Only HomeLeadForm collects this today — optional here so ContactForm's
  // submissions (which have no service field) keep working unchanged.
  service?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { name: 200, email: 254, phone: 40, business: 200, message: 5000, service: 100 };

function osApiBaseUrl(): string {
  return process.env.OS_API_BASE_URL ?? "http://localhost:3010";
}

function internalKey(): string {
  const key = process.env.PORTFOLIO_ACCESS_INTERNAL_KEY;
  if (!key) throw new Error("PORTFOLIO_ACCESS_INTERNAL_KEY is not set.");
  return key;
}

// Real backend for both lead-capture forms (ContactForm and HomeLeadForm)
// — previously mailto-only (LAUNCH_AUDIT.md A3). This repo has no database
// of its own; the message is forwarded server-side to Tech Abélard OS's
// internal API (POST /api/contact-messages there), the same pattern
// src/lib/portfolioAccess/osClient.ts already uses. Public and
// unauthenticated by design, so it shares the same per-IP rate limiter as
// /api/audit (namespaced with a "contact:" prefix so the two never share a
// bucket) and the same server-side validation shape as the client form.
// Once the lead is saved, a best-effort notification email goes out via
// Resend (src/lib/notifyLead.ts) — see the try/catch below for why a
// failure there can never fail this response.
export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const { allowed, retryAfterMs } = checkRateLimit(`contact:${clientKey}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, MAX_LEN.name);
  const email = (body.email ?? "").trim().slice(0, MAX_LEN.email);
  const phone = (body.phone ?? "").trim().slice(0, MAX_LEN.phone);
  const business = (body.business ?? "").trim().slice(0, MAX_LEN.business);
  const message = (body.message ?? "").trim().slice(0, MAX_LEN.message);
  const service = (body.service ?? "").trim().slice(0, MAX_LEN.service);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Name is required.";
  if (!email || !EMAIL_RE.test(email)) fieldErrors.email = "A valid email is required.";
  if (!message) fieldErrors.message = "Tell us a little about your project.";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: "Invalid submission.", fieldErrors }, { status: 400 });
  }

  try {
    const res = await fetch(`${osApiBaseUrl()}/api/contact-messages`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-portfolio-access-key": internalKey() },
      body: JSON.stringify({
        name,
        email,
        phone: phone || undefined,
        businessName: business || undefined,
        message,
        service: service || undefined,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Could not send your message — please try again shortly." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Could not send your message — please try again shortly." }, { status: 502 });
  }

  // Best-effort notification — the lead is already durably saved above, so
  // a Resend failure (bad key, transient API error) must never turn a
  // successful submission into an error response for the visitor. Logged
  // for operator visibility instead.
  try {
    const { id } = await sendLeadNotificationEmail({
      name,
      email,
      phone: phone || undefined,
      business: business || undefined,
      service: service || undefined,
      message,
    });
    console.log(`[contact] Lead notification email sent — Resend message id: ${id}`);
  } catch (err) {
    console.error("[contact] Lead saved, but the email notification failed to send:", err);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
