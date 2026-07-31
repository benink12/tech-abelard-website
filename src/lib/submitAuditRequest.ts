export type AuditRequestPayload = {
  businessName: string;
  websiteUrl: string;
  industry: string;
  city: string;
  contactName: string;
  email: string;
  phone: string;
  mainConcern: string;
  consentGiven: boolean;
};

// Integration point: this is the seam between the public /free-audit form
// and Tech Abélard OS's Audit Requests review workflow (see that project's
// src/lib/auditRequests.ts for the matching contract). A real implementation
// needs:
//   1. A Route Handler here (or a shared API) that validates the payload
//      server-side and writes it to a database — the two Next.js apps have
//      no shared backend today, so a submission here cannot reach OS's
//      Audit Requests list until that API + database exist.
//   2. Basic spam protection (honeypot field and/or rate limiting) — neither
//      exists yet.
//   3. No automatic email to the prospect or notification beyond what lands
//      in the database — Tech Abélard OS is where a human decides what
//      happens next, per the required workflow (never auto-send anything).
//
// Until then, this is an explicit stub: it validates nothing server-side and
// always resolves successfully after a short delay so the full form UX can
// be built and tested end to end ahead of the real backend. No submission
// is actually persisted anywhere yet.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- payload is unused until the real backend lands
export async function submitAuditRequest(_payload: AuditRequestPayload): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
}
