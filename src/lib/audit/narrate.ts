import type { AuditCategoryIssue, AuditCategoryKey } from "./types";
import type { SiteSignals } from "./checks";

// Turns computed signals into the copy a visitor reads — every sentence
// below is conditioned on a real, specific value from `checks.ts`, never
// invented. This is deliberately template-based rather than an LLM call:
// it's instant, free, and needs no API key, which keeps the instant-audit
// MVP fully functional without deployment or secrets.
//
// Every issue carries two layers on purpose: `issue`/`whyItMatters`/
// `recommendedFix` are written for someone who doesn't know SEO or web dev,
// and the optional `technicalDetail` is the specific thing that was
// measured, shown behind a disclosure for anyone who wants it.
//
// Extension point: to make this "AI-written" rather than "signal-driven
// templates," swap the body of each function below for a single Claude API
// call (model: claude-opus-5, output_config.format for structured JSON)
// that takes the same `SiteSignals` + score as input and is instructed to
// write copy *only* about what was actually measured — never asked to
// invent new findings. The call boundary here (signals + score in,
// {summary, strengths, problems} out) is already shaped for that swap;
// nothing upstream or downstream would need to change. Do that behind an
// `ANTHROPIC_API_KEY` presence check so the route still works without one,
// and add abuse protection first — this form has no auth, and a live LLM
// call per submission is a real cost/spam surface on a public page.

export interface CategoryNarrative {
  summary: string;
  strengths: string[];
  problems: AuditCategoryIssue[];
}

function pct(n: number, of: number): number {
  if (of === 0) return 0;
  return Math.round((n / of) * 100);
}

function issue(
  id: string,
  fields: Pick<AuditCategoryIssue, "issue" | "whyItMatters" | "recommendedFix" | "technicalDetail" | "severity">
): AuditCategoryIssue {
  return { id, ...fields };
}

export function narrateTechnicalHealth(s: SiteSignals, score: number): CategoryNarrative {
  const strengths: string[] = [];
  const problems: AuditCategoryIssue[] = [];

  if (s.isHttps) strengths.push("The site loads securely over HTTPS.");
  else
    problems.push(
      issue("technical-https", {
        issue: "Your website doesn't load securely.",
        whyItMatters: "Browsers actively warn visitors when a site isn't secure, which can scare people away before they read a word.",
        recommendedFix: "Install an SSL certificate so the site loads over https:// everywhere.",
        technicalDetail: "No valid HTTPS response was returned for the final URL.",
        severity: "critical",
      })
    );

  if (s.robotsTxtPresent === true) strengths.push("A robots.txt file is in place, guiding search engines on what to crawl.");
  else if (s.robotsTxtPresent === false)
    problems.push(
      issue("technical-robots", {
        issue: "Search engines aren't given clear crawling instructions.",
        whyItMatters: "Without this file, search engines are left to guess which pages matter, which can slow down how quickly new pages get found.",
        recommendedFix: "Add a robots.txt file at the root of the site.",
        technicalDetail: "No robots.txt was found at /robots.txt.",
        severity: "low",
      })
    );

  if (s.sitemapPresent === true) strengths.push("A sitemap is available, helping search engines find every page.");
  else if (s.sitemapPresent === false)
    problems.push(
      issue("technical-sitemap", {
        issue: "There's no sitemap listing your pages for search engines.",
        whyItMatters: "A sitemap helps Google find and index all of your pages, not just the ones it stumbles onto through links.",
        recommendedFix: "Generate and publish an XML sitemap, then submit it in Google Search Console.",
        technicalDetail: "No sitemap.xml was found at the site root.",
        severity: "medium",
      })
    );

  if (s.canonicalPresent) strengths.push("A canonical tag is set, avoiding duplicate-content confusion.");
  else
    problems.push(
      issue("technical-canonical", {
        issue: "The page doesn't tell search engines which version of the URL is the 'real' one.",
        whyItMatters: "Without this, search engines can split ranking credit between near-duplicate URLs (with and without a trailing slash, for example).",
        recommendedFix: "Add a canonical link tag pointing to the preferred URL of each page.",
        technicalDetail: "No <link rel=\"canonical\"> tag was found in the page head.",
        severity: "low",
      })
    );

  if (s.structuredDataCount > 0) strengths.push("Structured data (schema markup) is present, helping search engines understand the business.");
  else
    problems.push(
      issue("technical-structured-data", {
        issue: "The page doesn't describe your business in a format search engines can read directly.",
        whyItMatters: "Structured data is how businesses get rich results in search — star ratings, hours, and business type shown right in the listing.",
        recommendedFix: "Add schema.org structured data describing the business (LocalBusiness, hours, address).",
        technicalDetail: "No <script type=\"application/ld+json\"> blocks were found.",
        severity: "medium",
      })
    );

  if (!s.faviconPresent)
    problems.push(
      issue("technical-favicon", {
        issue: "The site is missing a favicon (browser tab icon).",
        whyItMatters: "It's a small thing, but its absence is one of the first signals visitors read as an unfinished or abandoned site.",
        recommendedFix: "Add a favicon so the site shows a proper icon in browser tabs and bookmarks.",
        severity: "low",
      })
    );

  return {
    summary:
      score >= 80
        ? "The technical foundations search engines and browsers rely on are largely in place."
        : score >= 55
          ? "There are real technical gaps here that are worth closing."
          : "Several of the technical basics search engines expect are missing.",
    strengths,
    problems,
  };
}

export function narratePerformance(s: SiteSignals, score: number): CategoryNarrative {
  const strengths: string[] = [];
  const problems: AuditCategoryIssue[] = [];
  const weightMb = (s.pageWeightBytes ?? 0) / (1024 * 1024);

  if (weightMb > 0 && weightMb <= 1.5) strengths.push(`Page weight is a lean ${weightMb.toFixed(1)}MB on this load.`);
  else if (weightMb > 1.5)
    problems.push(
      issue("performance-weight", {
        issue: "Your homepage is heavier than it needs to be.",
        whyItMatters: "On a phone connection, a heavy page takes noticeably longer to finish loading, and visitors leave before it does.",
        recommendedFix: "Compress and resize images, and remove any scripts or fonts the page doesn't actually need.",
        technicalDetail: `This page transferred ${weightMb.toFixed(1)}MB on load.`,
        severity: weightMb > 3 ? "high" : "medium",
      })
    );

  if (s.responseTimeMs !== null && s.responseTimeMs <= 1500) strengths.push(`The server responded in ${s.responseTimeMs}ms, a fast first response.`);
  else if (s.responseTimeMs !== null)
    problems.push(
      issue("performance-response-time", {
        issue: "Your website takes too long to start loading.",
        whyItMatters: "Visitors start noticing delay past about a second and a half — the page feels slow before any content even appears.",
        recommendedFix: "Look into faster hosting or a caching layer in front of the site.",
        technicalDetail: `The server took ${s.responseTimeMs}ms to respond to the initial request.`,
        severity: s.responseTimeMs > 3000 ? "high" : "medium",
      })
    );

  if (s.scriptCount <= 8) strengths.push(`Only ${s.scriptCount} external script${s.scriptCount === 1 ? "" : "s"} load on this page, keeping it lean.`);
  else
    problems.push(
      issue("performance-scripts", {
        issue: "The page loads a lot of external scripts.",
        whyItMatters: "Each script is a round trip the browser has to make before the page feels usable, which adds up on slower connections.",
        recommendedFix: "Audit third-party scripts (analytics, chat widgets, ad pixels) and remove any that aren't earning their keep.",
        technicalDetail: `${s.scriptCount} external scripts were found on this page.`,
        severity: s.scriptCount > 15 ? "high" : "medium",
      })
    );

  return {
    summary:
      "This reflects a single automated page-weight and response-time snapshot on this load, not a full Core Web Vitals audit (real-user Largest Contentful Paint, CLS, and INP data need a deeper tool than an instant scan). " +
      (score >= 80 ? "It's a fast, lean page on the measures checked here." : score >= 55 ? "There's real headroom to speed this page up." : "There's substantial room to speed this page up."),
    strengths,
    problems,
  };
}

export function narrateMobile(s: SiteSignals, score: number): CategoryNarrative {
  const strengths: string[] = [];
  const problems: AuditCategoryIssue[] = [];

  if (s.viewportPresent && /width\s*=\s*device-width/i.test(s.viewportContent ?? "")) {
    strengths.push("A proper responsive viewport is set, the foundation of a mobile-adapting layout.");
  } else if (s.viewportPresent) {
    problems.push(
      issue("mobile-viewport-incomplete", {
        issue: "Your site has a mobile setting, but it isn't configured correctly.",
        whyItMatters: "Phone browsers may not adapt the layout the way they should, which can mean tiny text or awkward zooming.",
        recommendedFix: "Update the viewport meta tag to include width=device-width, initial-scale=1.",
        technicalDetail: `Viewport tag found: "${s.viewportContent}", missing width=device-width.`,
        severity: "medium",
      })
    );
  } else {
    problems.push(
      issue("mobile-viewport-missing", {
        issue: "Your website isn't set up to adapt to phone screens.",
        whyItMatters: "Most local searches happen on a phone — without this, visitors most likely see a shrunk-down desktop layout instead of a true mobile one.",
        recommendedFix: "Add a responsive viewport meta tag and confirm the layout reflows correctly on a phone.",
        technicalDetail: "No <meta name=\"viewport\"> tag was found.",
        severity: "critical",
      })
    );
  }

  if (s.imageCount > 0) {
    const missingPct = pct(s.imagesMissingAlt, s.imageCount);
    if (missingPct <= 20) strengths.push("Most images have alt text, which also tends to correlate with a more deliberately built page.");
    else
      problems.push(
        issue("mobile-alt-text", {
          issue: "Many images on the page are missing descriptions.",
          whyItMatters: "Screen readers and search engines can't tell what these images show, and slow connections just show a blank gap where they'd load.",
          recommendedFix: "Add short, descriptive alt text to every meaningful image.",
          technicalDetail: `${missingPct}% of images are missing alt text (${s.imagesMissingAlt} of ${s.imageCount}).`,
          severity: "medium",
        })
      );
  }

  const weightMb = (s.pageWeightBytes ?? 0) / (1024 * 1024);
  if (weightMb > 3) {
    problems.push(
      issue("mobile-weight", {
        issue: "The page is heavy for a mobile connection.",
        whyItMatters: "Phones are more often on slower or spottier connections than desktops, so heavy pages hurt mobile visitors the most.",
        recommendedFix: "Prioritize image compression and lazy-loading for anything below the first screen.",
        technicalDetail: `Page weight measured at ${weightMb.toFixed(1)}MB.`,
        severity: "medium",
      })
    );
  }

  return {
    summary:
      score >= 80
        ? "The static signals for mobile-readiness look solid."
        : score >= 55
          ? "The static signals suggest a mobile experience with real gaps."
          : "The static signals suggest this site is not built mobile-first, which matters — most local searches happen on a phone.",
    strengths,
    problems,
  };
}

export function narrateSeo(s: SiteSignals, score: number): CategoryNarrative {
  const strengths: string[] = [];
  const problems: AuditCategoryIssue[] = [];

  if (s.title && s.titleLength >= 10 && s.titleLength <= 60) {
    strengths.push(`The page title ("${s.title}") is a good length at ${s.titleLength} characters.`);
  } else if (!s.title) {
    problems.push(
      issue("seo-title-missing", {
        issue: "Your page is missing a title.",
        whyItMatters: "The title is what shows as the clickable headline in Google search results — without one, search engines guess, and it usually looks unfinished.",
        recommendedFix: "Add a clear, specific <title> naming the business and what it does.",
        severity: "critical",
      })
    );
  } else if (s.titleLength > 60) {
    problems.push(
      issue("seo-title-long", {
        issue: "Your page title is too long.",
        whyItMatters: "Google typically cuts titles off around 60 characters, so the end of yours is likely getting truncated in search results.",
        recommendedFix: "Shorten the title to the most important words — business name and main service first.",
        technicalDetail: `Title is ${s.titleLength} characters.`,
        severity: "low",
      })
    );
  } else {
    problems.push(
      issue("seo-title-short", {
        issue: "Your page title is quite short.",
        whyItMatters: "A short title leaves search-ranking value on the table — there's room to describe the business and location more fully.",
        recommendedFix: "Expand the title to include the business name, main service, and city.",
        technicalDetail: `Title is only ${s.titleLength} characters.`,
        severity: "low",
      })
    );
  }

  if (s.metaDescription && s.metaDescriptionLength >= 50 && s.metaDescriptionLength <= 160) {
    strengths.push(`A meta description is set at a good length (${s.metaDescriptionLength} characters).`);
  } else if (!s.metaDescription) {
    problems.push(
      issue("seo-meta-description-missing", {
        issue: "Your page is missing a search description.",
        whyItMatters: "Without one, Google auto-generates a snippet from page text, which rarely reads as compelling as a written one.",
        recommendedFix: "Write a one-to-two sentence meta description that makes someone want to click.",
        severity: "medium",
      })
    );
  } else {
    problems.push(
      issue("seo-meta-description-length", {
        issue: "Your search description is an awkward length.",
        whyItMatters: "Google displays roughly 50–160 characters well — outside that range, it gets cut off or looks sparse.",
        recommendedFix: "Rewrite the meta description to fall within about 50–160 characters.",
        technicalDetail: `Meta description is ${s.metaDescriptionLength} characters.`,
        severity: "low",
      })
    );
  }

  if (s.h1Count === 1) strengths.push("The page has exactly one main heading, which is the best practice.");
  else if (s.h1Count === 0)
    problems.push(
      issue("seo-h1-missing", {
        issue: "Your page has no main heading.",
        whyItMatters: "Search engines read the main heading as the strongest signal of what the page is about.",
        recommendedFix: "Add a single, clear H1 heading describing the page's main topic.",
        severity: "high",
      })
    );
  else
    problems.push(
      issue("seo-h1-multiple", {
        issue: "Your page has more than one main heading.",
        whyItMatters: "Multiple top-level headings dilute the single clearest signal search engines look for.",
        recommendedFix: "Use one H1 per page, with supporting headings underneath it.",
        technicalDetail: `${s.h1Count} H1 elements were found.`,
        severity: "low",
      })
    );

  if (!s.headingHierarchyOk)
    problems.push(
      issue("seo-heading-order", {
        issue: "The page's headings don't follow a clear order.",
        whyItMatters: "A jumbled heading structure makes it harder for search engines — and screen reader users — to understand how the page is organized.",
        recommendedFix: "Structure headings so they step down in order (H1, then H2s, then H3s) rather than skipping levels.",
        severity: "low",
      })
    );

  if (s.internalLinkCount === 0)
    problems.push(
      issue("seo-internal-links", {
        issue: "The page doesn't link to any other pages on the site.",
        whyItMatters: "Internal links help visitors find more of what you offer and help search engines understand how your site is structured.",
        recommendedFix: "Add links to relevant service pages, the contact page, or an about page from this one.",
        severity: "medium",
      })
    );

  return {
    summary:
      score >= 80
        ? "The technical SEO fundamentals here are largely in place."
        : score >= 55
          ? "The technical SEO foundation has real gaps worth closing."
          : "Several of the fundamentals search engines look for first are missing.",
    strengths,
    problems,
  };
}

export function narrateLocalSeo(s: SiteSignals, score: number): CategoryNarrative {
  const strengths: string[] = [];
  const problems: AuditCategoryIssue[] = [];

  if (s.hasNapPhoneSignal) strengths.push("A phone number is visible on the page, a basic local-trust signal.");
  else
    problems.push(
      issue("local-seo-phone", {
        issue: "No phone number could be found on the page.",
        whyItMatters: "Local customers expect to see a phone number immediately — its absence reads as either not a real local business or hard to reach.",
        recommendedFix: "Display a phone number prominently, ideally in the header and footer.",
        severity: "high",
      })
    );

  if (s.hasAddressSignal) strengths.push("An address or location detail is visible on the page.");
  else
    problems.push(
      issue("local-seo-address", {
        issue: "No address or service location could be found on the page.",
        whyItMatters: "Search engines and customers both use location details to confirm a business genuinely serves the local area.",
        recommendedFix: "Add a visible business address, or clearly list the cities and areas served.",
        severity: "high",
      })
    );

  if (s.hasServiceAreaSignal) strengths.push("The page describes the areas or locations served.");
  else
    problems.push(
      issue("local-seo-service-area", {
        issue: "The page doesn't say which areas are served.",
        whyItMatters: "Without this, both visitors and search engines have to guess whether the business covers their neighborhood.",
        recommendedFix: "Add a short section naming the cities, towns, or service radius covered.",
        severity: "medium",
      })
    );

  if (s.localBusinessSchemaPresent) strengths.push("LocalBusiness structured data is present, helping search engines confirm the business details.");
  else
    problems.push(
      issue("local-seo-schema", {
        issue: "The page doesn't tell search engines this is a local business.",
        whyItMatters: "LocalBusiness schema is one of the fastest ways to help a service business show up correctly in local search results.",
        recommendedFix: "Add LocalBusiness structured data with the business name, address, phone, and service area.",
        technicalDetail: "No LocalBusiness (or subtype) JSON-LD block was detected.",
        severity: "medium",
      })
    );

  if (!s.telLinkPresent)
    problems.push(
      issue("local-seo-tel-link", {
        issue: "The phone number on the page isn't tap-to-call.",
        whyItMatters: "On mobile, a plain phone number requires copying and dialing manually — a tappable one converts far better.",
        recommendedFix: "Make the phone number a tel: link so it's one tap to call from a phone.",
        severity: "medium",
      })
    );

  return {
    summary:
      "This covers the on-page local signals an instant scan can check — it doesn't include your Google Business Profile status or review count, which need a separate, authenticated look. " +
      (score >= 80
        ? "The on-page local signals here are strong."
        : score >= 55
          ? "There's real room to strengthen the local signals on the page itself."
          : "Several of the local signals customers and search engines look for are missing from the page."),
    strengths,
    problems,
  };
}

export function narrateAccessibility(s: SiteSignals, score: number): CategoryNarrative {
  const strengths: string[] = [];
  const problems: AuditCategoryIssue[] = [];

  if (s.imageCount > 0) {
    const missingRatio = s.imagesMissingAlt / s.imageCount;
    if (missingRatio === 0) strengths.push("Every image on the page has alt text.");
    else
      problems.push(
        issue("accessibility-alt-text", {
          issue: "Some images don't have descriptions for visitors who use a screen reader.",
          whyItMatters: "Without alt text, a screen reader either skips the image entirely or reads its file name, which tells a visitor nothing.",
          recommendedFix: "Add clear, descriptive alt text to every meaningful image.",
          technicalDetail: `${s.imagesMissingAlt} of ${s.imageCount} images are missing an alt attribute.`,
          severity: missingRatio > 0.5 ? "high" : "medium",
        })
      );
  }

  if (s.langPresent) strengths.push("The page declares its language, which screen readers rely on for correct pronunciation.");
  else
    problems.push(
      issue("accessibility-lang", {
        issue: "The page doesn't declare what language it's written in.",
        whyItMatters: "Screen readers use this to choose the right pronunciation rules — without it, they may read the page incorrectly.",
        recommendedFix: "Add a lang attribute (e.g. lang=\"en\") to the page's <html> tag.",
        severity: "low",
      })
    );

  if (!s.headingHierarchyOk)
    problems.push(
      issue("accessibility-heading-order", {
        issue: "The page's heading structure is inconsistent.",
        whyItMatters: "Screen reader users often navigate by jumping between headings — a confusing order makes that much harder.",
        recommendedFix: "Use one H1 per page and step headings down in order without skipping levels.",
        severity: "medium",
      })
    );

  if (s.formInputCount > 0) {
    const labeledRatio = s.formLabeledInputCount / s.formInputCount;
    if (labeledRatio === 1) strengths.push("Every form field on the page has a proper label.");
    else
      problems.push(
        issue("accessibility-form-labels", {
          issue: "Some form fields don't have a proper label.",
          whyItMatters: "Without a label, a screen reader user can't tell what a field like an email or phone box is actually asking for.",
          recommendedFix: "Give every form field a visible <label>, or at minimum an aria-label.",
          technicalDetail: `${s.formLabeledInputCount} of ${s.formInputCount} form fields have an associated label.`,
          severity: labeledRatio < 0.5 ? "high" : "medium",
        })
      );
  }

  return {
    summary:
      "This covers the accessibility signals visible in a page's markup — color contrast and full keyboard-navigation testing need a rendered, interactive check, so they aren't scored here. " +
      (score >= 80 ? "The structural signals checked here are in good shape." : score >= 55 ? "There are real accessibility gaps worth fixing." : "Several accessibility basics are missing."),
    strengths,
    problems,
  };
}

export function narrateTrust(s: SiteSignals, score: number): CategoryNarrative {
  const strengths: string[] = [];
  const problems: AuditCategoryIssue[] = [];

  if (s.isHttps) strengths.push("The site loads over HTTPS, so browsers show it as secure rather than flagging it.");
  else
    problems.push(
      issue("trust-https", {
        issue: "This site doesn't load securely.",
        whyItMatters: "Modern browsers actively warn visitors on non-secure pages, which is a real trust cost before they've read anything.",
        recommendedFix: "Install an SSL certificate so every page loads over HTTPS.",
        severity: "critical",
      })
    );

  if (s.telLinkPresent || s.mailtoLinkPresent)
    strengths.push("Direct contact information (phone or email link) is present on the page.");
  else if (s.hasContactPageLink)
    strengths.push(
      "No direct phone or email link is on this page, but a link to a contact or booking page was found — visitors do have a way to reach out."
    );
  else
    problems.push(
      issue("trust-contact", {
        issue: "There's no clickable way to contact the business.",
        whyItMatters: "Visitors have to hunt for a way to reach out, and many won't bother.",
        recommendedFix: "Add a clickable phone number or email link somewhere visible on the page.",
        severity: "high",
      })
    );

  if (s.hasPrivacyPolicyLink) strengths.push("A privacy policy link was found, which is expected for a business collecting contact info.");
  else
    problems.push(
      issue("trust-privacy-policy", {
        issue: "No privacy policy link was found.",
        whyItMatters: "This is expected on any site with a contact or quote form, and its absence can quietly undercut trust.",
        recommendedFix: "Add a privacy policy page and link it in the footer.",
        severity: "medium",
      })
    );

  if (!s.hasTermsLink)
    problems.push(
      issue("trust-terms", {
        issue: "No terms of service link was found.",
        whyItMatters: "Especially for a business that takes bookings or payments, clear terms build confidence that expectations are documented.",
        recommendedFix: "Add a short terms of service page and link it in the footer.",
        severity: "low",
      })
    );

  if (s.hasTestimonialSignal) strengths.push("The page shows some form of social proof (reviews or testimonials).");
  else
    problems.push(
      issue("trust-testimonials", {
        issue: "No testimonials or reviews were found on the page.",
        whyItMatters: "Social proof is one of the fastest ways to build trust with a visitor who's never worked with this business before.",
        recommendedFix: "Add a few real customer testimonials or a link to reviews.",
        severity: "medium",
      })
    );

  if (s.imageCount === 0)
    problems.push(
      issue("trust-photography", {
        issue: "The page has no photos.",
        whyItMatters: "Real photos of the team, work, or location help a visitor believe this is a real, established business.",
        recommendedFix: "Add real photography — the team, completed work, or the physical location.",
        severity: "medium",
      })
    );

  return {
    summary:
      score >= 80
        ? "The trust signals a first-time visitor looks for are largely present."
        : score >= 55
          ? "Some of the trust signals a first-time visitor looks for are missing."
          : "Several of the basic trust signals a first-time visitor looks for are missing.",
    strengths,
    problems,
  };
}

export function narrateConversion(s: SiteSignals, score: number): CategoryNarrative {
  const strengths: string[] = [];
  const problems: AuditCategoryIssue[] = [];

  if (s.formCount > 0) {
    strengths.push(`${s.formCount} form${s.formCount === 1 ? "" : "s"} detected — visitors have a way to reach out without picking up the phone.`);
  } else if (s.hasEmbeddedFormWidget) {
    strengths.push("A third-party form or scheduling widget is embedded on the page — visitors have a way to reach out without picking up the phone.");
  } else {
    // Evidence-based: this is a single-page scan, so it can only speak to
    // *this* page, and it must not claim the business is unreachable when a
    // contact/quote/booking link or a tel:/mailto: link says otherwise.
    const hasAlternatePath = s.hasContactPageLink || s.telLinkPresent || s.mailtoLinkPresent;
    problems.push(
      issue("conversion-form", {
        issue: "No inline contact or quote form was detected on this page.",
        whyItMatters: hasAlternatePath
          ? "Visitors who'd rather fill out a quick form than call or click through to another page currently have to leave this page to do that — a real, if smaller, drop-off point."
          : "Visitors who don't want to call — often the majority — currently have no other way to reach out from this page.",
        recommendedFix: "Consider adding a short contact or quote form so ready-to-buy visitors can convert without leaving the page.",
        technicalDetail: `No <form>, submit control, or recognized form/scheduling embed was found in this page's HTML.${hasAlternatePath ? " A link to a contact/booking page or a tel:/mailto: link was found elsewhere on the page." : ""}`,
        severity: hasAlternatePath ? "medium" : "high",
      })
    );
  }

  if (s.telLinkPresent) strengths.push("A click-to-call phone link is present, which matters most on mobile.");
  else
    problems.push(
      issue("conversion-tel-link", {
        issue: "There's no tap-to-call phone link.",
        whyItMatters: "On mobile, a tappable number converts far better than plain text a visitor has to copy and dial.",
        recommendedFix: "Make the phone number a tel: link, ideally visible without scrolling.",
        severity: "high",
      })
    );

  if (s.hasCallToActionSignal) strengths.push("The page contains clear call-to-action language (e.g. \"get a quote,\" \"call now\").");
  else
    problems.push(
      issue("conversion-cta-copy", {
        issue: "There's no clear call-to-action on the page.",
        whyItMatters: "A visitor who's ready to act should see exactly what to do next within a few seconds of landing.",
        recommendedFix: "Add a clear action phrase near the top of the page, like \"Get a Free Quote\" or \"Call Now.\"",
        severity: "high",
      })
    );

  return {
    summary:
      score >= 80
        ? "The basic conversion paths a ready-to-buy visitor needs are in place."
        : score >= 55
          ? "There are real gaps in how easily a ready-to-buy visitor can convert."
          : "A visitor who's ready to buy right now has a harder path to actually contacting this business than they should.",
    strengths,
    problems,
  };
}

export const CATEGORY_NARRATORS: Record<AuditCategoryKey, (s: SiteSignals, score: number) => CategoryNarrative> = {
  technicalHealth: narrateTechnicalHealth,
  performance: narratePerformance,
  mobile: narrateMobile,
  seo: narrateSeo,
  localSeo: narrateLocalSeo,
  accessibility: narrateAccessibility,
  trust: narrateTrust,
  conversion: narrateConversion,
};
