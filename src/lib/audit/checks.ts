import "server-only";
import { normalizeWebsiteUrl } from "./validation";
import { safeFetch, UnsafeUrlError } from "./ssrfGuard";

// Real, lightweight signal extraction for the instant audit — fetches the
// visitor's own site and parses the raw HTML with small regex helpers
// (no headless browser, no DOM parser dependency). This intentionally
// mirrors the category shape Tech Abélard OS's human-reviewed audit engine
// already checks (viewport, title/meta, alt coverage, structured data,
// trust/conversion signals) so the two systems stay conceptually aligned,
// without sharing code — this one is instant and automated, that one is
// deep and human-verified. See AGENTS.md for why: this repo runs a
// pinned Next.js 16, not the one in training data.
//
// Deliberate scope boundary: some checks in the 8-category report (Core Web
// Vitals from real users, Google Business Profile / review data, rendered
// color contrast, true keyboard-navigation testing, a full internal-link
// crawl) cannot be measured honestly from a single unauthenticated HTML
// fetch. Those are marked `null`/`false` with a dedicated "not measured"
// flag rather than guessed at — narrate.ts and score.ts must never treat an
// unmeasured signal as a confirmed failure.

export interface SiteSignals {
  fetchOk: boolean;
  fetchError: string | null;
  httpStatus: number | null;
  finalUrl: string | null;
  isHttps: boolean;
  wasRedirected: boolean;
  responseTimeMs: number | null;
  pageWeightBytes: number | null;

  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  viewportPresent: boolean;
  viewportContent: string | null;
  charsetPresent: boolean;
  langPresent: boolean;
  faviconPresent: boolean;
  canonicalPresent: boolean;

  /** null when the robots.txt check itself couldn't run (timeout, etc.) — not the same as "missing." */
  robotsTxtPresent: boolean | null;
  sitemapPresent: boolean | null;

  h1Count: number;
  headingCount: number;
  headingHierarchyOk: boolean;

  imageCount: number;
  imagesMissingAlt: number;

  structuredDataCount: number;
  localBusinessSchemaPresent: boolean;
  openGraphPresent: boolean;

  internalLinkCount: number;
  externalLinkCount: number;
  telLinkPresent: boolean;
  mailtoLinkPresent: boolean;
  formCount: number;
  formInputCount: number;
  formLabeledInputCount: number;
  formSubmitControlPresent: boolean;
  /** A link elsewhere in the site (e.g. nav/footer "Contact" button) pointing at a contact/quote/booking page — evidence of an off-page conversion path even when this page has no inline form. */
  hasContactPageLink: boolean;
  /** A known third-party form/scheduling embed (Typeform, HubSpot, Calendly, Google Forms, JotForm, Wufoo, Tally, Formspree action, etc.) detected via script/iframe src or form action. */
  hasEmbeddedFormWidget: boolean;

  hasPrivacyPolicyLink: boolean;
  hasTermsLink: boolean;
  hasTestimonialSignal: boolean;
  hasCallToActionSignal: boolean;
  hasNapPhoneSignal: boolean;
  hasAddressSignal: boolean;
  hasServiceAreaSignal: boolean;
  wordCount: number;

  scriptCount: number;
  stylesheetCount: number;
}

const FETCH_TIMEOUT_MS = 8000;
const AUX_FETCH_TIMEOUT_MS = 4000;
const MAX_HTML_CHARS = 2_000_000;
const MAX_RESPONSE_BYTES = 3_000_000;
const MAX_AUX_RESPONSE_BYTES = 1_000_000;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function getAttr(tag: string, attr: string): string | null {
  const re = new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, "i");
  const match = tag.match(re);
  return match ? match[1] : null;
}

function findTags(html: string, tagName: string): string[] {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
}

function getMetaContent(metaTags: string[], nameOrProperty: string): string | null {
  for (const tag of metaTags) {
    const name = getAttr(tag, "name") ?? getAttr(tag, "property");
    if (name && name.toLowerCase() === nameOrProperty.toLowerCase()) {
      return getAttr(tag, "content");
    }
  }
  return null;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

// Hostnames of common third-party form/scheduling embeds — a real
// conversion path that a raw <form> count misses because the actual form
// markup lives on the provider's domain (iframe) or is injected by their
// script, not authored in this page's HTML.
const EMBEDDED_FORM_WIDGET_HOSTS =
  /(embed\.typeform\.com|typeform\.com\/to\/|js\.hsforms\.net|hsforms\.com|forms\.hubspot\.com|docs\.google\.com\/forms|forms\.gle|jotform\.com|wufoo\.com|tally\.so|formspree\.io|form\.jotform\.com|cognitoforms\.com|forms\.office\.com|calendly\.com)/i;

/** Best-effort: a known third-party form/scheduling embed (iframe/script src, or a <form action> pointing at one) — evidence of a working submission path that a bare <form> count would miss. */
function detectEmbeddedFormWidget(html: string): boolean {
  const iframeSrcs = findTags(html, "iframe").map((tag) => getAttr(tag, "src") ?? "");
  const scriptSrcs = findTags(html, "script").map((tag) => getAttr(tag, "src") ?? "");
  const formActions = findTags(html, "form").map((tag) => getAttr(tag, "action") ?? "");
  return [...iframeSrcs, ...scriptSrcs, ...formActions].some((src) => EMBEDDED_FORM_WIDGET_HOSTS.test(src));
}

/** Best-effort: does the page contain LocalBusiness (or a subtype) JSON-LD? Tolerant of malformed JSON — this is a signal, not a validator. */
function detectLocalBusinessSchema(html: string): boolean {
  const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];
  for (const block of blocks) {
    const inner = block.replace(/^<script[^>]*>/i, "").replace(/<\/script>$/i, "");
    if (/["']@type["']\s*:\s*["'](LocalBusiness|[A-Za-z]+(?:Store|Business|Restaurant|Service))["']/i.test(inner)) {
      return true;
    }
  }
  return false;
}

/** Quick timeout-guarded HEAD/GET check for an auxiliary file — returns null (not "missing") if the check itself fails to run. */
async function checkAuxFileExists(url: string): Promise<boolean | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AUX_FETCH_TIMEOUT_MS);
  try {
    const { res, body: text } = await safeFetch(
      url,
      { signal: controller.signal, headers: { "user-agent": USER_AGENT } },
      MAX_AUX_RESPONSE_BYTES
    );
    if (res.status === 404) return false;
    if (!res.ok) return null;
    if (url.endsWith("robots.txt")) return text.trim().length > 0;
    return /<urlset|<sitemapindex|<\?xml/i.test(text) || text.trim().length > 0;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function emptySignals(): Omit<
  SiteSignals,
  "fetchOk" | "fetchError" | "httpStatus" | "finalUrl" | "isHttps" | "wasRedirected" | "responseTimeMs" | "pageWeightBytes"
> {
  return {
    title: null,
    titleLength: 0,
    metaDescription: null,
    metaDescriptionLength: 0,
    viewportPresent: false,
    viewportContent: null,
    charsetPresent: false,
    langPresent: false,
    faviconPresent: false,
    canonicalPresent: false,
    robotsTxtPresent: null,
    sitemapPresent: null,
    h1Count: 0,
    headingCount: 0,
    headingHierarchyOk: false,
    imageCount: 0,
    imagesMissingAlt: 0,
    structuredDataCount: 0,
    localBusinessSchemaPresent: false,
    openGraphPresent: false,
    internalLinkCount: 0,
    externalLinkCount: 0,
    telLinkPresent: false,
    mailtoLinkPresent: false,
    formCount: 0,
    formInputCount: 0,
    formLabeledInputCount: 0,
    formSubmitControlPresent: false,
    hasContactPageLink: false,
    hasEmbeddedFormWidget: false,
    hasPrivacyPolicyLink: false,
    hasTermsLink: false,
    hasTestimonialSignal: false,
    hasCallToActionSignal: false,
    hasNapPhoneSignal: false,
    hasAddressSignal: false,
    hasServiceAreaSignal: false,
    wordCount: 0,
    scriptCount: 0,
    stylesheetCount: 0,
  };
}

export async function fetchSiteSignals(rawUrl: string): Promise<SiteSignals> {
  const url = normalizeWebsiteUrl(rawUrl);
  const empty = emptySignals();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const { res, body } = await safeFetch(
      url,
      {
        signal: controller.signal,
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml",
        },
      },
      MAX_RESPONSE_BYTES
    );
    const responseTimeMs = Date.now() - startedAt;

    if (!res.ok) {
      return {
        ...empty,
        fetchOk: false,
        fetchError: `Site responded with HTTP ${res.status}.`,
        httpStatus: res.status,
        finalUrl: res.url || null,
        isHttps: res.url.startsWith("https://"),
        wasRedirected: false,
        responseTimeMs,
        pageWeightBytes: null,
      };
    }

    let html = body;
    if (html.length > MAX_HTML_CHARS) html = html.slice(0, MAX_HTML_CHARS);
    const pageWeightBytes = Number(res.headers.get("content-length")) || Buffer.byteLength(html, "utf8");
    const finalUrl = res.url || url;

    const metaTags = findTags(html, "meta");
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    const metaDescription = getMetaContent(metaTags, "description");
    const viewport = getMetaContent(metaTags, "viewport");
    const canonicalPresent = /<link[^>]+rel=["']canonical["']/i.test(html);

    const headingMatches = html.match(/<h[1-6][^>]*>/gi) ?? [];
    const h1Matches = html.match(/<h1[^>]*>/gi) ?? [];
    const headingLevels = headingMatches.map((tag) => Number(tag.match(/<h([1-6])/i)?.[1] ?? 0));
    const headingHierarchyOk =
      h1Matches.length === 1 && headingLevels.every((level, i) => i === 0 || level - headingLevels[i - 1] <= 1);

    const imageTags = findTags(html, "img");
    const imagesMissingAlt = imageTags.filter((tag) => getAttr(tag, "alt") === null).length;

    const structuredDataCount = (html.match(/<script[^>]+type=["']application\/ld\+json["']/gi) ?? []).length;
    const localBusinessSchemaPresent = detectLocalBusinessSchema(html);
    const openGraphPresent = metaTags.some((tag) => (getAttr(tag, "property") ?? "").toLowerCase().startsWith("og:"));

    const anchorTags = html.match(/<a\b[^>]*href=["'][^"']*["'][^>]*>/gi) ?? [];
    let internalLinkCount = 0;
    let externalLinkCount = 0;
    let telLinkPresent = false;
    let mailtoLinkPresent = false;
    let hasPrivacyPolicyLink = false;
    let hasTermsLink = false;
    // A nav/footer/CTA link to a contact, quote, or booking page elsewhere on
    // the site — matched on the URL path, not the link text (a "Book a
    // Discovery Call" button pointing at /contact still counts). This is
    // evidence the *scanned page* isn't the site's only conversion path, even
    // when it has no inline form of its own; it does not mean a form exists
    // on the page currently being scored.
    let hasContactPageLink = false;
    const CONTACT_PATH_RE = /\/(contact|get-a-quote|request-a-quote|free-quote|quote|schedule|booking|book-a-call|book-now|book)(\/|$|\?|#)/i;
    for (const tag of anchorTags) {
      const href = (getAttr(tag, "href") ?? "").trim();
      if (!href) continue;
      if (href.startsWith("tel:")) telLinkPresent = true;
      else if (href.startsWith("mailto:")) mailtoLinkPresent = true;
      else if (href.startsWith("http://") || href.startsWith("https://")) {
        try {
          const linkUrl = new URL(href);
          const isInternal = linkUrl.host === new URL(finalUrl).host;
          externalLinkCount += isInternal ? 0 : 1;
          internalLinkCount += isInternal ? 1 : 0;
          if (CONTACT_PATH_RE.test(linkUrl.pathname)) hasContactPageLink = true;
        } catch {
          // malformed href — ignore
        }
      } else if (href.startsWith("/") || href.startsWith("#") || !href.includes(":")) {
        internalLinkCount += 1;
        if (CONTACT_PATH_RE.test(href)) hasContactPageLink = true;
      }
      if (/privacy/i.test(href)) hasPrivacyPolicyLink = true;
      if (/terms/i.test(href)) hasTermsLink = true;
    }
    if (/calendly\.com/i.test(html)) hasContactPageLink = true;

    // <form> markup is picked up here regardless of whether CSS/JS currently
    // hides it (e.g. a modal that starts `display:none` or is only toggled
    // open on click) — this is a raw-HTML scan, so any form Next.js
    // server-rendered into the initial payload is counted whether or not a
    // visitor has clicked anything yet. What this cannot see is a form whose
    // *markup itself* is only mounted client-side after an interaction
    // (e.g. lazily rendered on first open) — that's a real client-rendered-
    // content blind spot, not a bug in this regex.
    const formTags = findTags(html, "form");
    const inputTags = [...findTags(html, "input"), ...findTags(html, "textarea"), ...findTags(html, "select")].filter(
      (tag) => !/type\s*=\s*["'](hidden|submit|button)["']/i.test(tag)
    );
    const labelForTargets = new Set(
      (html.match(/<label\b[^>]*>/gi) ?? []).map((tag) => getAttr(tag, "for")).filter((v): v is string => Boolean(v))
    );
    const formLabeledInputCount = inputTags.filter((tag) => {
      const id = getAttr(tag, "id");
      return Boolean((id && labelForTargets.has(id)) || getAttr(tag, "aria-label") || getAttr(tag, "aria-labelledby"));
    }).length;
    const formBlocks = html.match(/<form\b[\s\S]*?<\/form>/gi) ?? [];
    const formSubmitControlPresent =
      /<input[^>]*type\s*=\s*["']submit["']/i.test(html) ||
      // Any <button> inside a <form> counts unless explicitly typed away from
      // submit — that's the HTML-spec default for a type-less <button>.
      formBlocks.some((block) => /<button(?![^>]*type\s*=\s*["'](button|reset)["'])[^>]*>/i.test(block));
    const hasEmbeddedFormWidget = detectEmbeddedFormWidget(html);

    const bodyText = stripTags(html);
    if (/privacy\s*polic/i.test(bodyText)) hasPrivacyPolicyLink = true;
    const hasTestimonialSignal = /testimonial|review|"[^"]{20,}"\s*[-—]\s*\w/i.test(bodyText);
    const hasCallToActionSignal =
      /call\s+(now|today)|get\s+a\s+(free\s+)?quote|book\s+(a|an|now)|schedule\s+(a|an)|contact\s+us|request\s+a\s+quote|free\s+estimate/i.test(
        bodyText
      );
    const hasNapPhoneSignal = telLinkPresent || /\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/.test(bodyText);
    const hasAddressSignal =
      /\b\d{1,6}\s+[A-Za-z0-9.'\s]{2,40}\s(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|suite|ste)\b/i.test(
        bodyText
      ) || /\b\d{5}(-\d{4})?\b/.test(bodyText);
    const hasServiceAreaSignal = /service\s+area|areas?\s+we\s+serve|serving\s+[A-Z]|proudly\s+serving/i.test(bodyText);
    const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;

    const origin = new URL(finalUrl).origin;
    const [robotsTxtPresent, sitemapPresent] = await Promise.all([
      checkAuxFileExists(`${origin}/robots.txt`),
      checkAuxFileExists(`${origin}/sitemap.xml`),
    ]);

    return {
      fetchOk: true,
      fetchError: null,
      httpStatus: res.status,
      finalUrl,
      isHttps: finalUrl.startsWith("https://"),
      wasRedirected: finalUrl.replace(/\/$/, "") !== url.replace(/\/$/, ""),
      responseTimeMs,
      pageWeightBytes,
      title,
      titleLength: title?.length ?? 0,
      metaDescription,
      metaDescriptionLength: metaDescription?.length ?? 0,
      viewportPresent: Boolean(viewport),
      viewportContent: viewport,
      charsetPresent: /<meta[^>]+charset/i.test(html),
      langPresent: /<html[^>]+lang=/i.test(html),
      faviconPresent: /<link[^>]+rel=["'](?:shortcut )?icon["']/i.test(html),
      canonicalPresent,
      robotsTxtPresent,
      sitemapPresent,
      h1Count: h1Matches.length,
      headingCount: headingMatches.length,
      headingHierarchyOk,
      imageCount: imageTags.length,
      imagesMissingAlt,
      structuredDataCount,
      localBusinessSchemaPresent,
      openGraphPresent,
      internalLinkCount,
      externalLinkCount,
      telLinkPresent,
      mailtoLinkPresent,
      formCount: formTags.length,
      formInputCount: inputTags.length,
      formLabeledInputCount,
      formSubmitControlPresent,
      hasContactPageLink,
      hasEmbeddedFormWidget,
      hasPrivacyPolicyLink,
      hasTermsLink,
      hasTestimonialSignal,
      hasCallToActionSignal,
      hasNapPhoneSignal,
      hasAddressSignal,
      hasServiceAreaSignal,
      wordCount,
      scriptCount: (html.match(/<script\b[^>]*src=/gi) ?? []).length,
      stylesheetCount: (html.match(/<link[^>]+rel=["']stylesheet["']/gi) ?? []).length,
    };
  } catch (err) {
    const responseTimeMs = Date.now() - startedAt;
    const message =
      err instanceof UnsafeUrlError
        ? "That address can't be audited."
        : err instanceof Error && err.name === "AbortError"
          ? "The site took too long to respond."
          : "We couldn't reach that site — check the URL and try again.";
    return {
      ...empty,
      fetchOk: false,
      fetchError: message,
      httpStatus: null,
      finalUrl: null,
      isHttps: url.startsWith("https://"),
      wasRedirected: false,
      responseTimeMs,
      pageWeightBytes: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}
