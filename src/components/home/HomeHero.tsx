import { site } from "@/data/site";
import { HeroWordMorph } from "@/components/home/HeroWordMorph";

// Deterministic pseudo-random in [0, 1) — Math.random() during render trips
// React's purity rule (react-hooks/purity) even in a Server Component. Same
// seed always produces the same value, so this stays a pure function.
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Server-rendered decorative waveform — a fixed set of bars with
// deterministically-varied timing. Rendered once on the server (no client
// JS needed, no hydration mismatch risk since nothing ever re-renders these
// client-side).
function Waveform() {
  const bars = Array.from({ length: 64 }, (_, i) => ({
    key: i,
    delay: (-(pseudoRandom(i) * 1.9)).toFixed(2),
    duration: (1.3 + pseudoRandom(i + 100) * 1.4).toFixed(2),
  }));

  return (
    <div className="hc-wave" aria-hidden="true">
      {bars.map((bar) => (
        <i key={bar.key} style={{ animationDelay: `${bar.delay}s`, animationDuration: `${bar.duration}s` }} />
      ))}
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="hc-hero">
      <div className="hc-wrap">
        <HeroWordMorph />
      </div>
      <div className="hc-signal">
        <div className="hc-signal__in">
          <div className="hc-signal__words">
            <b>Web Design</b>
            <span>/</span>
            <b>Local SEO</b>
            <span>/</span>
            <b>AI Receptionists</b>
          </div>
          <Waveform />
          <div className="hc-signal__loc">
            Live demo · <a href={site.phone.href}>{site.phone.display}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
