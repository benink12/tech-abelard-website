"use client";

import { useEffect, useRef, useState } from "react";

// Replaces the old "Six stages. No surprises." process section. Reference:
// this is an original Tech Abélard composition (not modeled on any specific
// TinyWins section) — the brief asked for a scroll-driven sequence built
// from typography, positioning and motion rather than three cards, so the
// implementation reuses the same technical foundation already proven on
// this page (HomeWork.tsx's sticky-track + scroll-progress pattern) rather
// than introducing a new animation mechanism.
const SYSTEMS = [
  {
    number: "01",
    name: "Web Design",
    journey: "Website",
    idea: "Your digital foundation.",
    copy: "A fast, intentional website built to turn attention into action.",
  },
  {
    number: "02",
    name: "Local SEO",
    journey: "Discovery",
    idea: "Get discovered.",
    copy: "Help the right people find your business when they're actively searching.",
  },
  {
    number: "03",
    name: "AI Receptionist",
    journey: "Conversation",
    idea: "Never miss the opportunity.",
    copy: "Answer calls, handle common questions, qualify leads and help book appointments.",
  },
] as const;

// Below this width the continuous scroll-driven composition (which relies
// on real screen real-estate to place three things asymmetrically at once)
// is replaced by a dedicated single-system-at-a-time mobile sequence — see
// HomeSystemsMobile. Matches HomeWork.tsx's own mobile cutoff so this
// section's "mobile" agrees with the rest of the homepage's definition of
// it.
const MOBILE_BREAKPOINT = 860;

function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

// Smooth 0→1 ease across [edge0, edge1], flat outside it — the same shape
// under every animated property below, so nothing here ever needs a spring
// or a bounce to feel controlled.
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Per-system scroll zones, as fractions of the section's total scroll
// progress (0–1). Each zone: fades/rises in from `start`, holds fully
// visible between `peakStart`/`peakEnd`, fades back down by `end` — a
// smoothstep "tent", not a hard cut, so reverse-scroll unwinds exactly the
// same shape forward-scroll drew.
const INTRO_END = 0.14;
const ZONES = [
  { start: 0.14, peakStart: 0.2, peakEnd: 0.3, end: 0.36 },
  { start: 0.36, peakStart: 0.42, peakEnd: 0.52, end: 0.58 },
  { start: 0.58, peakStart: 0.64, peakEnd: 0.74, end: 0.8 },
] as const;
const CONVERGE_START = 0.8;
const CONVERGE_END = 0.92;
const JOURNEY_START = 0.92;

// Asymmetric resting spot for each system while it's being introduced
// (percentages of the stage box) — deliberately not a grid of equal
// columns. Each converges to ROW_POS (an even, aligned row) as the section
// resolves into "these work as one system."
// system 0's top was 14 — directly under the shrunk intro corner label
// (.hc-triad.is-animated .hc-triad__intro: top clamp(48px,9vh,96px), left
// var(--gutter)), which stays visible the entire time systems are being
// introduced. At 14% that block's own top-left corner sat almost exactly
// on top of the intro label, so "01 — Web Design" and "One partner. Three
// systems." rendered on top of each other, both illegible. Bumped clear of
// that zone; the other two scatter spots don't share the intro's corner so
// they were never affected.
const SCATTER_POS = [
  { top: 26, left: 4 },
  { top: 44, left: 52 },
  { top: 72, left: 10 },
] as const;
const ROW_POS = [
  { top: 46, left: 4 },
  { top: 46, left: 37 },
  { top: 46, left: 70 },
] as const;

// TOTAL_VH was a single 4.4 constant that implicitly assumed the sticky
// pin (.hc-triad__stage) is exactly 100vh tall — track height = scrub
// distance + pin height, and a position:sticky element structurally needs
// scroll equal to its OWN height to fully clear the viewport after it
// releases, regardless of where its content sits inside it. That pin
// height is what actually produced the huge blank gap reported after
// "Website → Discovery → Conversation": the payoff content sits around the
// vertical middle of the stage, so ~half of that 100vh clearing distance
// scrolled past as pure empty space before Pricing appeared.
// PIN_VH must match .hc-triad.is-animated .hc-triad__stage's height in
// home.css (currently 62vh) — shortened from 100vh so the pin clears in
// roughly 3/5 of a viewport instead of a full one. SCRUB_VH (the actual
// intro → 3 systems → converge → journey scrubbing distance) is
// deliberately untouched — same pacing, same thresholds, same positions.
const SCRUB_VH = 3.4;
const PIN_VH = 0.85;
const TOTAL_VH = SCRUB_VH + PIN_VH;

function HomeSystemsDesktop() {
  const seqRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const payoffRef = useRef<HTMLParagraphElement>(null);
  const systemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ideaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagARefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tagBRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seq = seqRef.current;
    const track = trackRef.current;
    const intro = introRef.current;
    const payoff = payoffRef.current;
    const line = lineRef.current;
    if (!seq || !track || !intro || !payoff || !line) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Default state (no JS, or reduced motion) is the plain stacked
    // reading order defined in home.css — content must never depend on JS
    // running. This class is what actually switches the section into the
    // absolute-positioned, scroll-scrubbed composition; it's added only
    // once JS has confirmed motion is allowed, mirroring the same
    // default-safe/JS-enhances pattern RevealOnScroll and MaskReveal
    // already use elsewhere on this page.
    seq.classList.add("is-animated");

    let vh = 0;
    let usable = 0;
    let queued = false;

    function measure() {
      if (!track) return;
      vh = window.visualViewport?.height ?? window.innerHeight;
      track.style.height = `${(TOTAL_VH * vh).toFixed(1)}px`;
      usable = SCRUB_VH * vh;
    }

    function frame() {
      queued = false;
      if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) return;
      if (!track || !intro || !payoff || !line) return;

      const top = track.getBoundingClientRect().top;
      const p = usable > 0 ? clamp01(-top / usable) : 0;

      // Intro: full-size and alone, then shrinks to a small persistent
      // corner label as the systems begin, then grows back (with the
      // payoff line added) once the sequence resolves.
      const shrink = smoothstep(0.02, INTRO_END - 0.01, p);
      const grow = smoothstep(0.9, 1, p);
      const introScale = 1 - shrink * 0.58 + grow * 0.36;
      const introX = shrink * -2 + grow * 2;
      const introY = shrink * -6 + grow * 6;
      intro.style.transform = `translate3d(${introX.toFixed(2)}vw, ${introY.toFixed(2)}vh, 0) scale(${introScale.toFixed(3)})`;
      intro.style.opacity = (1 - shrink * 0.4 + grow * 0.4).toFixed(3);
      payoff.style.opacity = grow.toFixed(3);
      payoff.style.transform = `translateY(${(6 - grow * 6).toFixed(2)}px)`;

      const convergeT = smoothstep(CONVERGE_START, CONVERGE_END, p);
      const journeyT = smoothstep(JOURNEY_START, 1, p);

      for (let i = 0; i < SYSTEMS.length; i++) {
        const el = systemRefs.current[i];
        const idea = ideaRefs.current[i];
        const tagA = tagARefs.current[i];
        const tagB = tagBRefs.current[i];
        if (!el || !idea || !tagA || !tagB) continue;

        const zone = ZONES[i];
        const tagIn = smoothstep(zone.start, zone.peakStart, p);
        const dominant = Math.min(
          smoothstep(zone.start, zone.peakStart, p),
          1 - smoothstep(zone.peakEnd, zone.end, p)
        );

        const top = lerp(SCATTER_POS[i].top, ROW_POS[i].top, convergeT);
        const left = lerp(SCATTER_POS[i].left, ROW_POS[i].left, convergeT);
        el.style.top = `${top.toFixed(2)}%`;
        el.style.left = `${left.toFixed(2)}%`;
        el.style.opacity = tagIn.toFixed(3);
        el.style.pointerEvents = dominant > 0.5 ? "auto" : "none";

        idea.style.opacity = (dominant * (1 - journeyT)).toFixed(3);
        idea.style.transform = `translateY(${(1 - dominant) * 10}px)`;

        tagA.style.opacity = (1 - journeyT).toFixed(3);
        tagB.style.opacity = journeyT.toFixed(3);
      }

      line.style.transform = `scaleX(${convergeT.toFixed(3)})`;
      line.style.opacity = (convergeT * (1 - journeyT * 0.35)).toFixed(3);
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
    <div className="hc-triad" ref={seqRef}>
      <div className="hc-triad__track" ref={trackRef}>
        <div className="hc-triad__stage">
          <div className="hc-triad__intro" ref={introRef}>
            <p className="hc-triad__introline">One partner.</p>
            <p className="hc-triad__introline">Three systems.</p>
            <p className="hc-triad__payoff" ref={payoffRef}>
              Built to work together.
            </p>
          </div>

          <div className="hc-triad__line" ref={lineRef} aria-hidden="true" />

          {SYSTEMS.map((system, i) => (
            <div
              className="hc-triad__system"
              key={system.number}
              ref={(el) => {
                systemRefs.current[i] = el;
              }}
            >
              <p className="hc-triad__tag">
                <span
                  className="hc-triad__tag-a"
                  ref={(el) => {
                    tagARefs.current[i] = el;
                  }}
                >
                  {system.number} — {system.name}
                </span>
                <span
                  className="hc-triad__tag-b"
                  ref={(el) => {
                    tagBRefs.current[i] = el;
                  }}
                >
                  {system.journey}
                </span>
              </p>
              <div
                className="hc-triad__idea"
                ref={(el) => {
                  ideaRefs.current[i] = el;
                }}
              >
                <p className="hc-triad__ideatext">{system.idea}</p>
                <p className="hc-triad__copy">{system.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dedicated mobile composition — not the desktop sequence at a smaller
// size. Real screen real-estate is what makes the desktop version's
// asymmetric, simultaneously-visible-at-reduced-opacity layout work; on a
// phone that same approach reads as overlapping clutter. Mobile instead
// mounts exactly one "slide" at a time (intro, each system in turn, then
// the journey + payoff) — same one-thing-at-a-time principle already used
// by HomeWorkMobile for the portfolio sequence, for the same reason:
// structurally impossible for two slides' text to overlap, since only one
// is ever in the DOM.
const MOBILE_SLIDE_COUNT = SYSTEMS.length + 2; // intro, 3 systems, final
const MOBILE_PER_SLIDE_VH = 0.72;

function HomeSystemsMobile() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let vh = 0;
    let queued = false;

    function measure() {
      if (!track) return;
      vh = window.visualViewport?.height ?? window.innerHeight;
      const totalVh = (MOBILE_SLIDE_COUNT - 1) * MOBILE_PER_SLIDE_VH + 1;
      track.style.height = `${(totalVh * vh).toFixed(1)}px`;
    }

    function frame() {
      queued = false;
      if (!window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) return;
      if (!track || vh <= 0) return;
      const top = track.getBoundingClientRect().top;
      const raw = -top / (vh * MOBILE_PER_SLIDE_VH);
      const idx = Math.min(MOBILE_SLIDE_COUNT - 1, Math.max(0, Math.round(raw)));
      setSlide((prev) => (prev === idx ? prev : idx));
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
    window.visualViewport?.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(onResize);
    frame();

    return () => {
      window.removeEventListener("scroll", onTick);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  const isIntro = slide === 0;
  const isFinal = slide === MOBILE_SLIDE_COUNT - 1;
  const systemIndex = slide - 1;

  return (
    <div className="hc-triad-m">
      <div className="hc-triad-m__track" ref={trackRef}>
        <div className="hc-triad-m__stage">
          {isIntro && (
            <div className="hc-triad-m__slide hc-triad-m__slide--intro">
              <p className="hc-triad__introline">One partner.</p>
              <p className="hc-triad__introline">Three systems.</p>
            </div>
          )}

          {!isIntro && !isFinal && (
            <div className="hc-triad-m__slide">
              <p className="hc-triad-m__tag">
                {SYSTEMS[systemIndex].number} — {SYSTEMS[systemIndex].name}
              </p>
              <p className="hc-triad__ideatext">{SYSTEMS[systemIndex].idea}</p>
              <p className="hc-triad__copy">{SYSTEMS[systemIndex].copy}</p>
            </div>
          )}

          {isFinal && (
            <div className="hc-triad-m__slide hc-triad-m__slide--final">
              <p className="hc-triad-m__journey">
                {SYSTEMS.map((s, i) => (
                  <span key={s.journey}>
                    {s.journey}
                    {i < SYSTEMS.length - 1 && <span className="hc-triad-m__arrow"> → </span>}
                  </span>
                ))}
              </p>
              <p className="hc-triad__introline">One partner.</p>
              <p className="hc-triad__introline">Three systems.</p>
              <p className="hc-triad__payoff" style={{ opacity: 1, transform: "none" }}>
                Built to work together.
              </p>
            </div>
          )}

          <div className="hc-triad-m__ticks" aria-hidden="true">
            {Array.from({ length: MOBILE_SLIDE_COUNT }).map((_, i) => (
              <i key={i} className={i === slide ? "on" : undefined} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeSystems() {
  return (
    <section className="hc-section hc-triad-section" id="systems">
      <HomeSystemsDesktop />
      <HomeSystemsMobile />
    </section>
  );
}
