import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "#1c2230",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
          <path d="M4 7h13M10.5 7v18" stroke="#b08d57" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M15 25 22 7l7 18M17.2 19h9.6"
            stroke="#b08d57"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
