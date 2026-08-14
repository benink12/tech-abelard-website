import "server-only";
import type { AuditResult } from "./types";
import { saveAuditResultToOs, getAuditResultFromOs } from "./osStore";

// Persistence for instant-audit results — backed by Tech Abélard OS's
// internal API (src/lib/audit/osStore.ts), which owns the real
// `instant_audit_results` record (see that repo's
// supabase/migrations/0014_public_intake.sql). This repo has no database
// of its own, same as src/lib/portfolioAccess/osClient.ts.
//
// Fallback: if OS is unreachable (not yet deployed, network blip, etc.)
// results still land in an in-process Map so a visitor's audit isn't a
// hard failure — but this is degraded behavior, not a real fix, and it
// does NOT survive a serverless cold start or a multi-instance
// deployment. Every fallback hit is logged loudly (console.error) so it
// shows up in server logs/monitoring rather than failing silently — check
// for these before trusting OS is reliably reachable in production.
//
// The Map lives on `globalThis`, not a plain module-level `const` — under
// Next.js dev with Turbopack, a Route Handler and a Server Component page
// can each get their own instance of an imported module, so a bare
// module-level Map silently isn't a real singleton (confirmed: POST
// /api/audit and the results page read back different, empty Maps).
// `globalThis` is shared across every module instance in the process,
// which is the standard fix for this class of Next.js dev-mode bug (the
// same pattern Prisma's client singleton uses).

const globalForAuditStore = globalThis as unknown as {
  __auditResultsFallback?: Map<string, AuditResult>;
};

const fallbackResults = globalForAuditStore.__auditResultsFallback ?? new Map<string, AuditResult>();
globalForAuditStore.__auditResultsFallback = fallbackResults;

export async function saveAuditResult(result: AuditResult): Promise<void> {
  const savedToOs = await saveAuditResultToOs(result);
  if (!savedToOs) {
    console.error(
      `[audit/store] Failed to persist audit result ${result.id} to Tech Abélard OS — falling back to in-process storage, which will NOT survive a cold start or another instance.`
    );
    fallbackResults.set(result.id, result);
  }
}

export async function getAuditResult(id: string): Promise<AuditResult | null> {
  const fromOs = await getAuditResultFromOs(id);
  if (fromOs) return fromOs;
  return fallbackResults.get(id) ?? null;
}
