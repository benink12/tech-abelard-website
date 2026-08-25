"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { validateRequestAccessForm } from "@/lib/portfolioAccess/requestValidation";

type Status = "idle" | "submitting" | "success" | "error";
type RequiredField = "fullName" | "businessName" | "email" | "phone" | "industry" | "websiteUrl" | "reason" | "consent";

const inputClasses =
  "w-full rounded-xl border border-ink/12 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brass-ink focus:outline-none";

export function RequestAccessForm({ projectSlug, projectName }: { projectSlug: string; projectName: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const fieldRefs = useRef<
    Record<RequiredField, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>
  >({
    fullName: null,
    businessName: null,
    email: null,
    phone: null,
    industry: null,
    websiteUrl: null,
    reason: null,
    consent: null,
  });
  // Guards against a double POST from a fast double-click/double-tap — see
  // the identical guard in ContactForm.tsx.
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    setServerError(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    const fullName = String(data.get("fullName") ?? "").trim();
    const businessName = String(data.get("businessName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const industry = String(data.get("industry") ?? "").trim();
    const websiteUrl = String(data.get("websiteUrl") ?? "").trim();
    const reason = String(data.get("reason") ?? "").trim();
    const consent = data.get("consent") === "on";

    const nextErrors = validateRequestAccessForm({ fullName, businessName, email, phone, industry, websiteUrl, reason, consent });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const order: RequiredField[] = ["fullName", "businessName", "email", "phone", "industry", "websiteUrl", "reason", "consent"];
      const firstInvalid = order.find((field) => nextErrors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName,
          businessName,
          email,
          phone: phone || undefined,
          industry,
          websiteUrl: websiteUrl || undefined,
          requestedProjectSlug: projectSlug,
          reason,
          consent,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string; fieldErrors?: Record<string, string> } | null;
        if (body?.fieldErrors && Object.keys(body.fieldErrors).length > 0) {
          // The server (either this route's own re-validation, or Tech
          // Abélard OS's) rejected something the client-side check here
          // missed or didn't cover — e.g. a project slug the OS doesn't
          // recognize. Show the same per-field messages instead of the
          // generic banner, and focus the first one exactly like a
          // client-side failure.
          setErrors(body.fieldErrors);
          const order: RequiredField[] = ["fullName", "businessName", "email", "phone", "industry", "websiteUrl", "reason", "consent"];
          const firstInvalid = order.find((field) => body.fieldErrors?.[field]);
          if (firstInvalid) {
            fieldRefs.current[firstInvalid]?.focus();
          } else {
            // The only field error with no matching visible input is
            // requestedProjectSlug (hidden field, set from this page's own
            // slug — never user-entered). Surface its specific message as
            // the banner instead of a blank "Invalid submission."
            setServerError(body.fieldErrors.requestedProjectSlug ?? body?.error ?? "Something went wrong — please try again shortly.");
          }
        } else {
          setServerError(body?.error ?? "Something went wrong — please try again shortly.");
        }
        setStatus("error");
        submittingRef.current = false;
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setServerError("Something went wrong — please try again shortly.");
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center rounded-2xl border border-brass-ink/25 bg-cream-card p-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-brass-ink" strokeWidth={1.5} />
        <h3 className="mt-5 font-display text-2xl font-medium text-ink">Thanks. Your request has been received.</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
          We&apos;ll review it and send access details if approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-ink/8 bg-cream-card p-8 sm:p-10">
      <input type="hidden" name="requestedProjectSlug" value={projectSlug} />
      <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-brass-ink">Requesting access to: {projectName}</p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Full name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.fullName = el;
            }}
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            className={inputClasses}
            aria-invalid={Boolean(errors.fullName)}
            aria-required="true"
          />
          {errors.fullName && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="businessName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Business name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.businessName = el;
            }}
            id="businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
            className={inputClasses}
            aria-invalid={Boolean(errors.businessName)}
            aria-required="true"
          />
          {errors.businessName && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.businessName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Business email
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.email = el;
            }}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputClasses}
            aria-invalid={Boolean(errors.email)}
            aria-required="true"
          />
          {errors.email && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Phone <span className="normal-case text-ink/35">(optional)</span>
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.phone = el;
            }}
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClasses}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="industry" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Industry
          </label>
          <select
            ref={(el) => {
              fieldRefs.current.industry = el;
            }}
            id="industry"
            name="industry"
            defaultValue=""
            className={inputClasses}
            aria-invalid={Boolean(errors.industry)}
            aria-required="true"
          >
            <option value="" disabled>
              Select your industry
            </option>
            {site.industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {errors.industry && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.industry}</p>}
        </div>

        <div>
          <label htmlFor="websiteUrl" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Your website <span className="normal-case text-ink/35">(optional)</span>
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.websiteUrl = el;
            }}
            id="websiteUrl"
            name="websiteUrl"
            type="text"
            placeholder="https://yourbusiness.com"
            autoComplete="url"
            className={inputClasses}
            aria-invalid={Boolean(errors.websiteUrl)}
          />
          {errors.websiteUrl && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.websiteUrl}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="reason" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Why would you like access?
        </label>
        <textarea
          ref={(el) => {
            fieldRefs.current.reason = el;
          }}
          id="reason"
          name="reason"
          rows={4}
          className={cn(inputClasses, "resize-none")}
          aria-invalid={Boolean(errors.reason)}
          aria-required="true"
        />
        {errors.reason && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.reason}</p>}
      </div>

      <div className="mt-5">
        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink/60">
          <input
            ref={(el) => {
              fieldRefs.current.consent = el;
            }}
            type="checkbox"
            name="consent"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/25 text-brass-ink focus:ring-brass-ink"
            aria-invalid={Boolean(errors.consent)}
            aria-required="true"
          />
          I consent to Tech Abélard reviewing this request and contacting me about it. This is a concept project, not a
          completed client project.
        </label>
        {errors.consent && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.consent}</p>}
      </div>

      {serverError && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {serverError}
        </p>
      )}

      <Button type="submit" variant="ink" size="lg" className="mt-7 w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending
          </>
        ) : (
          "Request Live Access"
        )}
      </Button>
      <p className="mt-3 text-xs text-ink/40">We review every request personally — no automated approvals.</p>
    </form>
  );
}
