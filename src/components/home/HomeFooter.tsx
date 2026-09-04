import Link from "next/link";
import { site } from "@/data/site";
import { FooterWordmark } from "@/components/home/FooterWordmark";

// Reference: live tinywins.com, measured directly (not guessed).
//   - <footer> is `position: sticky; bottom: 0`, height 723.68px in a
//     737px viewport (98%) — the last element in the document, so once
//     you've scrolled to the end it pins flush to the bottom and stays.
//   - Their closing wordmark is a genuine <img> (not live text) sized
//     1438x357 in a 1470px viewport — 97.8% of viewport width, with only
//     ~16px of side padding. Confirms an image-based mark is the right
//     approach here too, and sets the real target: near-full-bleed width,
//     minimal padding, not a contained/max-width column like the rest of
//     the footer's text content.
//
// Order (per brief): contact (gray label + large black email) first, then
// the minimal nav, then the closing wordmark pushed to the true bottom of
// the sticky panel via margin-top:auto on the mark itself — nothing
// after it, no leftover space below it.
//
// site.footerColumns[0] ("Agency": Services/Portfolio/Process/About) is
// exactly the four links asked for — reused directly rather than
// hardcoded so it can't drift from the real nav.
const primaryLinks = site.footerColumns.find((c) => c.title === "Agency")?.links ?? [];

export function HomeFooter() {
  return (
    <footer className="hc-footer">
      <div className="hc-footer__content">
        <p className="hc-footer__label">Let&rsquo;s Work Together</p>
        <a href={`mailto:${site.email}`} className="hc-footer__email">
          {site.email}
        </a>

        <nav className="hc-footer__nav" aria-label="Footer">
          <ul>
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Link href="/" aria-label={`${site.name} — Home`} className="hc-footer__mark">
        {/* No width cap — TinyWins' own reference mark measured `max-w-none`,
            always 100% of its container regardless of screen size. */}
        <FooterWordmark width={4000} />
      </Link>
    </footer>
  );
}
