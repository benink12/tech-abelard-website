"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { portfolioProjects } from "@/data/portfolio";
import { MaskReveal } from "@/components/ui/MaskReveal";

// Editorial, art-directed photography for the scroll sequence — deliberately
// separate from `project.screenshots` in @/data/portfolio (those stay
// exactly as they are; they're real product screenshots used on the actual
// /portfolio and /portfolio/[slug] case-study pages, which this section
// links out to unchanged). This mapping exists only so the homepage's
// "Selected work" sequence can read as an agency showcase — industry mood
// photography, not browser screenshots — without touching that shared data
// or the scroll-physics effect below, which knows nothing about images at
// all (it only ever moves whatever the two DOM refs point to).
const workPhotos: Record<string, { src: string; alt: string; position: string }> = {
  "aurelle-medspa": {
    src: "/work/aurelle.jpg",
    alt: "Editorial black-and-white portrait of a woman in a spa robe against sculpted archway walls",
    position: "18% 15%",
  },
  "northhaven-property-management": {
    src: "/work/northhaven.jpg",
    alt: "Modern white residential villa with a reflecting pool, shot in bright architectural daylight",
    position: "center 35%",
  },
  "northpaw-veterinary-hospital": {
    src: "/work/northpaw.jpg",
    alt: "Warm, golden-hour portrait of a golden retriever in soft rim light",
    position: "62% 25%",
  },
  "northpeak-roofing": {
    src: "/work/northpeak.jpg",
    alt: "Dramatic low-angle photograph of a dark standing-seam metal roofline against a cloudy sky",
    position: "center top",
  },
  "northclimate-hvac": {
    src: "/work/northclimate.jpg",
    alt: "Moody, warmly lit modern living room interior with plush furniture",
    position: "center 55%",
  },
  "northline-plumbing": {
    src: "/work/northline.jpg",
    alt: "Sculptural black-and-white composition of a matte black faucet fixture among rows of pale columns",
    position: "68% 60%",
  },
};

// Below this width, the continuous multi-item perspective sequence (below)
// is replaced by a much simpler, dedicated mobile implementation — see
// HomeWorkMobile. Matches the homepage's existing mobile cutoff so this
// section's "mobile" agrees with the rest of the homepage's definition of
// it. Shared as a JS constant AND hardcoded into the matching CSS media
// query below (media queries can't reference JS values) — keep both in
// sync if this ever changes.
const MOBILE_BREAKPOINT = 860;

// Scroll-driven "perspective sequence" for the portfolio — the interaction
// this redesign was built around. Ported as-is from the approved concept
// (Downloads/index_4.html): geometry solved from two reference screenshots
// at different viewport sizes (aspect 3:4, step spacing constant in vh).
// Every value is a pure function of scroll position, so reverse scroll is
// exact — do not "simplify" the math below without re-deriving it against
// those reference screenshots.
//
// H_FRAC (dominant item height, as a fraction of vh) and the 0.86 width cap
// below were originally 0.79 / 0.86 — a dominant image that read as
// oversized, filling almost the whole viewport with little surrounding
// whitespace (vs. the TinyWins reference this section is modeled on, where
// the active work item is prominent but never edge-to-edge). Both are
// scaled down by the same ~78% factor here so every item shrinks together,
// proportionally, at every scroll position — not just the active one —
// since W is the single value every item's size and the falloff/step
// spacing all derive from. G_VH/DMIN_VH (gaps and minimum step distance,
// below) are deliberately NOT scaled with W: they're already fixed
// vh-based amounts independent of image size, so as W shrinks they read as
// relatively MORE whitespace around a smaller item — exactly the effect
// wanted, for free.
//
// Desktop-only (≥ MOBILE_BREAKPOINT). Mobile has its own, deliberately much
// simpler implementation (HomeWorkMobile below) — real iOS Safari testing
// showed this continuous, all-items-absolutely-positioned-at-once approach
// (every label always mounted, distinguished only by interpolated opacity)
// is fragile there in ways a desktop browser (even with device emulation)
// doesn't surface. Rather than keep patching one shared implementation for
// two very different device classes, mobile gets its own component that
// mounts only ONE project's DOM at a time — structurally impossible for
// labels to overlap, because there is only ever one label element.
function falloff(d: number) {
  return Math.exp(-(0.3765 * d + 0.0285 * d * d + 0.0035 * d * d * d));
}

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const H_FRAC = 0.53;
const ASPECT = 0.75;
const G_VH = 0.038;
const DMIN_VH = 0.34;
// STEP is the scroll-to-progress conversion factor (how much scroll, in vh,
// each item-to-item transition consumes) — it does NOT touch the item
// falloff/positioning math (step(k) below, despite the name collision), so
// tightening it changes only how much scrolling the sequence takes, not how
// it looks at any given progress value. Was 0.9/0.22 (6.62vh total for 7
// projects); trimmed so scroll distance scales with the actual project
// count instead of a flat guess, without shortening any single transition
// enough to feel rushed.
const STEP = 0.68;
const TAIL = 0.1;
const K0 = -3;

function HomeWorkDesktop() {
  const seqRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);
  const tickRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const seq = seqRef.current;
    const track = trackRef.current;
    const items = itemRefs.current.filter((el): el is HTMLElement => Boolean(el));
    const labels = labelRefs.current.filter((el): el is HTMLElement => Boolean(el));
    const ticks = tickRefs.current.filter((el): el is HTMLElement => Boolean(el));
    const n = items.length;
    if (!seq || !track || !n) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      seq.classList.add("is-static");
      return;
    }

    let W = 0;
    let vh = 0;
    let vw = 0;
    let X0 = 0;
    let usable = 0;
    let KN: number[] = [];

    function step(k: number) {
      return Math.max(W * Math.min(falloff(k), 1.8) + G_VH * vh, DMIN_VH * vh);
    }

    function measure() {
      if (!track) return;
      // visualViewport.height is what's actually visible on mobile Safari
      // (excludes the collapsed/expanded dynamic toolbar); window.innerHeight
      // can briefly disagree with it. Falls back cleanly where unsupported.
      vh = window.visualViewport?.height ?? window.innerHeight;
      vw = window.visualViewport?.width ?? window.innerWidth;
      W = Math.min(H_FRAC * vh * ASPECT, 0.58 * vw);
      for (let i = 0; i < n; i++) items[i].style.width = `${W.toFixed(1)}px`;
      X0 = Math.max(20, Math.min(0.05 * vw, 64));
      // Set the track's scroll-distance in PIXELS derived from this same
      // measured `vh`, not as a raw CSS "vh" string — see the desktop-only
      // note above for why that mismatch was the root cause of the mobile
      // bug this component no longer has to handle.
      const totalVh = (n - 1) * STEP + 1 + TAIL;
      track.style.height = `${(totalVh * vh).toFixed(1)}px`;
      usable = (n - 1) * STEP * vh;

      KN = [];
      for (let k = K0; k <= n + 2; k++) KN.push(0);
      const zi = -K0;
      KN[zi] = 0;
      for (let a = zi; a < KN.length - 1; a++) KN[a + 1] = KN[a] + step(a + K0);
      for (let c = zi; c > 0; c--) KN[c - 1] = KN[c] - step(c - 1 + K0);
    }

    function offsetAt(d: number) {
      const i = Math.floor(d);
      let t = d - i;
      let j = i - K0;
      if (j < 1) {
        j = 1;
        t = 0;
      }
      if (j > KN.length - 3) {
        j = KN.length - 3;
        t = 1;
      }
      const p0 = KN[j - 1];
      const p1 = KN[j];
      const p2 = KN[j + 1];
      const p3 = KN[j + 2];
      const t2 = t * t;
      const t3 = t2 * t;
      return (
        0.5 *
        (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
      );
    }

    let active = -1;
    let queued = false;

    function frame() {
      queued = false;
      // No-op while the mobile layout is showing this section (display:none)
      // — avoids paying for getBoundingClientRect/layout work on a hidden,
      // irrelevant tree every scroll tick.
      if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) return;
      if (!track) return;
      const top = track.getBoundingClientRect().top;
      let t = usable > 0 ? -top / usable : 0;
      if (t < 0) t = 0;
      else if (t > 1) t = 1;

      const raw = t * (n - 1);
      const b = Math.min(Math.floor(raw), n - 1);
      const pos = b + ease(raw - b);

      for (let i = 0; i < n; i++) {
        const d = i - pos;
        const s = Math.min(falloff(d), 1.8);
        const x = X0 + offsetAt(d);
        const o = d >= 0 ? 1 : Math.max(0, 1 + d * 1.05);
        if (x > vw + 60 || o <= 0.001) {
          items[i].style.visibility = "hidden";
          continue;
        }
        items[i].style.visibility = "visible";
        items[i].style.transform = `translate3d(${x.toFixed(1)}px,-50%,0) scale(${s.toFixed(4)})`;
        items[i].style.opacity = o.toFixed(3);
        items[i].style.zIndex = String(500 - Math.round(d * 12));
        items[i].style.pointerEvents = Math.abs(d) < 0.4 ? "auto" : "none";

        // Plateau width must stay under 1 (the index spacing between
        // adjacent items) — at 1.3 wide this used to overlap the next
        // item's plateau for ~30% of every transition, showing two fully
        // opaque labels stacked on screen at once. 0.65 wide (-0.15 to
        // 0.5) can't overlap a neighbor's copy of itself one index away,
        // so at most one label is ever fully opaque; the two falloff
        // slopes still cross mid-transition for a brief, genuine
        // crossfade rather than a hard cut.
        const lo =
          d < -0.15 ? Math.max(0, 1 + (d + 0.15) * 1.6) : d <= 0.5 ? 1 : Math.max(0, 1 - (d - 0.5) / 0.7);
        const label = labels[i];
        if (label) {
          label.style.transform = `scale(${(1 / s).toFixed(4)})`;
          label.style.opacity = lo.toFixed(3);
          label.style.pointerEvents = lo > 0.9 ? "auto" : "none";
        }
      }

      for (let k = 0; k < ticks.length; k++) {
        const dk = k - pos;
        ticks[k].style.height = `${(dk < -0.5 ? 5 : Math.max(5, 36 * falloff(Math.max(dk, 0)))).toFixed(1)}px`;
      }
      const cur = Math.round(pos);
      if (cur !== active) {
        active = cur;
        for (let m = 0; m < ticks.length; m++) ticks[m].classList.toggle("on", m === active);
      }
    }

    function onTick() {
      if (!queued) {
        queued = true;
        requestAnimationFrame(frame);
      }
    }
    function onResize() {
      measure();
      frame();
    }

    measure();
    window.addEventListener("scroll", onTick, { passive: true });
    window.addEventListener("resize", onResize);
    // iOS Safari doesn't reliably fire `resize` on window when its dynamic
    // toolbar collapses/expands during scroll — visualViewport's own resize
    // event is what actually catches that, so re-measure on it too.
    window.visualViewport?.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(onResize);
    frame();

    return () => {
      window.removeEventListener("scroll", onTick);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="hc-pseq" ref={seqRef}>
      <div className="hc-ptrack" ref={trackRef}>
        <div className="hc-pstage">
          {portfolioProjects.map((project, i) => {
            const photo = workPhotos[project.slug];
            return (
              <article
                key={project.slug}
                className="hc-pitem"
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="hc-pmedia"
                  aria-label={`${project.name} — ${project.niche}`}
                >
                  <div className={`hc-art hc-art-${(i % 6) + 1}`} />
                  {photo && (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="40vw"
                      style={{ objectFit: "cover", objectPosition: photo.position }}
                    />
                  )}
                </Link>
                <div
                  className="hc-plabel"
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                >
                  <Link href={`/portfolio/${project.slug}`}>
                    <b>{project.name}</b>
                    <span>{project.niche}</span>
                  </Link>
                </div>
              </article>
            );
          })}
          <div className="hc-pticks" aria-hidden="true">
            {portfolioProjects.map((project, i) => (
              <i
                key={project.slug}
                ref={(el) => {
                  tickRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated mobile implementation. Deliberately NOT the desktop's sticky
// perspective-stage physics at a smaller size, and deliberately not the
// previous mobile approach either (one sticky 100vh stage + a hard
// Math.floor()-derived activeIndex mounting only one project's DOM at a
// time). Real iPhone Safari testing showed that sticky-stage approach
// reading as jumpy/artificial — a project would suddenly BECOME the active
// one rather than smoothly becoming it, and the giant calculated track
// height was fragile around Safari's dynamic toolbar.
//
// This version uses plain, normal document scroll: every project is a real,
// always-mounted block in normal flow, one after another, spaced with
// ordinary margin — nothing sticky, no oversized synthetic scroll track.
// Continuous scale/opacity is layered on top as a pure function of each
// card's OWN measured distance from the viewport's vertical center,
// recomputed on every scroll tick and written directly via el.style (no
// React state per pixel — matches the imperative rAF pattern the desktop
// sequence and HomeSystems already use). Because it's a continuous function
// of real element position rather than a derived integer index, there is no
// "current project" to jump between: reverse-scroll falls out of the same
// math for free, exactly like the desktop sequence.
const MOBILE_FAR_SCALE = 0.64;
const MOBILE_FAR_OPACITY = 0.65;
// How far (in viewport-heights) a card's center can be from the viewport's
// center before it's fully at MOBILE_FAR_SCALE/OPACITY. ~0.85vh means a
// card one screen away from center is already at its smallest/dimmest, and
// the grow/shrink happens gradually across the scroll between neighboring
// projects — never a hard snap.
const MOBILE_ACTIVATION_RANGE_VH = 0.85;

function smoothstep01(t: number) {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}

function HomeWorkMobile() {
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const n = portfolioProjects.length;

  useEffect(() => {
    const list = listRef.current;
    if (!list || !n) return;

    // Reduced motion: bail entirely, leaving every card at the plain CSS
    // default (scale 1, opacity 1) — a simple, fully readable vertical
    // list with no continuous scaling at all.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let vh = 0;
    let queued = false;

    function frame() {
      queued = false;
      // No-op once the desktop layout is showing instead (display:none on
      // this tree) — same reasoning as the desktop effect's mirrored guard.
      if (!window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) return;
      vh = window.visualViewport?.height ?? window.innerHeight;
      if (vh <= 0) return;
      const viewportCenter = vh / 2;
      const range = vh * MOBILE_ACTIVATION_RANGE_VH;

      for (let i = 0; i < n; i++) {
        const card = cardRefs.current[i];
        const media = mediaRefs.current[i];
        if (!card || !media) continue;
        const r = card.getBoundingClientRect();
        const cardCenter = r.top + r.height / 2;
        const dist = Math.abs(cardCenter - viewportCenter);
        const progress = smoothstep01(1 - dist / range);
        const scale = MOBILE_FAR_SCALE + progress * (1 - MOBILE_FAR_SCALE);
        const opacity = MOBILE_FAR_OPACITY + progress * (1 - MOBILE_FAR_OPACITY);
        // Card opacity (image + label together) is the "understated vs.
        // prominent" signal; scale is applied only to the media so label
        // text never itself shrinks to an unreadable size — same division
        // of responsibility as the desktop sequence's image-scales/
        // label-stays-legible split.
        card.style.opacity = opacity.toFixed(3);
        media.style.transform = `scale(${scale.toFixed(4)})`;
      }
    }

    function onTick() {
      if (!queued) {
        queued = true;
        requestAnimationFrame(frame);
      }
    }

    window.addEventListener("scroll", onTick, { passive: true });
    window.addEventListener("resize", onTick);
    window.visualViewport?.addEventListener("resize", onTick);
    if (document.fonts?.ready) document.fonts.ready.then(onTick);
    frame();

    return () => {
      window.removeEventListener("scroll", onTick);
      window.removeEventListener("resize", onTick);
      window.visualViewport?.removeEventListener("resize", onTick);
    };
  }, [n]);

  return (
    <div className="hc-pgal-m" ref={listRef}>
      {portfolioProjects.map((project, i) => {
        const photo = workPhotos[project.slug];
        return (
          <article
            key={project.slug}
            className="hc-pgal-m__card"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <Link
              href={`/portfolio/${project.slug}`}
              className="hc-pgal-m__media hc-pmedia"
              aria-label={`${project.name} — ${project.niche}`}
              ref={(el) => {
                mediaRefs.current[i] = el;
              }}
            >
              <div className={`hc-art hc-art-${(i % 6) + 1}`} />
              {photo && (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="90vw"
                  style={{ objectFit: "cover", objectPosition: photo.position }}
                />
              )}
            </Link>
            <div className="hc-pgal-m__label">
              <Link href={`/portfolio/${project.slug}`}>
                <b>{project.name}</b>
                <span>{project.niche}</span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function HomeWork() {
  return (
    <section className="hc-section" id="work" style={{ paddingBottom: 0 }}>
      <div className="hc-wrap">
        <p className="hc-eyebrow">Selected work</p>
        <h2 className="hc-h2" style={{ margin: "18px 0 20px", maxWidth: "18ch" }}>
          <MaskReveal>Luxury. Platforms. Healthcare. Trades.</MaskReveal>
        </h2>
        <p className="hc-lede">
          Every project below is a concept build created to demonstrate our own capabilities across different
          home-service and specialty niches — each architected for its industry&apos;s actual buying behaviour, not
          a generic template stretched to fit.
        </p>
      </div>

      <HomeWorkDesktop />
      <HomeWorkMobile />

      <div className="hc-wrap" style={{ paddingBottom: "clamp(40px,5vw,64px)" }}>
        <p className="hc-worknote">Concept builds — no client campaign data, no fabricated rankings or traffic figures.</p>
        <div className="hc-hero__ctas" style={{ marginTop: 26 }}>
          <Link href="/portfolio" className="hc-btn hc-btn--ghost" data-cta="home-work-view-portfolio">
            See Our Work <span className="hc-btn__arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
