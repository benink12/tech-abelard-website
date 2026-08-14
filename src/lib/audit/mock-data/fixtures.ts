import { buildTopOpportunities } from "../opportunities";
import { priorityFromScore } from "../score";
import { ratingForScore } from "../rating";
import { AUDIT_CATEGORY_LABELS, type AuditCategoryIssue, type AuditCategoryKey, type AuditCategoryResult, type AuditResult } from "../types";

// MOCK / TEST DATA — for local development and QA previewing of the results
// dashboard only. None of this reflects a real scan of a real website; it
// exists so the report UI can be built and reviewed without depending on a
// live outbound fetch (see src/app/audit/preview/[fixture]/page.tsx, which
// is disabled outside development). Every field here uses the same schema
// runAudit() produces in src/lib/audit/engine.ts.

function category(
  key: AuditCategoryKey,
  score: number,
  summary: string,
  strengths: string[],
  problems: AuditCategoryIssue[]
): AuditCategoryResult {
  return {
    key,
    label: AUDIT_CATEGORY_LABELS[key],
    score,
    summary,
    strengths,
    problems,
    priority: priorityFromScore(score),
  };
}

function issue(
  id: string,
  fields: Pick<AuditCategoryIssue, "issue" | "whyItMatters" | "recommendedFix" | "technicalDetail" | "severity">
): AuditCategoryIssue {
  return { id, ...fields };
}

function buildFixture(input: {
  id: string;
  businessName: string;
  websiteUrl: string;
  industry: AuditResult["lead"]["industry"];
  categories: AuditCategoryResult[];
}): AuditResult {
  const overallScore = Math.round(input.categories.reduce((sum, c) => sum + c.score, 0) / input.categories.length);
  return {
    id: input.id,
    lead: {
      businessName: input.businessName,
      websiteUrl: input.websiteUrl,
      industry: input.industry,
      name: "Jordan Ellis",
      email: "jordan@example.com",
      phone: "5035550142",
    },
    requestedAt: "2026-08-01T15:04:00.000Z",
    completedAt: "2026-08-01T15:04:41.000Z",
    overallScore,
    overallRating: ratingForScore(overallScore),
    scanIncomplete: false,
    categories: input.categories,
    topOpportunities: buildTopOpportunities(input.categories),
    siteMeta: {
      requestedUrl: input.websiteUrl,
      finalUrl: `https://${input.websiteUrl.replace(/^https?:\/\//, "")}`,
      fetchOk: true,
      fetchError: null,
      httpStatus: 200,
      title: `${input.businessName} | Official Site`,
    },
  };
}

/** MOCK — a strong, well-built site with only minor polish left. */
export const MOCK_AUDIT_STRONG: AuditResult = buildFixture({
  id: "mock-strong-redwood-plumbing",
  businessName: "Redwood Fine Plumbing",
  websiteUrl: "redwoodfineplumbing.com",
  industry: "Plumbing",
  categories: [
    category(
      "technicalHealth",
      95,
      "The technical foundations search engines and browsers rely on are largely in place.",
      ["The site loads securely over HTTPS.", "A sitemap and robots.txt are both in place.", "Structured data is present, helping search engines understand the business."],
      [
        issue("technical-canonical", {
          issue: "A couple of pages don't declare their canonical URL.",
          whyItMatters: "This is a minor gap — it only matters if those pages are ever duplicated elsewhere.",
          recommendedFix: "Add canonical tags to the remaining service pages.",
          severity: "low",
        }),
      ]
    ),
    category(
      "performance",
      90,
      "It's a fast, lean page on the measures checked here.",
      ["Page weight is a lean 0.9MB on this load.", "The server responded in 310ms, a fast first response."],
      []
    ),
    category(
      "mobile",
      94,
      "The static signals for mobile-readiness look solid.",
      ["A proper responsive viewport is set, the foundation of a mobile-adapting layout.", "Most images have alt text."],
      []
    ),
    category(
      "seo",
      88,
      "The technical SEO fundamentals here are largely in place.",
      ["The page title is a good length.", "The page has exactly one main heading, which is the best practice."],
      [
        issue("seo-meta-description-length", {
          issue: "Your search description is an awkward length.",
          whyItMatters: "Google displays roughly 50–160 characters well — outside that range, it gets cut off or looks sparse.",
          recommendedFix: "Rewrite the meta description to fall within about 50–160 characters.",
          technicalDetail: "Meta description is 187 characters.",
          severity: "low",
        }),
      ]
    ),
    category(
      "localSeo",
      91,
      "The on-page local signals here are strong.",
      ["A phone number is visible on the page.", "LocalBusiness structured data is present.", "The page describes the areas served."],
      []
    ),
    category(
      "accessibility",
      85,
      "The structural signals checked here are in good shape.",
      ["The page declares its language.", "Every form field on the page has a proper label."],
      [
        issue("accessibility-alt-text", {
          issue: "A few images don't have descriptions for visitors who use a screen reader.",
          whyItMatters: "Without alt text, a screen reader either skips the image or reads its file name, which tells a visitor nothing.",
          recommendedFix: "Add descriptive alt text to the remaining images.",
          technicalDetail: "3 of 22 images are missing an alt attribute.",
          severity: "medium",
        }),
      ]
    ),
    category(
      "trust",
      96,
      "The trust signals a first-time visitor looks for are largely present.",
      ["The site loads over HTTPS.", "A privacy policy and terms link were both found.", "The page shows real customer testimonials."],
      []
    ),
    category(
      "conversion",
      93,
      "The basic conversion paths a ready-to-buy visitor needs are in place.",
      ["A tap-to-call phone link is present.", "The page contains clear call-to-action language."],
      []
    ),
  ],
});

/** MOCK — a mid-size local business site with real, fixable gaps. */
export const MOCK_AUDIT_AVERAGE: AuditResult = buildFixture({
  id: "mock-average-coastal-ridge-roofing",
  businessName: "Coastal Ridge Roofing",
  websiteUrl: "coastalridgeroofing.com",
  industry: "Roofing",
  categories: [
    category(
      "technicalHealth",
      62,
      "There are real technical gaps here that are worth closing.",
      ["The site loads securely over HTTPS."],
      [
        issue("technical-sitemap", {
          issue: "There's no sitemap listing your pages for search engines.",
          whyItMatters: "A sitemap helps Google find and index all of your pages, not just the ones it stumbles onto through links.",
          recommendedFix: "Generate and publish an XML sitemap, then submit it in Google Search Console.",
          technicalDetail: "No sitemap.xml was found at the site root.",
          severity: "medium",
        }),
        issue("technical-structured-data", {
          issue: "The page doesn't describe your business in a format search engines can read directly.",
          whyItMatters: "Structured data is how businesses get rich results in search — star ratings, hours, and business type shown right in the listing.",
          recommendedFix: "Add schema.org structured data describing the business.",
          severity: "medium",
        }),
      ]
    ),
    category(
      "performance",
      58,
      "There's real headroom to speed this page up.",
      [],
      [
        issue("performance-weight", {
          issue: "Your homepage is heavier than it needs to be.",
          whyItMatters: "On a phone connection, a heavy page takes noticeably longer to finish loading, and visitors leave before it does.",
          recommendedFix: "Compress and resize images, and remove any scripts or fonts the page doesn't actually need.",
          technicalDetail: "This page transferred 3.4MB on load.",
          severity: "high",
        }),
      ]
    ),
    category(
      "mobile",
      71,
      "The static signals suggest a mobile experience with real gaps.",
      ["A proper responsive viewport is set."],
      [
        issue("mobile-alt-text", {
          issue: "Many images on the page are missing descriptions.",
          whyItMatters: "Screen readers and search engines can't tell what these images show.",
          recommendedFix: "Add short, descriptive alt text to every meaningful image.",
          technicalDetail: "48% of images are missing alt text (12 of 25).",
          severity: "medium",
        }),
      ]
    ),
    category(
      "seo",
      65,
      "The technical SEO foundation has real gaps worth closing.",
      ["The page has exactly one main heading."],
      [
        issue("seo-meta-description-missing", {
          issue: "Your page is missing a search description.",
          whyItMatters: "Without one, Google auto-generates a snippet from page text, which rarely reads as compelling as a written one.",
          recommendedFix: "Write a one-to-two sentence meta description that makes someone want to click.",
          severity: "medium",
        }),
      ]
    ),
    category(
      "localSeo",
      60,
      "There's real room to strengthen the local signals on the page itself.",
      ["A phone number is visible on the page."],
      [
        issue("local-seo-service-area", {
          issue: "The page doesn't say which areas are served.",
          whyItMatters: "Without this, both visitors and search engines have to guess whether the business covers their neighborhood.",
          recommendedFix: "Add a short section naming the cities, towns, or service radius covered.",
          severity: "medium",
        }),
        issue("local-seo-schema", {
          issue: "The page doesn't tell search engines this is a local business.",
          whyItMatters: "LocalBusiness schema is one of the fastest ways to help a service business show up correctly in local search results.",
          recommendedFix: "Add LocalBusiness structured data with the business name, address, phone, and service area.",
          severity: "medium",
        }),
      ]
    ),
    category(
      "accessibility",
      66,
      "There are real accessibility gaps worth fixing.",
      ["The page declares its language."],
      [
        issue("accessibility-form-labels", {
          issue: "Some form fields don't have a proper label.",
          whyItMatters: "Without a label, a screen reader user can't tell what a field is asking for.",
          recommendedFix: "Give every form field a visible label, or at minimum an aria-label.",
          technicalDetail: "2 of 5 form fields have an associated label.",
          severity: "medium",
        }),
      ]
    ),
    category(
      "trust",
      74,
      "Some of the trust signals a first-time visitor looks for are missing.",
      ["The site loads over HTTPS.", "A privacy policy link was found."],
      [
        issue("trust-testimonials", {
          issue: "No testimonials or reviews were found on the page.",
          whyItMatters: "Social proof is one of the fastest ways to build trust with a visitor who's never worked with this business before.",
          recommendedFix: "Add a few real customer testimonials or a link to reviews.",
          severity: "medium",
        }),
      ]
    ),
    category(
      "conversion",
      70,
      "There are real gaps in how easily a ready-to-buy visitor can convert.",
      ["A tap-to-call phone link is present."],
      [
        issue("conversion-form", {
          issue: "There's no way to submit a form on the page.",
          whyItMatters: "Visitors who don't want to call currently have no other way to reach out.",
          recommendedFix: "Add a short quote or contact form with just a few fields.",
          severity: "high",
        }),
      ]
    ),
  ],
});

/** MOCK — an older, unmaintained site with substantial gaps. */
export const MOCK_AUDIT_WEAK: AuditResult = buildFixture({
  id: "mock-weak-value-auto-repair",
  businessName: "Value Auto Repair",
  websiteUrl: "valueautorepairshop.com",
  industry: "Automotive",
  categories: [
    category(
      "technicalHealth",
      30,
      "Several of the technical basics search engines expect are missing.",
      [],
      [
        issue("technical-https", {
          issue: "Your website doesn't load securely.",
          whyItMatters: "Browsers actively warn visitors when a site isn't secure, which can scare people away before they read a word.",
          recommendedFix: "Install an SSL certificate so the site loads over https:// everywhere.",
          severity: "critical",
        }),
        issue("technical-structured-data", {
          issue: "The page doesn't describe your business in a format search engines can read directly.",
          whyItMatters: "Structured data is how businesses get rich results in search.",
          recommendedFix: "Add schema.org structured data describing the business.",
          severity: "medium",
        }),
      ]
    ),
    category(
      "performance",
      45,
      "There's substantial room to speed this page up.",
      [],
      [
        issue("performance-response-time", {
          issue: "Your website takes too long to start loading.",
          whyItMatters: "Visitors start noticing delay past about a second and a half — the page feels slow before any content even appears.",
          recommendedFix: "Look into faster hosting or a caching layer in front of the site.",
          technicalDetail: "The server took 4100ms to respond to the initial request.",
          severity: "high",
        }),
      ]
    ),
    category(
      "mobile",
      25,
      "The static signals suggest this site is not built mobile-first, which matters — most local searches happen on a phone.",
      [],
      [
        issue("mobile-viewport-missing", {
          issue: "Your website isn't set up to adapt to phone screens.",
          whyItMatters: "Most local searches happen on a phone — without this, visitors most likely see a shrunk-down desktop layout instead of a true mobile one.",
          recommendedFix: "Add a responsive viewport meta tag and confirm the layout reflows correctly on a phone.",
          technicalDetail: "No <meta name=\"viewport\"> tag was found.",
          severity: "critical",
        }),
      ]
    ),
    category(
      "seo",
      38,
      "Several of the fundamentals search engines look for first are missing.",
      [],
      [
        issue("seo-title-missing", {
          issue: "Your page is missing a title.",
          whyItMatters: "The title is what shows as the clickable headline in Google search results.",
          recommendedFix: "Add a clear, specific title naming the business and what it does.",
          severity: "critical",
        }),
        issue("seo-h1-missing", {
          issue: "Your page has no main heading.",
          whyItMatters: "Search engines read the main heading as the strongest signal of what the page is about.",
          recommendedFix: "Add a single, clear H1 heading describing the page's main topic.",
          severity: "high",
        }),
      ]
    ),
    category(
      "localSeo",
      28,
      "Several of the local signals customers and search engines look for are missing from the page.",
      [],
      [
        issue("local-seo-phone", {
          issue: "No phone number could be found on the page.",
          whyItMatters: "Local customers expect to see a phone number immediately.",
          recommendedFix: "Display a phone number prominently, ideally in the header and footer.",
          severity: "high",
        }),
        issue("local-seo-address", {
          issue: "No address or service location could be found on the page.",
          whyItMatters: "Search engines and customers both use location details to confirm a business genuinely serves the local area.",
          recommendedFix: "Add a visible business address, or clearly list the cities and areas served.",
          severity: "high",
        }),
      ]
    ),
    category(
      "accessibility",
      40,
      "Several accessibility basics are missing.",
      [],
      [
        issue("accessibility-alt-text", {
          issue: "Most images don't have descriptions for visitors who use a screen reader.",
          whyItMatters: "Without alt text, a screen reader either skips the image entirely or reads its file name.",
          recommendedFix: "Add clear, descriptive alt text to every meaningful image.",
          technicalDetail: "14 of 16 images are missing an alt attribute.",
          severity: "high",
        }),
      ]
    ),
    category(
      "trust",
      32,
      "Several of the basic trust signals a first-time visitor looks for are missing.",
      [],
      [
        issue("trust-https", {
          issue: "This site doesn't load securely.",
          whyItMatters: "Modern browsers actively warn visitors on non-secure pages, which is a real trust cost before they've read anything.",
          recommendedFix: "Install an SSL certificate so every page loads over HTTPS.",
          severity: "critical",
        }),
        issue("trust-testimonials", {
          issue: "No testimonials or reviews were found on the page.",
          whyItMatters: "Social proof is one of the fastest ways to build trust with a new visitor.",
          recommendedFix: "Add a few real customer testimonials or a link to reviews.",
          severity: "medium",
        }),
      ]
    ),
    category(
      "conversion",
      35,
      "A visitor who's ready to buy right now has a harder path to actually contacting this business than they should.",
      [],
      [
        issue("conversion-tel-link", {
          issue: "There's no tap-to-call phone link.",
          whyItMatters: "On mobile, a tappable number converts far better than plain text a visitor has to copy and dial.",
          recommendedFix: "Make the phone number a tel: link, ideally visible without scrolling.",
          severity: "high",
        }),
        issue("conversion-cta-copy", {
          issue: "There's no clear call-to-action on the page.",
          whyItMatters: "A visitor who's ready to act should see exactly what to do next within a few seconds of landing.",
          recommendedFix: "Add a clear action phrase near the top of the page, like \"Call Now\" or \"Get a Free Estimate.\"",
          severity: "high",
        }),
      ]
    ),
  ],
});

export const MOCK_AUDIT_FIXTURES = {
  strong: MOCK_AUDIT_STRONG,
  average: MOCK_AUDIT_AVERAGE,
  weak: MOCK_AUDIT_WEAK,
} as const;

export type MockAuditFixtureKey = keyof typeof MOCK_AUDIT_FIXTURES;
