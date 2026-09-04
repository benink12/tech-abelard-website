"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "error";
type FieldName = "name" | "email" | "message";

const inputClasses = "hc-input";

export function ContactForm() {
  const router = useRouter();
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

      form.reset();
      // Redirect only on a confirmed backend success (res.ok above, after
      // the OS's /api/contact-messages write succeeded) — this is a Google
      // Ads conversion destination (see src/app/contact/thank-you/page.tsx),
      // so it must only ever be reached from here, never rendered as an
      // inline state a user could land on some other way.
      router.push("/contact/thank-you");
    } catch {
      setErrorMessage("Something went wrong sending your message. Please check your connection and try again.");
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status === "error" && errorMessage && (
        <div role="alert" className="hc-form-banner">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span>{errorMessage}</span>
        </div>
      )}
      <div className="hc-form-grid">
        <div className="hc-field">
          <label htmlFor="name">Name</label>
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
          {errors.name && <p role="alert" className="hc-form-error">{errors.name}</p>}
        </div>
        <div className="hc-field">
          <label htmlFor="email">Email</label>
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
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
        </div>
        <div className="hc-field">
          <label htmlFor="business">Business name</label>
          <input id="business" name="business" type="text" autoComplete="organization" className={inputClasses} />
        </div>
      </div>

      <div className="hc-field" style={{ marginTop: 20 }}>
        <label htmlFor="message">Tell us about your project</label>
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
        {errors.message && <p role="alert" className="hc-form-error">{errors.message}</p>}
      </div>

      <div style={{ marginTop: 28 }}>
        <Button type="submit" variant="ink" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            "Send Message"
          )}
        </Button>
        <p className="hc-form-note">We reply within one business day. No spam, no auto-dialers.</p>
      </div>
    </form>
  );
}
