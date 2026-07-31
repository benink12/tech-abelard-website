import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink text-cream">
      <Container className="pb-32 pt-16 xl:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="cream" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">{site.description}</p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-cream/50 transition-colors hover:text-brass"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-cream/50 transition-colors hover:text-brass"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {site.footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass">{column.title}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cta={link.href === "/free-audit" ? "footer-free-audit" : undefined}
                      className="text-sm text-cream/65 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass">Contact</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-cream/65">
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 transition-colors hover:text-cream">
                  <Mail className="h-4 w-4" /> {site.email}
                </a>
              </li>
              <li>
                <a href={site.phone.href} className="flex items-center gap-2 transition-colors hover:text-cream">
                  <Phone className="h-4 w-4" /> {site.phone.display}
                </a>
              </li>
              <li className="pt-1 text-cream/45">{site.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-cream/10 pt-8 sm:flex-row">
          <p className="text-xs text-cream/45">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-cream/35">Built for Canada&apos;s home service businesses.</p>
        </div>
      </Container>
    </footer>
  );
}
