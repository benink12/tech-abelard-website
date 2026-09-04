import path from "path";
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Dev server is also reached from a phone on the LAN (different origin
  // than localhost) for mobile testing; Next.js blocks cross-origin dev
  // requests by default. The Mac's LAN IP changes on DHCP renewal — keep
  // both the current and previous known addresses listed rather than a
  // single value, so this doesn't silently start blocking phone requests
  // again the next time it changes.
  allowedDevOrigins: ["192.168.10.176", "192.168.135.25", "192.168.10.158", "192.168.2.88", "192.168.2.87"],
  // The dev tools indicator renders bottom-left by default, directly on top
  // of MobileCTABar's phone button, intercepting taps there. Dev-only;
  // never present in production.
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // /free-audit (mailto-only mock form) is retired in favor of /audit (the
  // real instant-audit engine) — see LAUNCH_AUDIT.md B8. Permanent redirect
  // so old bookmarks/links/search results don't 404.
  async redirects() {
    return [
      {
        source: "/free-audit",
        destination: "/audit",
        permanent: true,
      },
      // /seo (standalone Local SEO page) is retired in favor of the dedicated
      // service page /services/local-seo, so its content lives alongside the
      // other main service pages. Permanent redirect so old bookmarks/links
      // and existing search-engine indexing don't 404.
      {
        source: "/seo",
        destination: "/services/local-seo",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
