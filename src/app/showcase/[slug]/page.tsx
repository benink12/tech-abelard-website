import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { portfolioProjects } from "@/data/portfolio";
import { getShowcaseSession, clearShowcaseSessionCookie } from "@/lib/showcase/session";
import { checkPortfolioAccessSessionWithOs } from "@/lib/portfolioAccess/osClient";
import { getPrivateDemoUrl } from "@/lib/showcase/demoUrls";
import { signDemoAccessToken } from "@/lib/showcase/demoAccessToken";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
}

// Never indexed (see src/app/robots.ts) and never statically cached — every
// load re-checks real status with the OS (see below), so a revocation
// takes effect on literally the next page view, not at some later rebuild.
export const metadata: Metadata = { title: "Private Showcase", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function exitPreviewAction() {
  "use server";
  await clearShowcaseSessionCookie();
  redirect("/showcase/access");
}

export default async function PrivateShowcasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.slug === slug);

  const session = await getShowcaseSession();
  // No session, or a session for a different project than the one in the
  // URL — never trust the URL slug alone.
  if (!project || !session || session.projectSlug !== slug) {
    redirect("/showcase/access");
  }

  // The real re-check — not just "does the cookie exist," but "is this
  // request's underlying access code still active right now" per the OS's
  // own records. This is what makes an expiration or a Revoke Access click
  // take effect immediately instead of waiting for the cookie to expire on
  // its own. Deliberately does NOT clear the cookie here — cookies can only
  // be mutated inside a Server Action or Route Handler, never a plain page
  // render (see exitPreviewAction below, and /api/showcase/validate, for
  // the two places that actually do). Leaving a now-invalid cookie in place
  // is harmless: every load re-checks with the OS regardless, and a fresh
  // successful gate entry overwrites it anyway.
  const check = await checkPortfolioAccessSessionWithOs(session.requestId);
  if (!check.valid || !check.request) {
    redirect("/showcase/access");
  }

  const demoUrl = getPrivateDemoUrl(slug);
  // The raw demoUrl points at a separate, independently-deployed Vercel
  // project (one per niche — see that project's own src/proxy.ts) that
  // has no auth of its own beyond this token: it verifies the signature,
  // expiry, and that the embedded slug matches its own deployment before
  // granting its own short first-party cookie. Minted fresh on every
  // load, after the OS session-check above has already confirmed this
  // visitor's access — never cached, never handed out any earlier.
  const demoUrlWithToken = demoUrl
    ? `${demoUrl}${demoUrl.includes("?") ? "&" : "?"}access=${signDemoAccessToken(slug)}`
    : null;

  return (
    <section className="flex min-h-[85vh] items-center py-20 sm:py-28">
      <Container className="max-w-2xl">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-brass-ink">Private Preview</p>
        <h1 className="text-balance text-center font-display text-3xl font-medium text-ink">Tech Abélard Private Showcase</h1>
        <p className="mt-3 text-center text-sm text-ink/60">
          Welcome, {check.request.fullName || check.request.businessName}
        </p>

        <div className="mt-10 rounded-2xl border border-ink/8 bg-cream-card p-8 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Approved project</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-ink">{project.name}</h2>
          <p className="mt-1 text-sm text-ink/55">{project.tagline}</p>

          {check.expiresAt && (
            <p className="mt-4 text-xs text-ink/45">
              Access expires <span className="font-medium text-ink/65">{formatDate(check.expiresAt)}</span>
            </p>
          )}

          <div className="mt-7">
            {demoUrlWithToken ? (
              <Button href={demoUrlWithToken} external variant="ink" size="lg" showArrow>
                Open Live Demo
              </Button>
            ) : (
              <span className="inline-block rounded-full border border-ink/12 px-5 py-3 text-sm font-medium text-ink/40">
                Live demo opening soon
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-ink/8 bg-ink p-5 text-cream">
          <p className="text-xs font-semibold uppercase tracking-wide text-brass-light">Please note</p>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">
            This is a concept project created to demonstrate Tech Abélard&apos;s design, SEO, and conversion capabilities.
            It is not presented as a completed client project.
          </p>
        </div>

        <form action={exitPreviewAction} className="mt-6 flex justify-center">
          <button type="submit" className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/50 hover:text-ink/80">
            <LogOut className="h-3.5 w-3.5" /> Exit private preview
          </button>
        </form>
      </Container>
    </section>
  );
}
