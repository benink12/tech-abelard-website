"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "error";

const inputClasses =
  "w-full rounded-xl border border-ink/12 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brass-ink focus:outline-none";

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
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-ink/8 bg-cream-card p-8">
      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Business email
          </label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="code" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Access code
          </label>
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
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" variant="ink" size="lg" className="mt-6 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Checking
          </>
        ) : (
          "Enter Showcase"
        )}
      </Button>
      <p className="mt-4 text-center text-xs text-ink/40">
        Don&apos;t have access yet? Request it from any project&apos;s case study page.
      </p>
    </form>
  );
}
