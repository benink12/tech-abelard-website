import "server-only";
import { lookup as dnsLookup } from "node:dns/promises";
import * as http from "node:http";
import * as https from "node:https";

// The instant audit does a real server-side fetch of a visitor-supplied URL
// (see checks.ts) — a classic SSRF surface. This module is the single
// checkpoint every outbound request in the audit engine must pass through:
// it rejects non-http(s) schemes, resolves the hostname itself and blocks
// any result that lands in a loopback/private/link-local/metadata range,
// and re-validates on every redirect hop so a server can't pass validation
// with a public hostname and then redirect (or DNS-rebind) into a private
// address.

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

const BLOCKED_HOSTNAME_SUFFIXES = [".localhost", ".local", ".internal"];
const BLOCKED_HOSTNAMES = new Set(["localhost"]);

function ipv4ToLong(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    value = (value << 8) | n;
  }
  return value >>> 0;
}

function inIpv4Range(ip: string, cidr: string): boolean {
  const [rangeIp, bitsStr] = cidr.split("/");
  const bits = Number(bitsStr);
  const ipLong = ipv4ToLong(ip);
  const rangeLong = ipv4ToLong(rangeIp);
  if (ipLong === null || rangeLong === null) return false;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ipLong & mask) === (rangeLong & mask);
}

// Loopback, RFC1918 private, link-local (includes the 169.254.169.254 cloud
// metadata endpoint), CGNAT, and the "this network" range.
const BLOCKED_IPV4_RANGES = [
  "127.0.0.0/8",
  "10.0.0.0/8",
  "172.16.0.0/12",
  "192.168.0.0/16",
  "169.254.0.0/16",
  "100.64.0.0/10",
  "0.0.0.0/8",
];

function isBlockedIpv4(ip: string): boolean {
  return BLOCKED_IPV4_RANGES.some((range) => inIpv4Range(ip, range));
}

function isBlockedIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1") return true; // loopback
  if (lower === "::") return true;
  if (lower.startsWith("fe80:") || lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true; // link-local fe80::/10
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local fc00::/7
  // IPv4-mapped IPv6 (::ffff:a.b.c.d) — check the embedded IPv4 address too.
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isBlockedIpv4(mapped[1]);
  return false;
}

function isBlockedIp(ip: string, family: number): boolean {
  return family === 4 ? isBlockedIpv4(ip) : isBlockedIpv6(ip);
}

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(lower)) return true;
  return BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => lower.endsWith(suffix));
}

/** Throws UnsafeUrlError if the URL's scheme or resolved address is not safe to fetch server-side. */
export async function assertSafeUrl(rawUrl: string): Promise<void> {
  await resolveSafeAddress(rawUrl);
}

/**
 * Same validation as assertSafeUrl (identical checks, identical error
 * cases), but also hands back the exact resolved address that was just
 * checked. safeFetch uses this address to pin the outbound connection
 * instead of letting the HTTP client resolve the hostname a second time —
 * re-resolving independently is what makes DNS rebinding possible (a
 * hostname can be swapped from a public to a private IP in the window
 * between this check and the real connection). Pinning closes that window:
 * the socket connects to exactly the address that was just validated.
 */
async function resolveSafeAddress(rawUrl: string): Promise<{ url: URL; address: string; family: 4 | 6 }> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new UnsafeUrlError("Not a valid URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new UnsafeUrlError(`Protocol "${parsed.protocol}" is not allowed.`);
  }

  const hostname = parsed.hostname;
  if (isBlockedHostname(hostname)) {
    throw new UnsafeUrlError("This host is not allowed.");
  }

  // A literal IP in the URL (e.g. http://169.254.169.254/) — check directly,
  // since dns.lookup on a literal IP just returns it unchanged.
  let addresses: { address: string; family: number }[];
  try {
    addresses = await dnsLookup(hostname, { all: true });
  } catch {
    throw new UnsafeUrlError("Could not resolve this host.");
  }

  if (addresses.length === 0) {
    throw new UnsafeUrlError("Could not resolve this host.");
  }

  for (const { address, family } of addresses) {
    if (isBlockedIp(address, family)) {
      throw new UnsafeUrlError("This host resolves to a non-public address.");
    }
  }

  const [{ address, family }] = addresses;
  return { url: parsed, address, family: family as 4 | 6 };
}

const MAX_REDIRECTS = 5;

/** Minimal, duck-typed stand-in for the parts of `Response` this module's callers (checks.ts) actually use. */
export interface SafeFetchResponse {
  status: number;
  ok: boolean;
  url: string;
  headers: { get(name: string): string | null };
}

/**
 * Sends the actual request for one hop, connected to the pre-validated
 * `address` via a pinned `lookup` — the HTTP client never gets to resolve
 * the hostname itself. TLS SNI and certificate-hostname checks still use
 * the real hostname (Node derives those from the URL passed in, not from
 * `lookup`), so this doesn't break HTTPS to normal, SNI-hosted sites.
 */
function requestPinned(
  url: URL,
  address: string,
  family: 4 | 6,
  init: { signal?: AbortSignal; headers?: Record<string, string> }
): Promise<{ res: SafeFetchResponse; stream: http.IncomingMessage }> {
  return new Promise((resolve, reject) => {
    const mod = url.protocol === "https:" ? https : http;
    const req = mod.request(
      url,
      {
        method: "GET",
        signal: init.signal,
        headers: init.headers,
        // Node's Happy Eyeballs (autoSelectFamily) can call lookup asking
        // for an array of addresses via options.all — handle both forms so
        // we stay pinned to the one address we validated either way.
        lookup: (_hostname, options, callback) => {
          if (options && typeof options === "object" && "all" in options && options.all) {
            callback(null, [{ address, family }]);
          } else {
            callback(null, address, family);
          }
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        resolve({
          res: {
            status,
            ok: status >= 200 && status < 300,
            url: url.toString(),
            headers: {
              get: (name: string) => {
                const value = res.headers[name.toLowerCase()];
                return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
              },
            },
          },
          stream: res,
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

/**
 * Drop-in replacement for `fetch` that validates the target (and every
 * redirect hop) against `assertSafeUrl`'s rules, pins each hop's connection
 * to its validated address (see requestPinned), and enforces a hard cap on
 * response body size by aborting the stream once exceeded rather than
 * buffering an unbounded response before checking its length.
 */
export async function safeFetch(
  url: string,
  init: { signal?: AbortSignal; headers?: Record<string, string> },
  maxBytes: number
): Promise<{ res: SafeFetchResponse; body: string }> {
  let currentUrl = url;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const { url: validatedUrl, address, family } = await resolveSafeAddress(currentUrl);
    const { res, stream } = await requestPinned(validatedUrl, address, family, init);

    const isRedirect = res.status >= 300 && res.status < 400;
    if (isRedirect) {
      const location = res.headers.get("location");
      stream.resume(); // drain and discard — redirect bodies are never read
      if (!location) throw new UnsafeUrlError("Redirect with no location header.");
      currentUrl = new URL(location, validatedUrl).toString();
      continue;
    }

    const body = await readBodyWithLimit(stream, maxBytes);
    return { res, body };
  }

  throw new UnsafeUrlError("Too many redirects.");
}

async function readBodyWithLimit(stream: http.IncomingMessage, maxBytes: number): Promise<string> {
  const chunks: Buffer[] = [];
  let received = 0;
  let settled = false;

  return new Promise((resolve, reject) => {
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    stream.on("data", (chunk: Buffer) => {
      received += chunk.length;
      if (received > maxBytes) {
        chunks.push(chunk.subarray(0, maxBytes - (received - chunk.length)));
        stream.destroy();
        finish(() => resolve(Buffer.concat(chunks).toString("utf8")));
        return;
      }
      chunks.push(chunk);
    });
    stream.on("end", () => finish(() => resolve(Buffer.concat(chunks).toString("utf8"))));
    stream.on("close", () => finish(() => resolve(Buffer.concat(chunks).toString("utf8"))));
    stream.on("error", (err) => finish(() => reject(err)));
  });
}
