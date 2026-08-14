"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = "name" | "email" | "message";

const inputClasses =
  "w-full rounded-xl border border-ink/12 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brass-ink focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fieldRefs = useRef<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>({
    name: null,
    email: null,
    message: null,
  });
  // Guards against a double POST from a fast double-click/double-tap, which
  // React state updates alone don't reliably prevent (the button's
  // `disabled` only re-renders after the next tick).
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const business = String(data.get("business") ?? "").trim();

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

    submittingRef.current = true;
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message, phone, business }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string; fieldErrors?: Record<string, string> } | null;
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setErrorMessage(data?.error ?? "Something went wrong sending your message. Please try again.");
        setStatus("error");
        submittingRef.current = false;
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong sending your message. Please check your connection and try again.");
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
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
          We&apos;ve received your message and reply within one business day. If it&apos;s urgent, email us directly at{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-brass-ink underline underline-offset-2">
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-ink/8 bg-cream-card p-8 sm:p-10">
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
