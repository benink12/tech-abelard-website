import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { homeFontClassName } from "@/lib/fonts/home";
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
    ? `${demoUrl}${demoUrl.includes("?") ? "&" : "?"}access=${signDemoAccessToken(slug, session.requestId)}`
    : null;

  return (
    <div className={`home-concept ${homeFontClassName}`}>
      <section className="flex min-h-[85vh] items-center hc-section">
        <div className="hc-wrap" style={{ maxWidth: 620 }}>
          <p className="hc-eyebrow" style={{ textAlign: "center" }}>
            Private Preview
          </p>
          <h1 className="hc-h2" style={{ textAlign: "center", marginTop: 12 }}>
            Tech Abélard Private Showcase
          </h1>
          <p className="hc-lede" style={{ textAlign: "center", margin: "12px auto 0" }}>
            Welcome, {check.request.fullName || check.request.businessName}
          </p>

          <div className="hc-flatcard" style={{ marginTop: 40, textAlign: "center" }}>
            <p className="hc-eyebrow">Approved project</p>
            <h2 className="hc-heading__title" style={{ marginTop: 8 }}>
              {project.name}
            </h2>
            <p style={{ marginTop: 4 }}>{project.tagline}</p>

            {check.expiresAt && (
              <p className="hc-worknote" style={{ marginTop: 16, textTransform: "none", letterSpacing: 0 }}>
                Access expires <strong style={{ color: "var(--hc-ink)" }}>{formatDate(check.expiresAt)}</strong>
              </p>
            )}

            <div style={{ marginTop: 24 }}>
              {demoUrlWithToken ? (
                <Button href={demoUrlWithToken} external variant="ink" size="lg" showArrow>
                  Open Live Demo
                </Button>
              ) : (
                <span className="hc-badge">Live demo opening soon</span>
              )}
            </div>
          </div>

          <div className="hc-flatcard" style={{ marginTop: 24, borderTopColor: "var(--hc-ink)" }}>
            <p className="hc-eyebrow" style={{ color: "var(--slate)" }}>
              Please note
            </p>
            <p style={{ marginTop: 8 }}>
              This is a concept project created to demonstrate Tech Abélard&apos;s design, SEO, and conversion
              capabilities. It is not presented as a completed client project.
            </p>
          </div>

          <form action={exitPreviewAction} className="mt-8 flex justify-center">
            <button type="submit" className="hc-worknote" style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <LogOut className="h-3.5 w-3.5" /> Exit private preview
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
