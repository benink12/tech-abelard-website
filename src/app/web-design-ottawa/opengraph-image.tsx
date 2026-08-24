import { ImageResponse } from "next/og";
import { site } from "@/data/site";

// Route-scoped Open Graph image (Next.js file-convention) — same visual
// system as the root src/app/opengraph-image.tsx (dark navy gradient, brass
// accent, TA mark), just swapped to this page's own headline. Next.js wires
// this into both og:image and twitter:image automatically (this page's
// `twitter` metadata sets no `images`, so it falls back to this file) —
// no separate twitter-image.tsx needed.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1c2230 0%, #232b3c 55%, #2a3244 100%)",
          color: "#f7f4ee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "rgba(176,141,87,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(176,141,87,0.4)",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <path d="M4 7h13M10.5 7v18" stroke="#d8bd8a" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M15 25 22 7l7 18M17.2 19h9.6"
                stroke="#d8bd8a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>{site.name}</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 600,
            marginTop: 46,
            maxWidth: 950,
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          Web Design Ottawa
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 26, color: "#d8bd8a" }}>
          Websites for Local Ottawa Businesses
        </div>
      </div>
    ),
    size
  );
}
