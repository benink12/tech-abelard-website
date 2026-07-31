export type ContactFormPayload = {
  name: string;
  email: string;
  phone: string;
  business: string;
  message: string;
};

// Integration point: wire this up to a real Route Handler + CRM/email send
// (e.g. Resend, or direct lead-pipeline ingestion) before launch. Currently
// an explicit stub — it validates nothing server-side and always resolves
// successfully after a short delay so the UI can be built and tested end to
// end ahead of the real backend.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- payload is unused until the real backend lands
export async function submitContactForm(_payload: ContactFormPayload): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { success: true };
}
