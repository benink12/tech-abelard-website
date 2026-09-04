"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AUDIT_INDUSTRIES, normalizeWebsiteUrl, validateAuditForm, type AuditFormValues } from "@/lib/audit/validation";
import { AUDIT_PROGRESS_STAGES, progressPercentForStage } from "@/lib/audit/progress";

type Phase = "form" | "analyzing" | "error";
type RequiredField = "businessName" | "websiteUrl" | "industry" | "name" | "email";

const inputClasses =
  "w-full rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-sm text-cream placeholder:text-cream/35 transition-colors focus:border-cream focus:outline-none";

const selectClasses = cn(inputClasses, "appearance-none bg-none");

const MIN_ANALYZING_MS = 7200;
const STEP_INTERVAL_MS = 720;

export function AuditExperience() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("form");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const isSubmittingRef = useRef(false);
  const fieldRefs = useRef<Record<RequiredField, HTMLInputElement | HTMLSelectElement | null>>({
    businessName: null,
    websiteUrl: null,
    industry: null,
    name: null,
    email: null,
  });

  useEffect(() => {
    if (phase !== "analyzing") return;
    const interval = window.setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, AUDIT_PROGRESS_STAGES.length - 1));
    }, STEP_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [phase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) return; // guards against a double tap firing two audits

    const form = event.currentTarget;
    const data = new FormData(form);

    const values: AuditFormValues = {
      businessName: String(data.get("businessName") ?? "").trim(),
      websiteUrl: String(data.get("websiteUrl") ?? "").trim(),
      industry: String(data.get("industry") ?? "").trim(),
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
    };

    const nextErrors = validateAuditForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const order: RequiredField[] = ["businessName", "websiteUrl", "industry", "name", "email"];
      const firstInvalid = order.find((field) => nextErrors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    isSubmittingRef.current = true;
    setBusinessName(values.businessName);
    setWebsiteUrl(normalizeWebsiteUrl(values.websiteUrl));
    setStepIndex(0);
    setPhase("analyzing");

    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_ANALYZING_MS));
    const submission = fetch("/api/audit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong running your audit.");
      }
      return res.json() as Promise<{ id: string }>;
    });

    try {
      const [, result] = await Promise.all([minDelay, submission]);
      router.push(`/audit/results/${result.id}`);
    } catch (err) {
      isSubmittingRef.current = false;
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong running your audit.");
      setPhase("error");
    }
  }

  if (phase === "analyzing") {
    return <AnalyzingPanel businessName={businessName} websiteUrl={websiteUrl} stepIndex={stepIndex} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-cream/10 bg-ink-soft p-8 sm:p-10"
    >
      {phase === "error" && errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-cream/85">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
          <p>{errorMessage} Please try again below.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="audit-businessName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/50">
            Business Name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.businessName = el;
            }}
            id="audit-businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
            className={inputClasses}
            aria-invalid={Boolean(errors.businessName)}
            aria-required="true"
          />
          {errors.businessName && <p role="alert" className="mt-1.5 text-xs text-red-300">{errors.businessName}</p>}
        </div>

        <div>
          <label htmlFor="audit-websiteUrl" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/50">
            Website URL
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.websiteUrl = el;
            }}
            id="audit-websiteUrl"
            name="websiteUrl"
            type="text"
            placeholder="yourbusiness.com"
            autoComplete="url"
            className={inputClasses}
            aria-invalid={Boolean(errors.websiteUrl)}
            aria-required="true"
          />
          {errors.websiteUrl && <p role="alert" className="mt-1.5 text-xs text-red-300">{errors.websiteUrl}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="audit-industry" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/50">
            Industry
          </label>
          <select
            ref={(el) => {
              fieldRefs.current.industry = el;
            }}
            id="audit-industry"
            name="industry"
            defaultValue=""
            className={selectClasses}
            aria-invalid={Boolean(errors.industry)}
            aria-required="true"
          >
            <option value="" disabled>
              Select your industry
            </option>
            {AUDIT_INDUSTRIES.map((industry) => (
              <option key={industry} value={industry} className="bg-ink text-cream">
                {industry}
              </option>
            ))}
          </select>
          {errors.industry && <p role="alert" className="mt-1.5 text-xs text-red-300">{errors.industry}</p>}
        </div>

        <div>
          <label htmlFor="audit-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/50">
            Your Name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.name = el;
            }}
            id="audit-name"
            name="name"
            type="text"
            autoComplete="name"
            className={inputClasses}
            aria-invalid={Boolean(errors.name)}
            aria-required="true"
          />
          {errors.name && <p role="alert" className="mt-1.5 text-xs text-red-300">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="audit-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/50">
            Email
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.email = el;
            }}
            id="audit-email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputClasses}
            aria-invalid={Boolean(errors.email)}
            aria-required="true"
          />
          {errors.email && <p role="alert" className="mt-1.5 text-xs text-red-300">{errors.email}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="audit-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/50">
            Phone <span className="normal-case text-cream/35">(optional)</span>
          </label>
          <input id="audit-phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
        </div>
      </div>

      <Button type="submit" variant="cream" size="lg" className="mt-7 w-full sm:w-auto" showArrow>
        Analyze My Website
      </Button>
      <p className="mt-3 text-xs text-cream/40">Takes about 10 seconds. No cost, no obligation.</p>
    </form>
  );
}

function AnalyzingPanel({
  businessName,
  websiteUrl,
  stepIndex,
}: {
  businessName: string;
  websiteUrl: string;
  stepIndex: number;
}) {
  const percent = progressPercentForStage(stepIndex);
  const currentStage = AUDIT_PROGRESS_STAGES[stepIndex];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center rounded-2xl border border-cream/10 bg-ink-soft p-10 text-center sm:p-14"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span
          className="absolute inset-0 animate-ping rounded-full bg-cream/20 motion-reduce:hidden"
          style={{ animationDuration: "2.2s" }}
        />
        <span className="absolute inset-0 rounded-full border-2 border-cream/25" />
        <span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cream border-r-cream motion-reduce:hidden"
          style={{ animation: "spin 1.1s linear infinite" }}
        />
        <Loader2 className="h-7 w-7 animate-spin text-cream motion-reduce:animate-none" strokeWidth={1.75} />
      </div>

      <h3 className="mt-6 font-display text-2xl font-medium text-cream">
        Analyzing {businessName || "your website"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-cream/50">{websiteUrl}</p>

      <div className="mt-7 w-full max-w-sm">
        <div className="flex items-center justify-between text-xs text-cream/45">
          <span>
            Step {stepIndex + 1} of {AUDIT_PROGRESS_STAGES.length}
          </span>
          <span>{percent}%</span>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream/10"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Audit progress: ${currentStage.label}`}
        >
          <div
            className="h-full rounded-full bg-cream transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ul className="mt-7 w-full max-w-sm space-y-3 text-left">
        {AUDIT_PROGRESS_STAGES.map((stage, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <li
              key={stage.id}
              className={cn(
                "flex items-center gap-3 text-sm transition-opacity duration-300 motion-reduce:transition-none",
                i > stepIndex ? "opacity-30" : "opacity-100"
              )}
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-cream" />
              ) : active ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cream motion-reduce:animate-none" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-cream/25" />
              )}
              <span className={cn(active ? "text-cream" : "text-cream/60")}>{stage.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
