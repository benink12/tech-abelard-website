import Image from "next/image";
import { site } from "@/data/site";

// The header's compact mark — deliberately NOT the Wordmark component used
// in the footer (see src/components/home/Wordmark.tsx). This is a
// byte-identical copy of the actual favicon (src/app/icon.png, 512x512,
// transparent) at public/logo/ta-favicon-mark.png — the same "T\" mark
// already live in the browser tab/bookmarks, reused here instead of
// inventing a new logo treatment. 512px source gives a comfortable margin
// over any on-screen header size at 3x DPI, so next/image's automatic
// srcset renders it crisp on Retina without upscaling artifacts.
export function TaMark({ size = 34, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src="/logo/ta-favicon-mark.png"
      alt={site.name}
      width={512}
      height={512}
      className="hc-tamark__img"
      style={{ width: size, height: size }}
      priority={priority}
    />
  );
}
