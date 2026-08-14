# Tech Abélard — Launch Readiness Audit
Read-only investigation. No code, config, or content was changed while producing this report.

## A. CRITICAL — must fix before launch

1. **No production domain.** `site.url = "https://techabelard.com"` (`src/data/site.ts:24`) does not resolve (confirmed: DNS/connect failure just now). This value feeds `metadataBase`, all canonical URLs, OG/Twitter tags, `sitemap.ts`, and the `ProfessionalService` JSON-LD in `layout.tsx`. Every absolute URL the site emits is currently wrong. **Fix:** register/point the real domain, update `site.url`. Complexity: Small (once domain exists).

2. **Testimonials are fake, and say so.** `src/data/testimonials.ts` — three entries all named "Placeholder Client", `isPlaceholder: true`, rendered with a visible "Demo placeholders — pending real client reviews" badge (`src/components/sections/Testimonials.tsx:19`). Honest, but not launch-ready — a real visitor sees a badge admitting the reviews are fake. **Fix:** replace with real testimonials or remove the section pre-launch. Complexity: Medium (needs real client input).

3. **Contact form only opens a `mailto:` draft — no real backend.** `src/components/sections/ContactForm.tsx:93` and `src/components/sections/AuditForm.tsx:93` (`/contact` and `/free-audit`) both just build a `mailto:` link and immediately show a "Your email draft is ready" success state, whether or not the visitor's device actually has a mail client. Any visitor without a configured default mail app (common on shared/work computers, many mobile browsers) sees a false success message and **no lead is ever captured**. **Fix:** wire to a real transactional-email/CRM send server-side. Complexity: Medium.

4. **Portfolio "Request Live Access" and demo links depend on an external service that isn't configured.** `src/lib/portfolioAccess/osClient.ts:13` defaults `OS_API_BASE_URL` to `http://localhost:3010`; `src/lib/showcase/demoUrls.ts:12-14` default all three demo URLs (NorthLine Plumbing, NorthClimate HVAC, NorthPeak Roofing) to `localhost:3011/3012/3013`. None of `OS_API_BASE_URL`, `DEMO_URL_NORTHLINE_PLUMBING`, `DEMO_URL_NORTHCLIMATE_HVAC`, `DEMO_URL_NORTHPEAK_ROOFING` are set even in this machine's `.env.local`, and the three `DEMO_URL_*` vars aren't documented in `.env.example` at all. In production this means: "Request Live Access" 502s (or worse, silently tries to reach a nonexistent local port), and every "view live demo" link is dead. **Fix:** deploy Tech Abélard OS, set these four env vars, add the three missing ones to `.env.example`. Complexity: Large (depends on a separate service being deployed).

5. **`/api/audit` is a public, unauthenticated, rate-limit-free endpoint that makes a server-side outbound fetch to an attacker-supplied URL — an open SSRF vector.** `src/lib/audit/validation.ts`'s `URL_RE` has no block-list for private/link-local/metadata IP ranges, and services like `nip.io`/`sslip.io` let anyone craft a "domain" that resolves to `127.0.0.1` or `169.254.169.254` (cloud metadata endpoint). The code's own comment (`src/app/api/audit/route.ts:22`) already flags this: *"No auth and no rate limiting yet... a public unauthenticated endpoint that does an outbound fetch per submission needs abuse protection before it's ever deployed."* **Fix:** add an IP/hostname block-list (reject private, loopback, link-local, and metadata-range resolved IPs) and rate-limit by IP. Complexity: Medium.

6. **Audit results are stored in-process memory only — will not survive real deployment.** `src/lib/audit/store.ts` keeps results in a `Map` on `globalThis`, explicitly documented as not surviving "a serverless cold start or a multi-instance deployment." On Vercel (or any serverless/multi-instance host) a visitor can get a working audit, then hit `/audit/results/[id]` on a different instance and get "not found." **Fix:** swap for the OS-backed store the code already has an extension point for (same file, top-of-file comment lays out the exact plan). Complexity: Large.

7. **"Book a Discovery Call" Calendly integration is a visible dashed-border placeholder, not an embed.** `src/app/contact/page.tsx:47-53`: the box literally renders the text "Calendly widget placeholder — opens booking page" to real visitors. It does link out to `site.calendlyUrl`, so it's functional, but it looks unfinished. **Fix:** either embed the real Calendly inline widget, or restyle so it doesn't read as a placeholder. Complexity: Small–Medium.

7b. **Live pricing bundles show false/stale savings math after the recent price cuts.** `src/data/pricing.ts:201-230` — the bundle `standaloneValue`/`savings` strings were hand-computed and never recalculated after Essential ($1,190→$998) and Professional ($2,390→$1,499) dropped. Renders live via `PricingTabs.tsx:79,83` on `/pricing`. **Growth Bundle** (`pricing.ts:211-220`): real standalone at current prices = $1,499 + $2,070 + $447 = $4,016, but the bundle is priced at $4,120 — **the bundle costs more than buying the pieces separately**, while the page still displays "$4,907 standalone / Save $787 (~16%)." This is a false-savings claim shown to paying customers, not a cosmetic issue. Launch Bundle overstates savings by ~2.5x ($304 claimed vs. ~$112 real); Market Leader understates by ~$109 (harmless direction, still stale). **Fix:** recompute all three bundles' `standaloneValue`/`savings` from current tier prices. Complexity: Small (arithmetic + one review of bundle discount policy).

7c. **CAD price label with no actual currency conversion.** `src/data/localization.ts` sets `pricingCurrency: "CAD"` for the Canada region and `"USD"` elsewhere, but `src/data/pricing.ts` has one plain set of `$`-prefixed numerals with no FX conversion logic anywhere — a Canadian visitor sees the identical numeral relabeled "CAD" instead of a converted amount. Either implement real conversion or stop relabeling the currency. Complexity: Small–Medium (decision + one conversion helper, or a copy fix).

## B. HIGH — should fix before launch

8. **Two separate, disconnected "audit" experiences.** `/free-audit` (`AuditForm`, mailto-only, no real scan) and `/audit` (`AuditExperience`, real HTML-fetch scoring engine, `/api/audit`) both exist and are both linked from the site (Header's "Free Audit" CTA → `/free-audit`). A visitor doing the header CTA never sees the real scoring engine. Decide which is canonical before launch, or make `/free-audit`'s form feed into the real engine. File: `src/components/layout/Header.tsx:98` (nav CTA), `src/app/free-audit/page.tsx`, `src/app/audit/page.tsx`. Complexity: Medium.

9. **Portfolio "request access" and demo stub disclosure.** `src/data/portfolio.ts:70,106,141` — each project's own data explicitly notes "Wire the request/contact forms to a real inbox or CRM instead of a stub" for the demo sites themselves. Confirms the three demo properties are not launch-grade in their own right, separate from finding #4's plumbing issue. Complexity: Large (each is effectively its own mini-project).

10. **iOS Safari-only rendering bug, unconfirmed but not ruled out.** Two components combine `position: fixed`/`sticky` with `backdrop-filter: blur` and only mount conditionally on scroll state: `Header.tsx:77` (`backdrop-blur-md` on the sticky header once scrolled) and `MobileCTABar.tsx:21` (`backdrop-blur-md` on the fixed bottom bar). This exact combination is a documented WebKit compositing bug trigger (blurred fixed/sticky layers occasionally stop rendering/receiving touches on real iOS Safari after a scroll event) and is the leading *unconfirmed* hypothesis for the previously-reported "blank sections / dead buttons on real iPhone" issue — Chrome mobile-viewport testing this session found zero reproduction (clean console, all chunks 200, hit-tests clean), which is consistent with a WebKit-only bug Chrome simply can't show. A real, unrelated misconfiguration was already found and fixed this session: `next.config.ts`'s `allowedDevOrigins` pointed at a stale LAN IP (`192.168.1.244` vs the Mac's actual `192.168.2.87`) — worth confirming on the actual phone with the corrected IP before assuming the WebKit bug is still live. Complexity to test: Small (temporarily strip `backdrop-blur-md` on mobile, test on the real device). Complexity to fix if confirmed: Medium.

11. **No `.env.example` entries for the three demo-URL variables** (see #4) — anyone deploying from the README/example alone will not know they're missing. Complexity: Small.

12. **`isValidWebsiteUrl` regex (`src/lib/audit/validation.ts:36`) allows `:port` and paths but has no length cap or scheme allow-list beyond http/https** — low-severity hardening item alongside #5. Complexity: Small.

12b. **No Content-Security-Policy header.** `next.config.ts:4-33` sets HSTS/X-Frame-Options/nosniff/Referrer-Policy/Permissions-Policy/COOP/CORP correctly, but no CSP. Defense-in-depth gap, not urgent for a site with no user-generated HTML rendering. Complexity: Small–Medium (needs care to not break inline JSON-LD scripts in `layout.tsx`).

12c. **No rate limiting/schema validation on any of the 4 API routes** (`api/audit`, `api/audit/[id]`, `api/request-access`, `api/showcase/validate`) beyond what's already flagged for #5. `showcase/validate`'s access-code check has no visible throttling in this repo (may be enforced upstream by the OS backend — unverified here). Complexity: Medium.

12d. **iOS body-scroll-lock likely incomplete.** `Header.tsx:26` sets `document.body.style.overflow = "hidden"` as the only scroll lock while the mobile menu is open. This alone is known to not reliably stop background rubber-band scroll on iOS Safari under a `position:fixed` overlay (`Header.tsx:124`) — the standard iOS-safe fix is `position:fixed` + a recorded `top` offset on `body`, not `overflow:hidden` alone. Plausible contributor to "menu feels broken" reports on real devices. Complexity: Small.

12e. **Safe-area-inset coverage is inconsistent.** `MobileCTABar.tsx:21` and the audit results page correctly use `env(safe-area-inset-bottom)`; the mobile nav panel (`Header.tsx:124`, `fixed inset-x-0 top-20 bottom-0`) has no bottom safe-area padding, and `Hero.tsx` has no top safe-area handling. On notch/Dynamic-Island/home-indicator devices this can crowd the last nav item or CTA. Complexity: Small.

## C. MEDIUM — can fix shortly after launch

13. **Region-targeting keyword metadata still says "Burundi"/"Bujumbura."** Not customer-visible (only in `<meta keywords>` and OG `locale`/JSON-LD `addressCountry`, which the code deliberately keeps out of rendered copy — confirmed no visible "Burundi"/"Canada"/"International" string anywhere in actual page content, `src/data/localization.ts`), but still present in page source. Low SEO value either way (Google ignores the keywords meta tag). File: `src/data/localization.ts:98-101`. Complexity: Small.

14. **Pricing currency correctness across regions is defined but not independently verified this session** — `pricingCurrency` is CAD for Canada, USD elsewhere (`src/data/localization.ts`), and `pricing.ts` values are consistent with the requested $998/$1,499/$4,499 with no duplicate hardcoded copies found anywhere else in `src`. Worth a manual click-through per region before launch, but no inconsistency was found in code. Complexity: Small (verification only).

15. **Audit engine's stage-progress UI is an explicitly-labeled placeholder driver.** `src/lib/audit/progress.ts:50`: *"the placeholder driver until a real backend can push stage ids directly."* Cosmetic — the audit itself runs synchronously and is real (see Section D below) — but the animated "progress" the visitor watches doesn't reflect real backend stages yet. Complexity: Medium.

## D. LOW — polish

16. Two visually distinct "audit" surfaces (see #8) is also a content/IA polish issue beyond the functional one.
17. `.env.example` comments are otherwise excellent (rare — worth preserving as the model for future secrets docs).

---

## Section-by-section notes not already covered above

**Forms — real vs. mock, at a glance:**
| Form | Route | Backend | Verdict |
|---|---|---|---|
| Contact | `/contact` | `mailto:` only | MOCK (client-only, false-success risk) |
| Free Website Audit intake | `/free-audit` | `mailto:` only | MOCK — separate from the real engine below |
| Instant Audit | `/audit` | `POST /api/audit` → `runAudit()` → real server-side HTML fetch + regex scoring | REAL analysis, but ephemeral storage (#6) and no abuse protection (#5) |
| Request Live Access | portfolio project pages | `POST /api/request-access` → forwards to external "Tech Abélard OS" | REAL code path, but unreachable until OS is deployed + env vars set (#4) |
| Showcase access gate | `/showcase/access` | `POST /api/showcase/validate` → same OS dependency | Same caveat as above |
| Newsletter/lead capture | — | — | None found on the site |

**Audit engine architecture (Section 4):** `src/lib/audit/` — `engine.ts` (orchestrator), `checks.ts` (real, honest signal extraction via a single unauthenticated `fetch` + regex parsing — no headless browser; explicitly marks anything it can't honestly measure, e.g. Core Web Vitals, Google Business Profile data, real color contrast, as "not measured" rather than guessing), `score.ts`/`rating.ts`/`narrate.ts`/`opportunities.ts` (scoring + copy generation from those signals), `store.ts` (ephemeral, see #6), `mock-data/fixtures.ts` (dev-only, gated behind `NODE_ENV !== "production"` at `src/app/audit/preview/[fixture]/page.tsx:14` — correctly can't leak to production). This is a genuinely real, well-reasoned instant-audit implementation, not smoke and mirrors — its gaps are operational (storage, abuse protection), not fabricated capability.

**Security posture — what's already good:** no `NEXT_PUBLIC_*` env vars anywhere (zero client-exposed secrets found), `.env.local` correctly gitignored (only `.env.example` tracked), `SHOWCASE_SESSION_SECRET`/`PORTFOLIO_ACCESS_INTERNAL_KEY` both fail closed (throw) if unset rather than silently degrading, solid security headers already configured in `next.config.ts` (HSTS, X-Frame-Options, nosniff, Permissions-Policy, COOP/CORP), showcase routes both `disallow`ed in `robots.ts` and (per code comments) set their own per-page `noindex`.

**Performance posture:** only 11 `"use client"` components in the whole `src/` tree (lean), zero raw `<img>` tags (everything goes through `next/image`), zero stray `console.log`, zero hardcoded `localhost` strings outside the documented env-var fallbacks already flagged above, no Framer Motion dependency, no `100vh`/`dvh` viewport-unit landmines, fonts loaded via `next/font/google` with `display: "swap"`. No major performance red flags found — this section is in good shape.

**SEO posture:** every route has its own metadata (`generateMetadata` or `export const metadata`) except the homepage, which correctly inherits the root layout's default — that's the standard Next.js pattern, not a gap. `sitemap.ts` and `robots.ts` are both well-built and correctly exclude `/showcase`. Root `ProfessionalService` JSON-LD is present; no separate per-service `Service` schema was found on `/services` — worth adding, but not launch-blocking.

---

## TOP 10 LAUNCH BLOCKERS (ranked)

1. No live production domain (`site.url` doesn't resolve) — A1
2. Pricing bundles show false/stale savings math — Growth Bundle costs more than buying separately while claiming a 16% discount — A7b
3. Contact + Free Audit forms are mailto-only with a false success state — A3
4. `/api/audit` open SSRF + no rate limiting — A5
5. Audit results storage won't survive real deployment — A6
6. Portfolio Access / demo links depend on an undeployed external service — A4
7. Fake testimonials with a visible "placeholder" badge — A2
8. Visible "Calendly widget placeholder" text on the live Contact page — A7
9. CAD price label applied to unconverted USD numerals — A7c
10. Two disconnected audit experiences confuse the primary CTA path — B8

(Unconfirmed WebKit backdrop-blur+fixed bug and the incomplete iOS scroll-lock — B10/B12d — are real-device hypotheses worth a 5-minute physical test, not proven blockers, so ranked just outside the top 10.)

## RECOMMENDED FIX ORDER

1. **Domain** (#1) — unblocks correct metadata/canonical/sitemap immediately, needed before anything else is truly "live."
2. **Fix the three bundle price/savings numbers** (#2) — pure arithmetic, ~15 minutes, removes a live false-advertising claim.
3. **`/api/audit` SSRF block-list + rate limiting** (#4) — security risk that gets worse the longer the endpoint is public; fix before any real traffic.
4. **Audit result storage → OS-backed** (#5) — same feature area, do it alongside #4 while you're in that code.
5. **Real send path for Contact + Free Audit forms** (#3) — direct revenue impact (lead loss) if this isn't fixed before launch traffic arrives.
6. **Decide the one canonical audit flow** (#10) — resolve before promoting the site, otherwise the header CTA quietly funnels people into the weaker path.
7. **Calendly real embed (or restyle)** (#8) — small, but visibly "unfinished" the moment someone hits Contact.
8. **Deploy Tech Abélard OS + set the four env vars, document them** (#6 + B11) — unblocks portfolio "Request Live Access" and live demo links; do once, fixes two blockers.
9. **Decide real currency conversion vs. dropping the CAD relabel** (#9) — small, but currently mislabels a price to Canadian visitors.
10. **Real testimonials or remove the section** (#7) — needs external input, so start requesting these in parallel with the above, not after.
11. **Physically test the WebKit backdrop-blur + scroll-lock hypotheses on a real iPhone** at the corrected LAN IP — quick test; only build a fix if it reproduces.
12. Everything else in Medium/Low (region keyword cleanup, CSP header, per-service schema, progress-UI backend wiring) — batch into a post-launch polish pass.

No app code, configuration, or page content was modified during this audit. Two things happened to files: (1) the `next.config.ts` IP fix and `Header.tsx` mobile-menu typography fix were both made in the *prior* session, before this read-only audit began; (2) this `LAUNCH_AUDIT.md` file itself was created/edited during the audit as the report deliverable — flagged transparently since the brief was "investigation only," but it's a new doc, not a change to the site.
