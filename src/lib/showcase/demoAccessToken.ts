import "server-only";
import { createHmac } from "node:crypto";

// Mints the short-lived handoff token appended to a demo URL when
// redirecting an already-validated showcase visitor (see
// src/app/showcase/[slug]/page.tsx, right after getPrivateDemoUrl()) —
// verified by that specific project's own src/proxy.ts on the demo
// deployment side (a separate repo/Vercel project per niche; see that
// file for the other half of this). 60 seconds is deliberately just
// enough for the browser to follow the redirect — this is a one-time
// handoff, not a session; the demo mints its own first-party cookie once
// it accepts the token.
//
// requestId flows through into that first-party cookie too, so the demo
// side can periodically re-check the *real* access status with the OS
// (POST /api/portfolio-access/session-check) while a visitor is actively
// browsing — not just verify this token's signature/expiry once at the
// door. That's what makes an admin's "Block Access Now" (or a natural
// expiry) end an in-progress visit, not just block future handoffs.
//
// Distinct secret from SHOWCASE_SESSION_SECRET (session.ts): this value
// also has to live in every demo repo's env, so keeping it separate
// limits blast radius if any single demo deployment's env ever leaks.
const TOKEN_TTL_SECONDS = 60;

function secret(): string {
  const s = process.env.DEMO_ACCESS_TOKEN_SECRET;
  if (!s) throw new Error("DEMO_ACCESS_TOKEN_SECRET is not set.");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signDemoAccessToken(slug: string, requestId: string): string {
  const payload = { slug, requestId, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}
