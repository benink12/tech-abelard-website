"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "error";

const inputClasses = "hc-input";

const REASON_MESSAGES: Record<string, string> = {
  expired: "This access code has expired. Reply to your approval email and we'll send a new one.",
  revoked: "This access code is no longer valid. Contact us if you believe this is a mistake.",
  invalid: "That email or access code doesn't match our records. Double-check both and try again.",
};

export function AccessGateForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const email = emailRef.current?.value.trim() ?? "";
    const code = codeRef.current?.value.trim() ?? "";

    if (!email || !code) {
      setError("Enter both your business email and access code.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/showcase/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const body = await res.json().catch(() => null);

      if (!res.ok || !body?.valid || !body?.projectSlug) {
        setError(REASON_MESSAGES[body?.reason as string] ?? REASON_MESSAGES.invalid);
        setStatus("error");
        return;
      }

      router.push(`/showcase/${body.projectSlug}`);
    } catch {
      setError("Something went wrong — please try again shortly.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="hc-field">
        <label htmlFor="email">Business email</label>
        <input ref={emailRef} id="email" name="email" type="email" autoComplete="email" inputMode="email" className={inputClasses} />
      </div>
      <div className="hc-field" style={{ marginTop: 20 }}>
        <label htmlFor="code">Access code</label>
        <input
          ref={codeRef}
          id="code"
          name="code"
          type="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          placeholder="XXXXX-XXXXX"
          className={inputClasses}
        />
      </div>

      {error && (
        <p role="alert" className="hc-form-error" style={{ marginTop: 16 }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 28 }}>
        <Button type="submit" variant="ink" size="lg" className="w-full" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Checking
            </>
          ) : (
            "Enter Showcase"
          )}
        </Button>
        <p className="hc-form-note" style={{ textAlign: "center" }}>
          Don&apos;t have access yet? Request it from any project&apos;s case study page.
        </p>
      </div>
    </form>
  );
}
