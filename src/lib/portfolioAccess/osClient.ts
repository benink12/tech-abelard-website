import "server-only";

// This site has no database of its own — every Portfolio Access mutation
// (submitting a request, validating an email+code pair, re-checking an
// existing session) forwards server-side to Tech Abélard OS's internal
// API, which owns the real records. Called only from this repo's own
// Route Handlers (src/app/api/request-access, src/app/api/showcase/
// validate) — never directly from a client component, so the shared key
// below never reaches the browser. See OS's src/lib/portfolioAccess/
// internalAuth.ts for the other side of this.
//
// OS's own admin UI has no user accounts yet, so — since Vercel's
// platform-level Deployment Protection turned out not to be enforced on
// its current plan — its whole deployment is gated by its own HTTP Basic
// Auth middleware instead (see that repo's src/proxy.ts). This route and
// its siblings are the deliberate exceptions, authenticated by the shared
// key above rather than Basic Auth, so this call doesn't need credentials
// for that gate. OS_PROTECTION_BYPASS_SECRET, sent as a header only when
// set, is a no-op today but costs nothing to keep wired up in case
// Deployment Protection is ever actually enabled on OS's Vercel plan.
function osApiBaseUrl(): string {
  return process.env.OS_API_BASE_URL ?? "http://localhost:3010";
}

function internalKey(): string {
  const key = process.env.PORTFOLIO_ACCESS_INTERNAL_KEY;
  if (!key) throw new Error("PORTFOLIO_ACCESS_INTERNAL_KEY is not set.");
  return key;
}

async function postToOs<T>(path: string, body: unknown): Promise<{ ok: boolean; status: number; data: T | null }> {
  try {
    const bypassSecret = process.env.OS_PROTECTION_BYPASS_SECRET;
    const res = await fetch(`${osApiBaseUrl()}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-portfolio-access-key": internalKey(),
        ...(bypassSecret ? { "x-vercel-protection-bypass": bypassSecret } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => null)) as T | null;
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

export interface SubmitAccessRequestInput {
  fullName: string;
  businessName: string;
  email: string;
  phone: string | null;
  industry: string;
  websiteUrl: string | null;
  requestedProjectSlug: string;
  reason: string;
  consent: boolean;
}

export async function submitPortfolioAccessRequest(
  input: SubmitAccessRequestInput
): Promise<{ ok: boolean; id?: string; error?: string; fieldErrors?: Record<string, string> }> {
  const result = await postToOs<{ id?: string; error?: string; fieldErrors?: Record<string, string> }>(
    "/api/portfolio-access/requests",
    input
  );
  if (!result.ok || !result.data?.id) {
    return {
      ok: false,
      error: result.data?.error ?? "Could not submit your request — please try again shortly.",
      fieldErrors: result.data?.fieldErrors,
    };
  }
  return { ok: true, id: result.data.id };
}

export interface PortfolioAccessValidation {
  valid: boolean;
  reason: "ok" | "expired" | "revoked" | "invalid";
  request?: { id: string; fullName: string; businessName: string };
  projectSlug?: string;
  expiresAt?: string;
}

export async function validatePortfolioAccessWithOs(email: string, code: string): Promise<PortfolioAccessValidation> {
  const result = await postToOs<PortfolioAccessValidation>("/api/portfolio-access/validate", { email, code });
  return result.data ?? { valid: false, reason: "invalid" };
}

export async function checkPortfolioAccessSessionWithOs(requestId: string): Promise<PortfolioAccessValidation> {
  const result = await postToOs<PortfolioAccessValidation>("/api/portfolio-access/session-check", { requestId });
  return result.data ?? { valid: false, reason: "invalid" };
}
