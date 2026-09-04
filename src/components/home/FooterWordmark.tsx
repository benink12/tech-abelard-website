import Image from "next/image";
import { site } from "@/data/site";

// The footer's single-line "TECH ABÉLARD®" mark. The original supplied
// file (public/images/tech-abelard-footer-wordmark.png, 2172x724, still on
// disk untouched) has the actual lettering occupying only the middle 24%
// of the canvas height — roughly 550px of pure transparent padding above
// and below the glyphs — which is what made every rendered instance carry
// a huge invisible-but-space-occupying margin no amount of container CSS
// could remove. tech-abelard-footer-wordmark-cropped.png is a pixel crop
// of that same file (2057x212) — same artwork, same pixels, same
// transparency, just trimmed to the content's own bounding box plus a
// small intentional margin (30px sides / 20px top-bottom in source-px
// terms). No redraw, no distortion, no recolor. `width` sets the rendered
// box; height is derived from the (now-correct) aspect ratio.
const SOURCE_WIDTH = 2057;
const SOURCE_HEIGHT = 212;

export function FooterWordmark({
  width,
  className,
  priority = false,
}: {
  width: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/tech-abelard-footer-wordmark-cropped.png"
      alt={site.name}
      width={SOURCE_WIDTH}
      height={SOURCE_HEIGHT}
      className={className}
      style={{ width: "100%", maxWidth: width, height: "auto" }}
      priority={priority}
    />
  );
}
