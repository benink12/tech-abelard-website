"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = "name" | "business" | "email" | "service";

const SERVICE_OPTIONS = ["Website Design", "Local SEO", "AI Receptionist", "Website Audit", "Other"] as const;

const inputClasses =
  "w-full rounded-xl border border-ink/12 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brass-ink focus:outline-none";

// Compact homepage lead form — sends through the same /api/contact backend
// as the full Contact page form (src/components/sections/ContactForm.tsx),
// just with a smaller field set. The extra context this form collects
// (service interest, current website) has no dedicated column on the OS
// side (src/app/api/contact-messages in the OS repo only stores name/email/
// phone/businessName/message), so rather than a cross-repo schema change
// against a service that isn't even on Supabase yet, it's folded into the
// `message` string the same endpoint already stores and the OS admin
// inbox already renders.
export function HomeLeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fieldRefs = useRef<Record<FieldName, HTMLInputElement | HTMLSelectElement | null>>({
    name: null,
    business: null,
    email: null,
    service: null,
  });
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const business = String(data.get("business") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const currentWebsite = String(data.get("currentWebsite") ?? "").trim();
    const shortMessage = String(data.get("shortMessage") ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Name is required.";
    if (!business) nextErrors.business = "Business name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "A valid email is required.";
    if (!service) nextErrors.service = "Let us know what you need help with.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = (["name", "business", "email", "service"] as FieldName[]).find((field) => nextErrors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    const message = [
      `Interested in: ${service}`,
      currentWebsite ? `Current website: ${currentWebsite}` : null,
      shortMessage || null,
    ]
      .filter(Boolean)
      .join("\n\n");

    submittingRef.current = true;
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, business, message }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string; fieldErrors?: Record<string, string> } | null;
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setErrorMessage(data?.error ?? "Something went wrong sending your project details. Please try again.");
        setStatus("error");
        submittingRef.current = false;
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong sending your project details. Please check your connection and try again.");
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <section id="start-project" className="border-y border-ink/8 py-24 sm:py-32">
      <Container>
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl">
            <SectionHeading
              eyebrow="Start Your Project"
              title="Tell us what you're working on."
              description="A few details now saves a back-and-forth later. We reply within one business day."
              align="center"
              className="mx-auto"
            />

            <div className="mt-10 rounded-2xl border border-ink/8 bg-cream-card p-8 sm:p-10">
              {status === "success" ? (
                <div role="status" className="flex flex-col items-center py-4 text-center">
                  <CheckCircle2 className="h-9 w-9 text-brass-ink" strokeWidth={1.5} />
                  <h3 className="mt-4 font-display text-xl font-medium text-ink">Got it — thanks.</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
                    We&apos;ve received your project details and reply within one business day. Urgent?{" "}
                    <a href={site.phone.href} className="font-medium text-brass-ink underline underline-offset-2">
                      Call {site.phone.display}
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {status === "error" && errorMessage && (
                    <div
                      role="alert"
                      className="mb-6 flex items-start gap-3 rounded-xl border border-red-600/25 bg-red-600/5 p-4 text-sm text-red-700"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lead-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                        Name
                      </label>
                      <input
                        ref={(el) => {
                          fieldRefs.current.name = el;
                        }}
                        id="lead-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        className={inputClasses}
                        aria-invalid={Boolean(errors.name)}
                        aria-required="true"
                      />
                      {errors.name && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="lead-business" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                        Business name
                      </label>
                      <input
                        ref={(el) => {
                          fieldRefs.current.business = el;
                        }}
                        id="lead-business"
                        name="business"
                        type="text"
                        autoComplete="organization"
                        className={inputClasses}
                        aria-invalid={Boolean(errors.business)}
                        aria-required="true"
                      />
                      {errors.business && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.business}</p>}
                    </div>
                    <div>
                      <label htmlFor="lead-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                        Email
                      </label>
                      <input
                        ref={(el) => {
                          fieldRefs.current.email = el;
                        }}
                        id="lead-email"
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
                      <label htmlFor="lead-service" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                        What do you need help with?
                      </label>
                      <select
                        ref={(el) => {
                          fieldRefs.current.service = el;
                        }}
                        id="lead-service"
                        name="service"
                        defaultValue=""
                        className={inputClasses}
                        aria-invalid={Boolean(errors.service)}
                        aria-required="true"
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.service && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.service}</p>}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="lead-website" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                      Current website <span className="normal-case text-ink/35">(optional)</span>
                    </label>
                    <input
                      id="lead-website"
                      name="currentWebsite"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="yourbusiness.com"
                      className={inputClasses}
                    />
                  </div>

                  <div className="mt-5">
                    <label htmlFor="lead-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                      Short message <span className="normal-case text-ink/35">(optional)</span>
                    </label>
                    <textarea
                      id="lead-message"
                      name="shortMessage"
                      rows={3}
                      className={cn(inputClasses, "resize-none")}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="ink"
                    size="lg"
                    className="mt-7 w-full sm:w-auto"
                    disabled={status === "submitting"}
                    data-cta="homepage-lead-form"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending
                      </>
                    ) : (
                      "Start My Project"
                    )}
                  </Button>
                  <p className="mt-3 text-xs text-ink/40">No spam, no auto-dialers — just a real reply.</p>
                </form>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
