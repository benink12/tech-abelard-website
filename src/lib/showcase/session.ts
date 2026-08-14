import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// A self-contained, signed session — no server-side session table needed
// on this repo's side (it has no database). The cookie only ever holds
// requestId + projectSlug, never the access code itself (see
// SHOWCASE_ACCESS requirement "do not store the access code in the URL" —
// this extends the same principle to cookies/storage generally). Its own
// baked-in expiry is a coarse upper bound only; the gated page re-checks
// the *real* status with the OS on every load (see
// src/app/showcase/[slug]/page.tsx) so a revocation takes effect
// immediately instead of waiting for this cookie to expire.
const COOKIE_NAME = "ta_showcase_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 1 day

interface SessionPayload {
  requestId: string;
  projectSlug: string;
  exp: number; // unix seconds
}

function secret(): string {
  const s = process.env.SHOWCASE_SESSION_SECRET;
  if (!s) throw new Error("SHOWCASE_SESSION_SECRET is not set.");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function createSessionToken(data: { requestId: string; projectSlug: string }): string {
  const payload: SessionPayload = { ...data, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedBuf = Buffer.from(sign(payloadB64));
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8")) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setShowcaseSessionCookie(data: { requestId: string; projectSlug: string }): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function getShowcaseSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function clearShowcaseSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
