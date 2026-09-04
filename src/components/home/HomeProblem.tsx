import { site } from "@/data/site";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MaskReveal } from "@/components/ui/MaskReveal";

const callLog = [
  { time: "08:12", who: "New customer, first-time quote", status: "Voicemail", ok: false },
  { time: "10:47", who: "Existing client, reschedule", status: "Answered", ok: true },
  { time: "12:30", who: "Estimate request, 2-min hold", status: "Hung up", ok: false },
  { time: "14:05", who: "Supplier", status: "Answered", ok: true },
  { time: "17:04", who: "Referral, ready to book", status: "Voicemail", ok: false },
  { time: "20:38", who: "Emergency call-out", status: "Missed", ok: false },
] as const;

export function HomeProblem() {
  // Duplicated once so the CSS-driven marquee (globals.css .animate-marquee,
  // translateX(-50%)) loops seamlessly across the doubled track.
  const industries = [...site.industries, ...site.industries];

  return (
    <section className="hc-section" style={{ paddingBottom: 0 }}>
      <div className="hc-wrap hc-split">
        <RevealOnScroll>
          <p className="hc-eyebrow">The real problem</p>
          <h2 className="hc-h2" style={{ marginTop: 18 }}>
            <MaskReveal>Good contractors lose jobs to worse companies with better SEO, constantly.</MaskReveal>
          </h2>
          <p className="hc-lede" style={{ marginTop: 22 }}>
            Great work doesn&apos;t show up in the map pack by itself. A thin site, an unmanaged Google Business
            Profile, no citations and no service-area pages mean you&apos;re invisible for the exact searches your
            next customer is typing. And the calls that do come in still have to be answered — a busy afternoon or
            an after-hours ring shouldn&apos;t cost you the job.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <div className="hc-log">
            <div className="hc-log__head">
              <span>Inbound · one day</span>
              <span style={{ marginLeft: "auto" }}>6 calls</span>
            </div>
            {callLog.map((row) => (
              <div key={row.time} className={row.ok ? "hc-log__row hc-log__row--ok" : "hc-log__row"}>
                <span className="hc-log__t">{row.time}</span>
                <span className="hc-log__who">{row.who}</span>
                <span className="hc-log__st">{row.status}</span>
              </div>
            ))}
          </div>
          <p className="hc-log__note">Illustration of a typical call pattern — not client data</p>
        </RevealOnScroll>
      </div>
      <div className="hc-inds" aria-hidden="true">
        <div className="hc-inds__track animate-marquee">
          {industries.map((name, i) => (
            <span key={`${name}-${i}`}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
