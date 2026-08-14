// Single source of truth for validating and normalizing the instant-audit
// intake form. The client form (AuditExperience.tsx) and the API route
// (app/api/audit/route.ts) both import from here so the two never drift —
// previously each kept its own copy of the same regexes.

export type AuditIndustry =
  | "Plumbing"
  | "Roofing"
  | "HVAC"
  | "Electrical"
  | "Landscaping"
  | "Construction"
  | "Painting"
  | "Cleaning"
  | "Automotive"
  | "Restaurant"
  | "Retail"
  | "Professional Services"
  | "Other";

export const AUDIT_INDUSTRIES: AuditIndustry[] = [
  "Plumbing",
  "Roofing",
  "HVAC",
  "Electrical",
  "Landscaping",
  "Construction",
  "Painting",
  "Cleaning",
  "Automotive",
  "Restaurant",
  "Retail",
  "Professional Services",
  "Other",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts "example.com", "www.example.com", or a full "https://example.com/path".
const URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/.*)?$/i;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidWebsiteUrl(value: string): boolean {
  return URL_RE.test(value.trim());
}

export function isValidIndustry(value: string): value is AuditIndustry {
  return (AUDIT_INDUSTRIES as string[]).includes(value);
}

/** Adds https:// when the visitor typed a bare domain, so every downstream consumer gets a fetchable absolute URL. */
export function normalizeWebsiteUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export interface AuditFormValues {
  businessName: string;
  websiteUrl: string;
  industry: string;
  name: string;
  email: string;
  phone: string;
}

export type AuditFormErrors = Partial<Record<keyof AuditFormValues, string>>;

/** Shared validator: same rules, same messages, whether called from the browser or the route handler. */
export function validateAuditForm(values: AuditFormValues): AuditFormErrors {
  const errors: AuditFormErrors = {};

  if (!values.businessName.trim()) errors.businessName = "Business name is required.";
  if (!values.websiteUrl.trim()) errors.websiteUrl = "Website URL is required.";
  else if (!isValidWebsiteUrl(values.websiteUrl)) errors.websiteUrl = "Enter a valid website address (e.g. yourbusiness.com).";

  if (!values.industry.trim()) errors.industry = "Please select an industry.";
  else if (!isValidIndustry(values.industry)) errors.industry = "Please select a valid industry.";

  if (!values.name.trim()) errors.name = "Your name is required.";
  if (!values.email.trim() || !isValidEmail(values.email)) errors.email = "A valid email is required.";

  return errors;
}
