import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const region = await getRegion();
  const copy = regionCopy[region];

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
          background: "linear-gradient(135deg, #16181a 0%, #1e1a1c 55%, #22262a 100%)",
          color: "#e6e7e2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "rgba(122,31,43,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(122,31,43,0.4)",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <path d="M4 7h13M10.5 7v18" stroke="#a63745" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M15 25 22 7l7 18M17.2 19h9.6"
                stroke="#a63745"
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
            fontSize: 58,
            fontWeight: 600,
            marginTop: 46,
            maxWidth: 950,
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          {site.tagline}
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 26, color: "#a63745" }}>
          {copy.ogImageSubtitle}
        </div>
      </div>
    ),
    size
  );
}
