import { processSteps } from "@/data/process";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function ProcessTimeline({ full = false }: { full?: boolean }) {
  return (
    <div className="hc-steps">
      {processSteps.map((step, i) => (
        <RevealOnScroll key={step.number} delay={i * 40}>
          <div className="hc-step">
            <span className="hc-step__n">{step.number}</span>
            <span className="hc-step__t">
              {step.name}
              <span className="hc-step__wk">{step.duration}</span>
            </span>
            <div>
              <p className="hc-step__d">{step.description}</p>
              {full && (
                <ul style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8, listStyle: "none", padding: 0 }}>
                  {step.details.map((detail) => (
                    <li key={detail} className="hc-badge">
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
