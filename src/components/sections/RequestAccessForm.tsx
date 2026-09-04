"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { validateRequestAccessForm } from "@/lib/portfolioAccess/requestValidation";

type Status = "idle" | "submitting" | "success" | "error";
type RequiredField = "fullName" | "businessName" | "email" | "phone" | "industry" | "websiteUrl" | "reason" | "consent";

const inputClasses = "hc-input";

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
      <div role="status" className="hc-form-success">
        <CheckCircle2 className="h-9 w-9" strokeWidth={1.5} style={{ color: "var(--oxblood)", margin: "0 auto" }} />
        <h3 className="hc-heading__title" style={{ fontSize: 24, marginTop: 18 }}>
          Thanks. Your request has been received.
        </h3>
        <p style={{ marginTop: 10, color: "var(--slate)", maxWidth: "40ch", marginLeft: "auto", marginRight: "auto" }}>
          We&apos;ll review it and send access details if approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="requestedProjectSlug" value={projectSlug} />
      <p className="hc-eyebrow" style={{ marginBottom: 22 }}>
        Requesting access to: {projectName}
      </p>

      <div className="hc-form-grid">
        <div className="hc-field">
          <label htmlFor="fullName">Full name</label>
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
          {errors.fullName && <p role="alert" className="hc-form-error">{errors.fullName}</p>}
        </div>

        <div className="hc-field">
          <label htmlFor="businessName">Business name</label>
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
          {errors.businessName && <p role="alert" className="hc-form-error">{errors.businessName}</p>}
        </div>

        <div className="hc-field">
          <label htmlFor="email">Business email</label>
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
          {errors.email && <p role="alert" className="hc-form-error">{errors.email}</p>}
        </div>

        <div className="hc-field">
          <label htmlFor="phone">
            Phone <em>(optional)</em>
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
          {errors.phone && <p role="alert" className="hc-form-error">{errors.phone}</p>}
        </div>

        <div className="hc-field">
          <label htmlFor="industry">Industry</label>
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
          {errors.industry && <p role="alert" className="hc-form-error">{errors.industry}</p>}
        </div>

        <div className="hc-field">
          <label htmlFor="websiteUrl">
            Your website <em>(optional)</em>
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
          {errors.websiteUrl && <p role="alert" className="hc-form-error">{errors.websiteUrl}</p>}
        </div>
      </div>

      <div className="hc-field" style={{ marginTop: 20 }}>
        <label htmlFor="reason">Why would you like access?</label>
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
        {errors.reason && <p role="alert" className="hc-form-error">{errors.reason}</p>}
      </div>

      <div className="hc-checkline" style={{ marginTop: 20 }}>
        <input
          ref={(el) => {
            fieldRefs.current.consent = el;
          }}
          type="checkbox"
          name="consent"
          id="consent"
          aria-invalid={Boolean(errors.consent)}
          aria-required="true"
        />
        <label htmlFor="consent" style={{ fontFamily: "var(--body)", textTransform: "none", letterSpacing: 0, fontSize: 13 }}>
          I consent to Tech Abélard reviewing this request and contacting me about it. This is a concept project, not
          a completed client project.
        </label>
      </div>
      {errors.consent && <p role="alert" className="hc-form-error" style={{ marginTop: 6 }}>{errors.consent}</p>}

      {serverError && (
        <p role="alert" className="hc-form-error" style={{ marginTop: 16 }}>
          {serverError}
        </p>
      )}

      <div style={{ marginTop: 28 }}>
        <Button type="submit" variant="ink" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            "Request Live Access"
          )}
        </Button>
        <p className="hc-form-note">We review every request personally — no automated approvals.</p>
      </div>
    </form>
  );
}
