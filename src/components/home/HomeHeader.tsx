"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { site } from "@/data/site";
import { homeFontClassName } from "@/lib/fonts/home";
import { TaMark } from "@/components/home/TaMark";

export function HomeHeader() {
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  // menuOpen is the logical/target state — what aria-expanded, the
  // scroll-lock, the focus trap, and the backdrop/panel's own "is-open"
  // class all key off, and it flips the instant a tap registers (set
  // directly in the click handlers below, not in an effect, so there's
  // nothing async between tap and state change). panelMounted exists only
  // so the backdrop+panel get a real EXIT animation: React unmounts a
  // conditionally-rendered node immediately, which would cut the
  // close transition off before it plays. Opening sets panelMounted
  // synchronously in the same click handler that sets menuOpen — no
  // enter-animation trick needed on the mount side, because the CSS below
  // uses @starting-style to animate from on its own the first time
  // .is-open is present on a newly-inserted node. Closing just clears
  // menuOpen (panel starts transitioning to its closed styles immediately,
  // still mounted); the effect below removes it from the DOM only once
  // that transition has had time to finish.
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelMounted, setPanelMounted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  // .hc-header is position:fixed (see home.css for why — position:sticky
  // measurably does not stick here: a plain sticky test element placed as
  // a direct child of the .home-concept wrapper this component renders
  // into stays glued to its in-flow position and scrolls away like static
  // content, confirmed with getBoundingClientRect() at multiple scroll
  // depths, while the exact same element one level up, as a direct child
  // of <body>, sticks correctly. Every standard containing-block-breaking
  // property was checked and ruled out — transform, filter, perspective,
  // contain, isolation, overflow on every ancestor up to <html>, body's
  // flex layout. Fixed positioning sidesteps the mystery entirely, at the
  // cost of needing to reserve its height manually so removing it from
  // flow doesn't yank the hero up underneath it — that's what spacerHeight
  // does below.
  const [spacerHeight, setSpacerHeight] = useState(0);

  useEffect(() => {
    const header = headerRef.current;
    if (!header || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      // offsetHeight (border-box), not entry.contentRect (content-box only)
      // — .hc-header carries a 1px border-bottom once .is-stuck, and the
      // spacer needs to match the element's full rendered footprint.
      setSpacerHeight(header.offsetHeight);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Must match the transition duration on .hc-mobilenav-panel /
  // .hc-mobilenav-backdrop in home.css.
  const EXIT_ANIMATION_MS = 340;

  useEffect(() => {
    if (menuOpen || !panelMounted) return;
    const timeout = window.setTimeout(() => setPanelMounted(false), EXIT_ANIMATION_MS);
    return () => window.clearTimeout(timeout);
  }, [menuOpen, panelMounted]);

  function openMenu() {
    setPanelMounted(true);
    setMenuOpen(true);
  }

  // Floating-header hide/show — direction-based with hysteresis, not a
  // raw "did y increase" check. TOP_LOCK keeps the header always visible
  // near the top of the page (scroll gestures there shouldn't hide it);
  // past that, THRESHOLD is how far scroll has to move in one direction
  // *since the last flip* before the header reacts — a plain "did y go up
  // or down since the last event" comparison flickers under trackpad
  // momentum scrolling, where individual scroll events can briefly reverse
  // by a pixel or two mid-gesture. Anchoring to the position of the last
  // flip (not the last event) absorbs that noise without adding a
  // perceptible delay to genuine direction changes.
  useEffect(() => {
    const TOP_LOCK = 72;
    const THRESHOLD = 8;

    let raf = 0;
    let anchorY = window.scrollY;

    function apply() {
      raf = 0;
      const y = window.scrollY;

      if (y <= TOP_LOCK) {
        setStuck(y > 12);
        setHidden(false);
        anchorY = y;
        return;
      }

      setStuck(true);
      const delta = y - anchorY;
      if (delta > THRESHOLD) {
        setHidden(true);
        anchorY = y;
      } else if (delta < -THRESHOLD) {
        setHidden(false);
        anchorY = y;
      }
    }

    function onScroll() {
      if (!raf) raf = window.requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Same iOS-safe body-pin technique as the site-wide Header (see
  // src/components/layout/Header.tsx) — plain overflow:hidden doesn't
  // reliably block rubber-band scroll behind a position:fixed overlay.
  useEffect(() => {
    if (!menuOpen) return;
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
    const nav = mobileNavRef.current;
    if (!nav) return;

    const focusableSelector = "a[href], button:not([disabled])";
    const focusable = () => Array.from(nav.querySelectorAll<HTMLElement>(focusableSelector));
    focusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
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
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const headerClass = [
    "hc-header",
    stuck && "is-stuck",
    hidden && !menuOpen && "is-hidden",
    menuOpen && "is-menu-open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Reserves the space .hc-header would otherwise occupy — fixed
          positioning takes it out of flow entirely, so without this the
          hero would jump up underneath it. Height stays in sync via the
          ResizeObserver above regardless of hide/show state (transform
          doesn't change layout size) or viewport/safe-area changes. */}
      <div className="hc-header-spacer" style={{ height: spacerHeight }} aria-hidden="true" />
      <header ref={headerRef} className={headerClass}>
        <div className="hc-header__in">
          <div className="hc-navpill">
            <Link href="/" className="hc-tamark" onClick={closeMenu} aria-label={`${site.name} — Home`}>
              <TaMark priority />
            </Link>

            <nav className="hc-header__links" aria-label="Primary">
              {site.nav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              ref={menuButtonRef}
              type="button"
              className={`hc-burger${menuOpen ? " is-open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-controls="home-mobile-nav"
              aria-expanded={menuOpen}
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
            >
              <span className="hc-burger__lines" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>

          {/* Top-right header pill only — intentionally hardcoded, not
              site.cta.primary ("Book a Discovery Call"), which every other
              CTA on the site still uses and must keep using unchanged. */}
          <Link href="/updates" className="hc-header__cta" data-cta="home-header-latest-updates">
            Latest Updates
          </Link>
        </div>

        {mounted &&
          panelMounted &&
          createPortal(
            <>
              {/* Layer 1 (bottom): full-viewport blur over the REAL live page
                  — not a screenshot/duplicate, backdrop-filter samples
                  whatever is actually rendered behind this element. Tapping
                  it is "tap outside the menu" — closeMenu. Sits under the
                  panel; it doesn't need to know the panel's height, because
                  the panel's own opaque background is what keeps the top
                  region reading as sharp. */}
              <div
                className={`hc-mobilenav-backdrop${menuOpen ? " is-open" : ""}`}
                aria-hidden="true"
                onClick={closeMenu}
              />
              {/* Layer 2 (top): sharp, opaque, content-height panel — no blur
                  on this element or anything inside it. */}
              <div
                className={`home-concept ${homeFontClassName} hc-mobilenav-panel hc-section--dark${menuOpen ? " is-open" : ""}`}
                id="home-mobile-nav"
                ref={mobileNavRef}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                aria-hidden={!menuOpen}
              >
                <div className="hc-mobilenav__top">
                  <span className="hc-tamark" aria-label={`${site.name} — Home`}>
                    <TaMark />
                  </span>
                  <button type="button" className="hc-mobilenav__close" aria-label="Close menu" onClick={closeMenu}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <ul className="hc-mobilenav__list">
                  {site.nav.map((item) => (
                    <li key={item.href} className="hc-mobilenav__item">
                      <Link href={item.href} onClick={closeMenu} className="hc-mobilenav__label">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="hc-mobilenav__foot">
                  <span className="hc-mobilenav__foot-label">Ready to grow?</span>
                  <Link
                    href="/contact"
                    className="hc-mobilenav__foot-cta"
                    onClick={closeMenu}
                    data-cta="home-mobilenav-book-call"
                  >
                    {site.cta.primary}
                  </Link>
                </div>
              </div>
            </>,
            document.body
          )}
      </header>
    </>
  );
}
