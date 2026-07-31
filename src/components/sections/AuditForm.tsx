"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { site } from "@/data/site";
import { submitAuditRequest } from "@/lib/submitAuditRequest";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";
type RequiredField = "businessName" | "websiteUrl" | "industry" | "city" | "contactName" | "email" | "mainConcern" | "consent";

const inputClasses =
  "w-full rounded-xl border border-ink/12 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brass-ink focus:outline-none";

export function AuditForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldRefs = useRef<
    Record<RequiredField, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>
  >({
    businessName: null,
    websiteUrl: null,
    industry: null,
    city: null,
    contactName: null,
    email: null,
    mainConcern: null,
    consent: null,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const businessName = String(data.get("businessName") ?? "").trim();
    const websiteUrl = String(data.get("websiteUrl") ?? "").trim();
    const industry = String(data.get("industry") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();
    const contactName = String(data.get("contactName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const mainConcern = String(data.get("mainConcern") ?? "").trim();
    const consentGiven = data.get("consent") === "on";

    const nextErrors: Record<string, string> = {};
    if (!businessName) nextErrors.businessName = "Business name is required.";
    if (!websiteUrl) nextErrors.websiteUrl = "Website URL is required.";
    else if (!/^https?:\/\/.+\..+/i.test(websiteUrl) && !/^[a-z0-9-]+\.[a-z]{2,}/i.test(websiteUrl)) {
      nextErrors.websiteUrl = "Enter a valid website address (e.g. yourbusiness.com).";
    }
    if (!industry) nextErrors.industry = "Select an industry.";
    if (!city) nextErrors.city = "City is required.";
    if (!contactName) nextErrors.contactName = "Contact name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "A valid email is required.";
    if (!mainConcern) nextErrors.mainConcern = "Tell us what concerns you most about your site.";
    if (!consentGiven) nextErrors.consent = "Please confirm consent to continue.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const order: RequiredField[] = [
        "businessName",
        "websiteUrl",
        "industry",
        "city",
        "contactName",
        "email",
        "mainConcern",
        "consent",
      ];
      const firstInvalid = order.find((field) => nextErrors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("submitting");
    const result = await submitAuditRequest({
      businessName,
      websiteUrl,
      industry,
      city,
      contactName,
      email,
      phone,
      mainConcern,
      consentGiven,
    });
    setStatus(result.success ? "success" : "error");
    if (result.success) form.reset();
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-2xl border border-brass-ink/25 bg-cream-card p-12 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-brass-ink" strokeWidth={1.5} />
        <h3 className="mt-5 font-display text-2xl font-medium text-ink">Request received.</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
          Your free audit request has been received. A real person will review your site and prepare your audit —
          most are ready within 2–3 business days. We&apos;ll reach out by email once it&apos;s ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-ink/8 bg-cream-card p-8 sm:p-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="businessName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Business Name
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
          <label htmlFor="websiteUrl" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Website URL
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.websiteUrl = el;
            }}
            id="websiteUrl"
            name="websiteUrl"
            type="text"
            placeholder="yourbusiness.com"
            autoComplete="url"
            className={inputClasses}
            aria-invalid={Boolean(errors.websiteUrl)}
            aria-required="true"
          />
          {errors.websiteUrl && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.websiteUrl}</p>}
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
          <label htmlFor="city" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            City
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.city = el;
            }}
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            className={inputClasses}
            aria-invalid={Boolean(errors.city)}
            aria-required="true"
          />
          {errors.city && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="contactName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Contact Name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.contactName = el;
            }}
            id="contactName"
            name="contactName"
            type="text"
            autoComplete="name"
            className={inputClasses}
            aria-invalid={Boolean(errors.contactName)}
            aria-required="true"
          />
          {errors.contactName && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.contactName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Email
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

        <div className="sm:col-span-2">
          <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Phone <span className="normal-case text-ink/35">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="mainConcern" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          What concerns you most about your website?
        </label>
        <textarea
          ref={(el) => {
            fieldRefs.current.mainConcern = el;
          }}
          id="mainConcern"
          name="mainConcern"
          rows={4}
          placeholder="e.g. Not sure it shows up on Google, or it doesn't get many quote requests."
          className={cn(inputClasses, "resize-none")}
          aria-invalid={Boolean(errors.mainConcern)}
          aria-required="true"
        />
        {errors.mainConcern && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.mainConcern}</p>}
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          ref={(el) => {
            fieldRefs.current.consent = el;
          }}
          id="consent"
          name="consent"
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 rounded border-ink/25 text-brass-ink focus:ring-1 focus:ring-brass-ink"
          aria-invalid={Boolean(errors.consent)}
          aria-required="true"
        />
        <label htmlFor="consent" className="text-xs leading-relaxed text-ink/60">
          I consent to Tech Abélard reviewing my publicly available website and contacting me about the results. See
          our{" "}
          <a href="/privacy-policy" className="underline hover:text-brass-ink">
            Privacy Policy
          </a>
          .
        </label>
      </div>
      {errors.consent && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.consent}</p>}

      <Button
        type="submit"
        variant="ink"
        size="lg"
        className="mt-7 w-full sm:w-auto"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting
          </>
        ) : (
          "Request My Free Audit"
        )}
      </Button>
      <p className="mt-3 text-xs text-ink/40">
        No cost, no obligation. We only review sites we&apos;re invited to look at.
      </p>
    </form>
  );
}
