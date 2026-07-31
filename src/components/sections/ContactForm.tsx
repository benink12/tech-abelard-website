"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { submitContactForm } from "@/lib/submitContactForm";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = "name" | "email" | "message";

const inputClasses =
  "w-full rounded-xl border border-ink/12 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brass-ink focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldRefs = useRef<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>({
    name: null,
    email: null,
    message: null,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "A valid email is required.";
    if (!message) nextErrors.message = "Tell us a little about your project.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = (["name", "email", "message"] as FieldName[]).find((field) => nextErrors[field]);
      if (firstInvalid) fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("submitting");
    const result = await submitContactForm({
      name,
      email,
      phone: String(data.get("phone") ?? ""),
      business: String(data.get("business") ?? ""),
      message,
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
        <h3 className="mt-5 font-display text-2xl font-medium text-ink">Message sent.</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/60">
          We reply to every discovery inquiry within one business day. Talk soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-ink/8 bg-cream-card p-8 sm:p-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.name = el;
            }}
            id="name"
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
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Phone <span className="normal-case text-ink/35">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="business" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Business name
          </label>
          <input id="business" name="business" type="text" autoComplete="organization" className={inputClasses} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Tell us about your project
        </label>
        <textarea
          ref={(el) => {
            fieldRefs.current.message = el;
          }}
          id="message"
          name="message"
          rows={5}
          className={cn(inputClasses, "resize-none")}
          aria-invalid={Boolean(errors.message)}
          aria-required="true"
        />
        {errors.message && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
      </div>

      <Button
        type="submit"
        variant="ink"
        size="lg"
        className="mt-7 w-full sm:w-auto"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending
          </>
        ) : (
          "Send Message"
        )}
      </Button>
      <p className="mt-3 text-xs text-ink/40">
        We reply within one business day. No spam, no auto-dialers.
      </p>
    </form>
  );
}
