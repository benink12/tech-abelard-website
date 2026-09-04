"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Automatic (non-scroll) two-state word-FLIP hero. Same technique used
// elsewhere on this homepage — persistent phrase elements whose real DOM
// position is measured per composition (getBoundingClientRect, not guessed
// math) and transform-animated between them — but here the trigger is a
// fixed hold/transition timer loop, not scroll progress. Two states only,
// the same three phrase-tokens in a different order/position each time:
//   State 1: "How people find you" / "changes your business"
//   State 2: "Your business changes" / "how people find you"
// "changes" and "your business" swap order within whichever line they
// share, and the dominant (line 1) vs secondary (line 2) ROLE itself swaps
// between the two states — whichever phrase stands alone always takes the
// dominant slot, so both the words AND which slot is "dominant" visibly
// travel, not just a fade between two static blocks.

interface TokenDef {
  id: string;
  text: string;
}
interface PositionDef {
  align: "left" | "right";
  tokenIds: string[];
}
type Pos = { x: number; y: number };

const TOKENS: TokenDef[] = [
  { id: "hpfy", text: "How people find you" },
  { id: "changes", text: "changes" },
  { id: "yb", text: "your business" },
];
const TOKENS_BY_ID = new Map(TOKENS.map((t) => [t.id, t]));

const COMPOSITIONS: PositionDef[][] = [
  [
    { align: "left", tokenIds: ["hpfy"] },
    { align: "right", tokenIds: ["changes", "yb"] },
  ],
  [
    { align: "left", tokenIds: ["yb", "changes"] },
    { align: "right", tokenIds: ["hpfy"] },
  ],
];

const SR_TEXT = "How people find you changes your business. Your business changes how people find you.";

// Hold ~2.5–3s per state, transform ~0.9–1.3s, elegant editorial easing —
// no bounce, no spring.
const HOLD_MS = 2800;
const TRANSITION_MS = 1100;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export function HeroWordMorph() {
  const canvasRef = useRef<HTMLHeadingElement>(null);
  const probeRefs = useRef<Record<number, Record<string, HTMLSpanElement | null>>>({});
  const wordRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const positionsRef = useRef<Pos[][] | null>(null);
  const stateRef = useRef(0);

  const [interactive, setInteractive] = useState(false);
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState<number | null>(null);

  const applyState = useCallback((index: number, animate: boolean) => {
    const positions = positionsRef.current;
    if (!positions) return;
    stateRef.current = index;
    TOKENS.forEach((token, i) => {
      const el = wordRefs.current[token.id];
      if (!el) return;
      el.style.transition = animate ? `transform ${TRANSITION_MS}ms ${EASING}` : "none";
      const p = positions[index][i];
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    });
  }, []);

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();

    const positions: Pos[][] = COMPOSITIONS.map((_, ci) =>
      TOKENS.map((token) => {
        const el = probeRefs.current[ci]?.[token.id];
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left - canvasRect.left, y: r.top - canvasRect.top };
      })
    );
    positionsRef.current = positions;

    let maxHeight = 0;
    Object.values(probeRefs.current).forEach((tokenMap) => {
      Object.values(tokenMap || {}).forEach((el) => {
        if (!el) return;
        const bottom = el.getBoundingClientRect().bottom - canvasRect.top;
        maxHeight = Math.max(maxHeight, bottom);
      });
    });
    setHeight(Math.ceil(maxHeight));
    setReady(true);
    // Re-settle at whatever state is currently showing (covers resize
    // mid-cycle) rather than snapping back to composition 1.
    applyState(stateRef.current, false);
  }, [applyState]);

  // Decide once, on mount, whether this is the reduced-motion path. If so,
  // never engage the interactive/measured layer at all — the always-present
  // static fallback (composition 1, plain flow, never animates) stays as
  // the permanent, final render.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInteractive(true);
  }, []);

  useEffect(() => {
    if (!interactive) return;
    let cancelled = false;
    const run = () => {
      if (!cancelled) measure();
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(run);
    } else {
      run();
    }
    const onResize = () => {
      if (!cancelled) measure();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [interactive, measure]);

  // Autoplay loop: hold → transition → hold → transition back → repeat.
  // The interval between flip-triggers is HOLD_MS the very first time
  // (state 1 just needs its initial hold before the first flip), then
  // TRANSITION_MS + HOLD_MS after that — so each hold is measured from when
  // the PREVIOUS transition actually finished settling, not from when it
  // started, matching the brief's hold→transform→hold→transform rhythm.
  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let timeoutId: number;

    function schedule(delay: number) {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        if (document.hidden) {
          // A hidden tab still fires timers; skip this flip and check again
          // shortly rather than let several queue up while backgrounded.
          schedule(1000);
          return;
        }
        const next = stateRef.current === 0 ? 1 : 0;
        applyState(next, true);
        schedule(TRANSITION_MS + HOLD_MS);
      }, delay);
    }

    schedule(HOLD_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [ready, applyState]);

  return (
    <h1
      className="hc-h1 hc-hero__morph-canvas"
      ref={canvasRef}
      style={height !== null ? { height } : undefined}
    >
      <span className="sr-only">{SR_TEXT}</span>

      <div
        className={`hc-hero__morph-fallback${ready ? " hc-hero__morph-fallback--hidden" : ""}`}
        aria-hidden="true"
      >
        {COMPOSITIONS[0].map((pos, pi) => (
          <div key={pi} className={`hc-hero__morph-line hc-hero__morph-line--${pos.align}`}>
            {pos.tokenIds.map((id) => (
              <span key={id}>{TOKENS_BY_ID.get(id)!.text}</span>
            ))}
          </div>
        ))}
      </div>

      {interactive && (
        <div className="hc-hero__morph-probes" aria-hidden="true">
          {COMPOSITIONS.map((comp, ci) => (
            <div key={ci} className="hc-hero__morph-probe">
              {comp.map((pos, pi) => (
                <div key={pi} className={`hc-hero__morph-line hc-hero__morph-line--${pos.align}`}>
                  {pos.tokenIds.map((id) => (
                    <span
                      key={id}
                      ref={(el) => {
                        if (!probeRefs.current[ci]) probeRefs.current[ci] = {};
                        probeRefs.current[ci][id] = el;
                      }}
                    >
                      {TOKENS_BY_ID.get(id)!.text}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {interactive && (
        <div className={`hc-hero__morph-live${ready ? " hc-hero__morph-live--visible" : ""}`} aria-hidden="true">
          {TOKENS.map((token) => (
            <span
              key={token.id}
              className="hc-hero__word"
              ref={(el) => {
                wordRefs.current[token.id] = el;
              }}
            >
              {token.text}
            </span>
          ))}
        </div>
      )}
    </h1>
  );
}
