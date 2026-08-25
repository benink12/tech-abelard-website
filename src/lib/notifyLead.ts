import "server-only";
import { site } from "@/data/site";

export interface LeadNotificationInput {
  name: string;
  email: string;
  phone?: string;
  business?: string;
  service?: string;
  message: string;
}

// Resend's shared test sending domain — works with zero DNS setup and can
// send to any inbox. Swap for a verified techabelard.com address once
// that's set up; nothing else about this function needs to change.
const FROM_ADDRESS = "Tech Abélard Website <onboarding@resend.dev>";

function buildSubject(input: LeadNotificationInput): string {
  const base = `New Tech Abélard Lead — ${input.name}`;
  return input.service ? `${base} — ${input.service}` : base;
}

function buildBody(input: LeadNotificationInput): string {
  const lines = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "(not provided)"}`,
    `Business: ${input.business || "(not provided)"}`,
  ];
  if (input.service) lines.push(`Service: ${input.service}`);
  lines.push("", "Message:", input.message, "", `Submitted: ${new Date().toISOString()}`);
  return lines.join("\n");
}

// Plain fetch against Resend's REST API — no SDK dependency, same pattern
// this route already uses to call Tech Abélard OS. Called only after the
// lead has already been saved (see POST /api/contact); a failure here must
// never be allowed to turn a successful submission into an error for the
// visitor — see the try/catch at the call site.
export async function sendLeadNotificationEmail(input: LeadNotificationInput): Promise<{ id: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [site.email],
      reply_to: input.email,
      subject: buildSubject(input),
      text: buildBody(input),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend API error ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as { id?: string };
  if (!data.id) throw new Error("Resend accepted the request but returned no message id.");
  return { id: data.id };
}
