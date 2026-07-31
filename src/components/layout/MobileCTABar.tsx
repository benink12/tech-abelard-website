import { Phone } from "lucide-react";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";

export function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-ink/10 bg-cream/95 p-3 backdrop-blur-md xl:hidden">
      <a
        href={site.phone.href}
        aria-label={`Call ${site.phone.display}`}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-brass-ink/40 hover:text-brass-ink"
      >
        <Phone className="h-5 w-5" />
      </a>
      <Button href="/contact" variant="ink" size="lg" className="w-full" showArrow>
        {site.cta.primary}
      </Button>
    </div>
  );
}
