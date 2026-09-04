import Image from "next/image";
import { site } from "@/data/site";

// Cropped/positioned via CSS (see .hc-wordmark* in src/styles/home.css) —
// the source file itself is untouched, full-canvas 1536x1024. `width`/
// `height` are the intrinsic render size Next.js optimizes down to — the
// header uses the base 206x137 crop; the footer's much larger closing
// signature passes a bigger intrinsic size so it stays crisp instead of
// upscaling a tiny source.
export function Wordmark({
  width = 206,
  height = 137,
  priority = false,
}: {
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    <span className="hc-wordmark__crop">
      <Image
        src="/images/tech-abelard-wordmark-black.png"
        alt={site.name}
        width={width}
        height={height}
        className="hc-wordmark__img"
        priority={priority}
      />
    </span>
  );
}
