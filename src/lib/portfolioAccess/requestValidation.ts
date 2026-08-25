// Single source of truth for "Request Live Access" form validation —
// imported by both the client form (RequestAccessForm.tsx, instant
// per-field feedback) and the server route (api/request-access/route.ts,
// the real gate). Keeping one function means the two can never drift the
// way the frontend and Tech Abélard OS's own copy of this once did (see
// that repo's src/app/api/portfolio-access/requests/route.ts — no shared
// package exists between the two separate apps/repos, so that copy has to
// be kept in sync by hand instead; this file is the one place that
// doesn't apply to, since both callers live in this same repo).
import { site } from "@/data/site";

export interface RequestAccessFormValues {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  industry: string;
  websiteUrl: string;
  reason: string;
  consent: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose on purpose — accepts "+1 437-601-5091", "(437) 601-5091",
// "4376015091", etc. Only rejects things that clearly aren't a phone
// number (letters, too short, too long). 7–15 digits covers every real
// national/international number; E.164 caps at 15.
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;
const REASON_MIN_LENGTH = 10;
const REASON_MAX_LENGTH = 1000;
export const KNOWN_INDUSTRIES = new Set<string>([...site.industries, "Other"]);

export function isValidPhone(value: string): boolean {
  const digitCount = value.replace(/[^\d]/g, "").length;
  return PHONE_RE.test(value) && digitCount >= 7 && digitCount <= 15;
}

export function isValidWebsiteUrl(value: string): boolean {
  // Deliberately https:// only — every business getting a new site in
  // 2026 has a certificate, and this is the exact message shown on
  // mismatch, so the rule and the copy have to agree.
  if (!value.startsWith("https://")) return false;
  try {
    return Boolean(new URL(value).hostname);
  } catch {
    return false;
  }
}

// Returns an empty object when every field is valid. Doesn't check
// requestedProjectSlug — the caller already knows it (it's the page's own
// projectSlug prop, never user-entered) and validates it separately
// against portfolioProjects.
export function validateRequestAccessForm(values: RequestAccessFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.fullName.trim()) errors.fullName = "Your full name is required.";
  if (!values.businessName.trim()) errors.businessName = "Business name is required.";

  const email = values.email.trim();
  if (!email || !EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  const phone = values.phone.trim();
  if (phone && !isValidPhone(phone)) errors.phone = "Enter a valid phone number.";

  const industry = values.industry.trim();
  if (!industry) {
    errors.industry = "Select an industry.";
  } else if (!KNOWN_INDUSTRIES.has(industry)) {
    errors.industry = "Select a valid industry from the list.";
  }

  const websiteUrl = values.websiteUrl.trim();
  if (websiteUrl && !isValidWebsiteUrl(websiteUrl)) {
    errors.websiteUrl = "Enter a full URL beginning with https://";
  }

  const reason = values.reason.trim();
  if (!reason) {
    errors.reason = "Tell us a little about why you'd like access.";
  } else if (reason.length < REASON_MIN_LENGTH) {
    errors.reason = "Please provide a little more detail.";
  } else if (reason.length > REASON_MAX_LENGTH) {
    errors.reason = "Keep this under 1,000 characters.";
  }

  if (!values.consent) errors.consent = "Please confirm consent to continue.";

  return errors;
}
