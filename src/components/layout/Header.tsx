"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeaderLogo } from "@/components/layout/HeaderLogo";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Portal target (document.body) only exists client-side.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    // iOS Safari doesn't reliably block background rubber-band scroll from
    // `overflow: hidden` alone while a `position: fixed` overlay is open —
    // pinning the body itself (and restoring the exact scroll offset after)
    // is the combination that actually holds on real devices.
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const menu = mobileMenuRef.current;
    if (!menu) return;

    const focusableSelector = 'a[href], button:not([disabled])';
    const focusableElements = () => Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector));
    const firstFocusableElement = focusableElements()[0];
    firstFocusableElement?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const elements = focusableElements();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "pointer-events-none sticky top-0 z-50 w-full pt-[env(safe-area-inset-top)] transition-all duration-300 [transform:translateZ(0)]",
        scrolled ? "border-b border-ink/8 bg-cream/85 backdrop-blur-md" : "border-b border-transparent bg-cream/0",
        // The mobile nav overlay is portaled to <body> and only covers the
        // viewport *below* this header (see the portal below for why), so
        // the header itself must stay fully opaque whenever the menu is
        // open — otherwise its normal scroll-position-based transparency
        // lets page content bleed through behind the logo/close button,
        // visible above the solid overlay.
        menuOpen && "border-b border-ink/8 bg-cream backdrop-blur-none"
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" onClick={() => setMenuOpen(false)} className="pointer-events-auto flex items-center">
          <HeaderLogo />
        </Link>

        <nav aria-label="Primary navigation" className="pointer-events-auto hidden items-center gap-8 xl:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pointer-events-auto hidden items-center gap-3 xl:flex">
          <Button href="/audit" variant="outline" size="md" data-cta="nav-free-audit">
            Free Audit
          </Button>
          <Button href="/contact" size="md" showArrow>
            {site.cta.primary}
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full text-ink xl:hidden"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {mounted &&
        menuOpen &&
        createPortal(
          // Rendered via portal into document.body, not as a descendant of
          // <header> above: that element carries `transform:translateZ(0)`
          // unconditionally (plus `backdrop-blur-md` once scrolled), and
          // either one makes an ancestor the containing block for a
          // `position: fixed` descendant per spec — the fixed nav's
          // top/bottom then resolve against the ~80px-tall header box
          // instead of the viewport, collapsing it to an invisible sliver
          // in every browser (not just the WebKit-only bug this was
          // previously suspected to be). Portaling out of that subtree
          // entirely is the fix that holds regardless of future header
          // style changes.
          <nav
            ref={mobileMenuRef}
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="pointer-events-auto fixed inset-x-0 bottom-0 top-[calc(5rem+env(safe-area-inset-top))] z-[60] overflow-y-auto bg-cream xl:hidden"
            style={{ WebkitTextSizeAdjust: "100%", textSizeAdjust: "100%" }}
          >
            <Container className="flex flex-col gap-1 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-ink/8 py-2.5 font-display text-[20px] font-medium leading-[1.3] text-ink"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-8 flex flex-col gap-3">
                <Button
                  href="/audit"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  data-cta="nav-free-audit-mobile"
                  onClick={closeMenu}
                >
                  Free Audit
                </Button>
                <Button href="/contact" size="lg" className="w-full" showArrow onClick={closeMenu}>
                  {site.cta.primary}
                </Button>
              </div>
            </Container>
          </nav>,
          document.body
        )}
    </header>
  );
}
