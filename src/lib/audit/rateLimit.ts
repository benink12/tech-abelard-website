import "server-only";

// Simple in-memory sliding-window limiter for the public, unauthenticated
// /api/audit endpoint. Deliberately not distributed/persistent — it resets
// on every deploy/restart/cold-start, same caveat as store.ts. That's an
// acceptable floor for launch (it stops a casual script from hammering the
// endpoint from one IP) but is NOT abuse protection across multiple
// instances or a determined attacker rotating IPs; upgrade to a shared
// store (e.g. Upstash/Redis) if real abuse shows up in production.

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

// Bound memory: drop tracked IPs that have had no activity recently instead
// of growing this map forever across the process lifetime.
function sweep(now: number) {
  for (const [key, timestamps] of hits) {
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  if (hits.size > 5000) sweep(now);

  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterMs = WINDOW_MS - (now - timestamps[0]);
    return { allowed: false, retryAfterMs };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true, retryAfterMs: 0 };
}

/** Best-effort client identifier from standard proxy headers; falls back to a shared bucket if none are present (e.g. local dev). */
export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
