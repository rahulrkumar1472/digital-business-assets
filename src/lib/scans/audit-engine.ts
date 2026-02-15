import { mapRecommendedModules } from "@/lib/scans/module-map";
import type {
  AuditCategory,
  AuditCheck,
  AuditResult,
  AuditScores,
  CompetitorResult,
  RAG,
  VisibilitySignals,
} from "@/lib/scans/audit-types";

type AuditInput = {
  url: string;
  businessName?: string;
  industry?: string;
  goal?: string;
  competitors?: string[];
};

type BuildOptions = {
  skipCompetitors?: boolean;
  includePsi?: boolean;
};

type RawSignal = {
  normalizedUrl: string;
  fetchUrl: string;
  isHttpsInput: boolean;
  titleText: string;
  titleLength: number;
  h1Text: string;
  h1Count: number;
  metaDescriptionLength: number;
  hasMetaDescription: boolean;
  hasCanonical: boolean;
  hasRobotsMeta: boolean;
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  jsonLdCount: number;
  internalLinkCount: number;
  externalLinkCount: number;
  scriptCount: number;
  imageCount: number;
  lazyImageCount: number;
  hasViewportMeta: boolean;
  hasFavicon: boolean;
  hasEmailContact: boolean;
  hasPhoneContact: boolean;
  hasAddressSignal: boolean;
  hasReviewKeywords: boolean;
  hasPolicyLinks: boolean;
  hasPrimaryCta: boolean;
  hasForm: boolean;
  hasBookingHint: boolean;
  hasTelLink: boolean;
  socialLinks: VisibilitySignals["socialLinks"];
  hasGoogleBusinessHint: boolean;
  hasAuthorityBaseline: boolean;
  domEstimate: number;
  htmlBytes: number;
  fetchSucceeded: boolean;
  fetchError?: string;
};

type PsiMetrics = {
  performanceScore: number;
  lcpMs?: number;
  cls?: number;
  inpMs?: number;
};

const DEFAULT_URL = "https://example.co.uk";
const CATEGORY_ORDER: AuditCategory[] = ["Speed", "SEO", "Conversion", "Trust", "Visibility"];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toRag(score: number): RAG {
  if (score >= 80) {
    return "green";
  }
  if (score >= 50) {
    return "amber";
  }
  return "red";
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_URL;
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return DEFAULT_URL;
  }
}

function toHttpsFetchUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.protocol = "https:";
    return parsed.toString();
  } catch {
    return DEFAULT_URL;
  }
}

function textOrEmpty(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  if (!match?.[1]) {
    return "";
  }
  return match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function contentMeta(html: string, key: string, attr: "name" | "property") {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const r1 = new RegExp(`<meta[^>]*${attr}=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i");
  const r2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${escaped}["'][^>]*>`, "i");
  return textOrEmpty(html, r1) || textOrEmpty(html, r2);
}

function extractHrefValues(html: string) {
  const hrefRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const hrefs: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = hrefRegex.exec(html))) {
    if (match[1]) {
      hrefs.push(match[1]);
    }
  }
  return hrefs;
}

function countRegex(html: string, regex: RegExp) {
  return (html.match(regex) || []).length;
}

function parseHtmlSignals(normalizedUrl: string, fetchUrl: string, html: string, isHttpsInput: boolean): RawSignal {
  const source = html.slice(0, 420_000);
  const titleText = textOrEmpty(source, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1Text = textOrEmpty(source, /<h1[^>]*>([\s\S]*?)<\/h1>/i);

  const metaDescription = contentMeta(source, "description", "name");
  const hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*>/i.test(source);
  const hasRobotsMeta = /<meta[^>]*name=["']robots["'][^>]*>/i.test(source);
  const hasOgTitle = Boolean(contentMeta(source, "og:title", "property"));
  const hasOgDescription = Boolean(contentMeta(source, "og:description", "property"));
  const jsonLdCount = countRegex(source, /<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi);

  const hrefs = extractHrefValues(source);
  const urlObject = new URL(fetchUrl);
  const host = urlObject.hostname;
  let internalLinkCount = 0;
  let externalLinkCount = 0;

  for (const href of hrefs) {
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      continue;
    }

    if (href.startsWith("/")) {
      internalLinkCount += 1;
      continue;
    }

    try {
      const parsed = new URL(href, fetchUrl);
      if (parsed.hostname === host) {
        internalLinkCount += 1;
      } else {
        externalLinkCount += 1;
      }
    } catch {
      continue;
    }
  }

  const scriptCount = countRegex(source, /<script\b/gi);
  const imageCount = countRegex(source, /<img\b/gi);
  const lazyImageCount = countRegex(source, /<img[^>]*loading=["']lazy["'][^>]*>/gi);
  const h1Count = countRegex(source, /<h1\b/gi);
  const hasViewportMeta = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(source);
  const hasFavicon = /<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*>/i.test(source);

  const hasEmailContact = /href=["']mailto:|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(source);
  const hasPhoneContact = /href=["']tel:|(?:\+?\d[\d\s().-]{8,}\d)/i.test(source);
  const hasAddressSignal = /<address[\s>]|\b(?:street|st\.|road|rd\.|avenue|ave\.|postcode)\b/i.test(source);
  const hasReviewKeywords = /\b(review|reviews|testimonial|rated|star rating|case study)\b/i.test(source);
  const hasPolicyLinks = /\bprivacy\b|\bterms\b|\bcookie\b|refund|returns|cancellation/i.test(source);

  const firstChunk = source.slice(0, 2200).toLowerCase();
  const hasPrimaryCta = /(book now|get quote|get started|start free|talk to us|request demo|buy now|call now)/.test(firstChunk);
  const hasForm = /<form\b/i.test(source);
  const hasBookingHint = /\b(book now|appointment|schedule|reserve|calendar)\b/i.test(source);
  const hasTelLink = /href=["']tel:/i.test(source);

  const socialLinks = {
    facebook: /facebook\.com/i.test(source),
    instagram: /instagram\.com/i.test(source),
    linkedin: /linkedin\.com/i.test(source),
    tiktok: /tiktok\.com/i.test(source),
    youtube: /youtube\.com|youtu\.be/i.test(source),
  };

  const hasGoogleBusinessHint = /google\.com\/maps|g\.page|google business profile|google my business/i.test(source);
  const hasAuthorityBaseline = externalLinkCount >= 3 || jsonLdCount > 0 || hasReviewKeywords;
  const domEstimate = countRegex(source, /<[a-z][^>]*>/gi);

  return {
    normalizedUrl,
    fetchUrl,
    isHttpsInput,
    titleText,
    titleLength: titleText.length,
    h1Text,
    h1Count,
    metaDescriptionLength: metaDescription.length,
    hasMetaDescription: metaDescription.length > 0,
    hasCanonical,
    hasRobotsMeta,
    hasOgTitle,
    hasOgDescription,
    jsonLdCount,
    internalLinkCount,
    externalLinkCount,
    scriptCount,
    imageCount,
    lazyImageCount,
    hasViewportMeta,
    hasFavicon,
    hasEmailContact,
    hasPhoneContact,
    hasAddressSignal,
    hasReviewKeywords,
    hasPolicyLinks,
    hasPrimaryCta,
    hasForm,
    hasBookingHint,
    hasTelLink,
    socialLinks,
    hasGoogleBusinessHint,
    hasAuthorityBaseline,
    domEstimate,
    htmlBytes: source.length,
    fetchSucceeded: true,
  };
}

function emptySignal(normalizedUrl: string, isHttpsInput: boolean): RawSignal {
  return {
    normalizedUrl,
    fetchUrl: toHttpsFetchUrl(normalizedUrl),
    isHttpsInput,
    titleText: "",
    titleLength: 0,
    h1Text: "",
    h1Count: 0,
    metaDescriptionLength: 0,
    hasMetaDescription: false,
    hasCanonical: false,
    hasRobotsMeta: false,
    hasOgTitle: false,
    hasOgDescription: false,
    jsonLdCount: 0,
    internalLinkCount: 0,
    externalLinkCount: 0,
    scriptCount: 0,
    imageCount: 0,
    lazyImageCount: 0,
    hasViewportMeta: false,
    hasFavicon: false,
    hasEmailContact: false,
    hasPhoneContact: false,
    hasAddressSignal: false,
    hasReviewKeywords: false,
    hasPolicyLinks: false,
    hasPrimaryCta: false,
    hasForm: false,
    hasBookingHint: false,
    hasTelLink: false,
    socialLinks: {
      facebook: false,
      instagram: false,
      linkedin: false,
      tiktok: false,
      youtube: false,
    },
    hasGoogleBusinessHint: false,
    hasAuthorityBaseline: false,
    domEstimate: 0,
    htmlBytes: 0,
    fetchSucceeded: false,
  };
}

async function fetchSignal(url: string): Promise<RawSignal> {
  const normalizedUrl = normalizeUrl(url);
  const parsed = new URL(normalizedUrl);
  const isHttpsInput = parsed.protocol === "https:";
  const fetchUrl = toHttpsFetchUrl(normalizedUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "user-agent": "DigitalBusinessAssetsAuditBot/2.0 (+https://digitalbusinessassets.co.uk)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      const fallback = emptySignal(normalizedUrl, isHttpsInput);
      fallback.fetchError = `HTTP ${response.status}`;
      return fallback;
    }

    const html = await response.text();
    return parseHtmlSignals(normalizedUrl, fetchUrl, html, isHttpsInput);
  } catch (error) {
    const fallback = emptySignal(normalizedUrl, isHttpsInput);
    fallback.fetchError = error instanceof Error ? error.message : "request failed";
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

function buildSpeedHeuristic(signal: RawSignal) {
  let score = 86;

  score -= Math.max(0, signal.scriptCount - 10) * 1.8;
  score -= Math.max(0, signal.imageCount - 24) * 0.65;
  score -= Math.max(0, signal.domEstimate - 900) / 28;

  if (signal.htmlBytes > 250_000) {
    score -= 5;
  }
  if (signal.htmlBytes > 420_000) {
    score -= 6;
  }

  const lazyRatio = signal.imageCount > 0 ? signal.lazyImageCount / signal.imageCount : 0;
  if (signal.imageCount >= 18 && lazyRatio < 0.35) {
    score -= 8;
  } else if (signal.imageCount > 0 && lazyRatio >= 0.35) {
    score += 3;
  }

  if (signal.hasViewportMeta) {
    score += 2;
  } else {
    score -= 10;
  }

  if (!signal.fetchSucceeded) {
    score -= 22;
  }

  const estimatedLoadComplexity = clamp(
    Math.round(signal.scriptCount * 1.9 + signal.imageCount * 0.8 + signal.domEstimate / 140),
    12,
    100,
  );

  return {
    score: clamp(Math.round(score), 15, 98),
    estimatedLoadComplexity,
  };
}

async function fetchPageSpeedMetrics(url: string): Promise<PsiMetrics | null> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) {
    return null;
  }

  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&url=${encodeURIComponent(
    url,
  )}&key=${encodeURIComponent(key)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5200);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "user-agent": "DigitalBusinessAssetsAuditBot/2.0 (+https://digitalbusinessassets.co.uk)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as {
      lighthouseResult?: {
        categories?: { performance?: { score?: number } };
        audits?: Record<string, { numericValue?: number }>;
      };
    };

    const performance = json.lighthouseResult?.categories?.performance?.score;
    if (typeof performance !== "number") {
      return null;
    }

    const audits = json.lighthouseResult?.audits || {};
    const lcpMs = audits["largest-contentful-paint"]?.numericValue;
    const cls = audits["cumulative-layout-shift"]?.numericValue;
    const inpMs = audits["interaction-to-next-paint"]?.numericValue;

    return {
      performanceScore: clamp(Math.round(performance * 100), 0, 100),
      lcpMs: typeof lcpMs === "number" ? Math.round(lcpMs) : undefined,
      cls: typeof cls === "number" ? Number(cls.toFixed(3)) : undefined,
      inpMs: typeof inpMs === "number" ? Math.round(inpMs) : undefined,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function impactWeight(impact: AuditCheck["impact"]) {
  if (impact === "High") return 3;
  if (impact === "Med") return 2;
  return 1;
}

function statusWeight(status: RAG) {
  if (status === "red") return 3;
  if (status === "amber") return 2;
  return 1;
}

function check(
  id: string,
  category: AuditCategory,
  label: string,
  status: RAG,
  scoreDelta: number,
  evidence: string,
  fix: string,
  effort: AuditCheck["effort"],
  impact: AuditCheck["impact"],
): AuditCheck {
  return {
    id,
    category,
    label,
    status,
    scoreDelta: status === "green" ? 0 : scoreDelta,
    evidence,
    fix,
    effort,
    impact,
  };
}

function buildChecks(signal: RawSignal, speedScore: number, psi: PsiMetrics | null, industry: string, goal: string) {
  const checks: AuditCheck[] = [];
  const industryLower = industry.toLowerCase();
  const goalLower = goal.toLowerCase();
  const localLike = /(local|service|trade|clinic|medical|dent|estate|beauty|legal)/.test(industryLower);
  const salesLike = /(sales|checkout|order|revenue|pricing)/.test(goalLower);

  checks.push(
    check(
      "https",
      "Trust",
      "HTTPS security",
      signal.isHttpsInput ? "green" : "red",
      18,
      signal.isHttpsInput ? "Site URL is HTTPS." : "Input URL was not HTTPS.",
      "Use HTTPS as your primary canonical URL and redirect all HTTP traffic.",
      "S",
      "High",
    ),
  );

  checks.push(
    check(
      "speed-score",
      "Speed",
      "Page speed baseline",
      speedScore >= 80 ? "green" : speedScore >= 55 ? "amber" : "red",
      speedScore >= 55 ? 10 : 20,
      psi
        ? `PSI mobile performance ${psi.performanceScore}/100${psi.lcpMs ? `, LCP ${psi.lcpMs}ms` : ""}.`
        : `Heuristic score ${speedScore}/100 from scripts, media, and DOM complexity.`,
      "Reduce script weight, compress images, and simplify critical page structure above the fold.",
      "M",
      "High",
    ),
  );

  checks.push(
    check(
      "script-weight",
      "Speed",
      "Script payload pressure",
      signal.scriptCount <= 20 ? "green" : signal.scriptCount <= 35 ? "amber" : "red",
      signal.scriptCount <= 35 ? 8 : 14,
      `${signal.scriptCount} script tags detected.`,
      "Trim non-essential third-party scripts and defer non-critical JS.",
      "M",
      "High",
    ),
  );

  checks.push(
    check(
      "image-weight",
      "Speed",
      "Media load pressure",
      signal.imageCount <= 40 ? "green" : signal.imageCount <= 75 ? "amber" : "red",
      signal.imageCount <= 75 ? 6 : 12,
      `${signal.imageCount} images detected, ${signal.lazyImageCount} using lazy loading.`,
      "Convert heavy images to optimized formats and lazy-load non-critical media.",
      "M",
      "Med",
    ),
  );

  checks.push(
    check(
      "viewport",
      "Speed",
      "Mobile viewport setup",
      signal.hasViewportMeta ? "green" : "red",
      10,
      signal.hasViewportMeta ? "Viewport meta is present." : "Viewport meta tag not detected.",
      "Add a responsive viewport meta tag for mobile rendering.",
      "S",
      "Med",
    ),
  );

  if (psi?.lcpMs) {
    checks.push(
      check(
        "lcp",
        "Speed",
        "Largest Contentful Paint",
        psi.lcpMs <= 2500 ? "green" : psi.lcpMs <= 4000 ? "amber" : "red",
        psi.lcpMs <= 4000 ? 5 : 10,
        `LCP ${psi.lcpMs}ms (mobile).`,
        "Improve server response, prioritize hero media, and reduce render-blocking assets.",
        "M",
        "High",
      ),
    );
  }

  if (typeof psi?.cls === "number") {
    checks.push(
      check(
        "cls",
        "Speed",
        "Layout stability (CLS)",
        psi.cls <= 0.1 ? "green" : psi.cls <= 0.25 ? "amber" : "red",
        psi.cls <= 0.25 ? 4 : 8,
        `CLS ${psi.cls}.`,
        "Reserve media dimensions and stabilize dynamic content insertion.",
        "S",
        "Med",
      ),
    );
  }

  if (psi?.inpMs) {
    checks.push(
      check(
        "inp",
        "Speed",
        "Interaction latency (INP)",
        psi.inpMs <= 200 ? "green" : psi.inpMs <= 500 ? "amber" : "red",
        psi.inpMs <= 500 ? 4 : 8,
        `INP ${psi.inpMs}ms.`,
        "Reduce long JavaScript tasks and simplify interaction handlers.",
        "M",
        "Med",
      ),
    );
  }

  checks.push(
    check(
      "title-length",
      "SEO",
      "Title tag quality",
      signal.titleLength >= 30 && signal.titleLength <= 60 ? "green" : signal.titleLength > 0 ? "amber" : "red",
      signal.titleLength > 0 ? 6 : 12,
      signal.titleLength ? `${signal.titleLength} characters.` : "No title text detected.",
      "Write a focused title between 30-60 characters with your core commercial intent.",
      "S",
      "High",
    ),
  );

  checks.push(
    check(
      "meta-description",
      "SEO",
      "Meta description coverage",
      signal.metaDescriptionLength >= 120 && signal.metaDescriptionLength <= 170
        ? "green"
        : signal.metaDescriptionLength > 0
          ? "amber"
          : "red",
      signal.metaDescriptionLength > 0 ? 6 : 12,
      signal.metaDescriptionLength ? `${signal.metaDescriptionLength} characters.` : "No meta description detected.",
      "Add a 140-160 character value-focused description with a clear action cue.",
      "S",
      "High",
    ),
  );

  checks.push(
    check(
      "canonical",
      "SEO",
      "Canonical tag",
      signal.hasCanonical ? "green" : "red",
      10,
      signal.hasCanonical ? "Canonical found." : "Canonical missing.",
      "Set canonical URLs on indexable pages to avoid duplicate indexing signals.",
      "S",
      "Med",
    ),
  );

  checks.push(
    check(
      "h1",
      "SEO",
      "H1 structure",
      signal.h1Count === 1 ? "green" : signal.h1Count > 1 ? "amber" : "red",
      signal.h1Count > 1 ? 5 : 10,
      signal.h1Count === 1 ? "Single H1 detected." : `${signal.h1Count} H1 tags detected.`,
      "Keep exactly one clear H1 aligned with the main buyer intent for the page.",
      "S",
      "Med",
    ),
  );

  checks.push(
    check(
      "json-ld",
      "SEO",
      "Structured data coverage",
      signal.jsonLdCount >= 1 ? "green" : "amber",
      6,
      signal.jsonLdCount ? `${signal.jsonLdCount} JSON-LD scripts found.` : "No JSON-LD scripts found.",
      "Add Organization/Service/FAQ schema where relevant to improve machine readability.",
      "M",
      "Med",
    ),
  );

  checks.push(
    check(
      "internal-links",
      "SEO",
      "Internal linking depth",
      signal.internalLinkCount >= 10 ? "green" : signal.internalLinkCount >= 5 ? "amber" : "red",
      signal.internalLinkCount >= 5 ? 5 : 10,
      `${signal.internalLinkCount} internal links detected.`,
      "Add contextual internal links from service, industry, and proof pages to money pages.",
      "M",
      "Med",
    ),
  );

  checks.push(
    check(
      "robots",
      "SEO",
      "Robots directives",
      signal.hasRobotsMeta ? "green" : "amber",
      4,
      signal.hasRobotsMeta ? "Robots meta present." : "No robots meta detected.",
      "Set clear robots directives on key landing pages.",
      "S",
      "Low",
    ),
  );

  checks.push(
    check(
      "cta-above-fold",
      "Conversion",
      "Primary call-to-action clarity",
      signal.hasPrimaryCta ? "green" : "red",
      14,
      signal.hasPrimaryCta ? "CTA language appears above the fold." : "No clear primary CTA found in early page content.",
      "Lead the first screen with one action-focused CTA tied to your offer.",
      "S",
      "High",
    ),
  );

  checks.push(
    check(
      "lead-capture",
      "Conversion",
      "Lead capture path",
      signal.hasForm || signal.hasBookingHint || signal.hasTelLink ? "green" : "red",
      14,
      signal.hasForm || signal.hasBookingHint || signal.hasTelLink
        ? "At least one direct capture path found (form, booking, or click-to-call)."
        : "No direct lead capture mechanism detected.",
      "Add a visible form, booking action, or one-tap call path on key pages.",
      "S",
      "High",
    ),
  );

  checks.push(
    check(
      "booking-signal",
      "Conversion",
      "Booking intent signal",
      signal.hasBookingHint ? "green" : salesLike ? "red" : "amber",
      salesLike ? 10 : 6,
      signal.hasBookingHint ? "Booking/appointment cues detected." : "No booking intent wording detected.",
      "Add booking language and urgency framing near service and pricing sections.",
      "S",
      salesLike ? "High" : "Med",
    ),
  );

  checks.push(
    check(
      "click-to-call",
      "Conversion",
      "Click-to-call on mobile",
      signal.hasTelLink ? "green" : localLike ? "red" : "amber",
      localLike ? 10 : 5,
      signal.hasTelLink ? "Telephone action link found." : "No click-to-call link detected.",
      "Add click-to-call and WhatsApp shortcuts for high-intent users.",
      "S",
      localLike ? "High" : "Med",
    ),
  );

  const trustSignalCount = [signal.hasEmailContact, signal.hasPhoneContact, signal.hasAddressSignal].filter(Boolean).length;
  checks.push(
    check(
      "contact-trust",
      "Trust",
      "Business contact trust signals",
      trustSignalCount >= 2 ? "green" : trustSignalCount === 1 ? "amber" : "red",
      trustSignalCount === 1 ? 8 : 14,
      `Detected signals: email ${signal.hasEmailContact ? "yes" : "no"}, phone ${signal.hasPhoneContact ? "yes" : "no"}, address ${signal.hasAddressSignal ? "yes" : "no"}.`,
      "Expose phone, email, and location trust markers near conversion CTAs.",
      "S",
      "High",
    ),
  );

  checks.push(
    check(
      "proof",
      "Trust",
      "Review and proof content",
      signal.hasReviewKeywords ? "green" : "amber",
      6,
      signal.hasReviewKeywords ? "Review/testimonial cues detected." : "No clear review/testimonial cues detected.",
      "Add recent reviews and result-based proof blocks near buying decisions.",
      "S",
      "Med",
    ),
  );

  checks.push(
    check(
      "policies",
      "Trust",
      "Policy and legal reassurance",
      signal.hasPolicyLinks ? "green" : "amber",
      4,
      signal.hasPolicyLinks ? "Policy/legal links detected." : "Policy/legal links not obvious in source HTML.",
      "Add privacy/terms and service policy links in footer and key forms.",
      "S",
      "Low",
    ),
  );

  checks.push(
    check(
      "favicon",
      "Trust",
      "Brand identity cues",
      signal.hasFavicon ? "green" : "amber",
      3,
      signal.hasFavicon ? "Favicon link present." : "No favicon detected.",
      "Set a favicon and consistent brand marks for trust continuity.",
      "S",
      "Low",
    ),
  );

  checks.push(
    check(
      "og",
      "Visibility",
      "Social preview metadata",
      signal.hasOgTitle && signal.hasOgDescription ? "green" : signal.hasOgTitle || signal.hasOgDescription ? "amber" : "red",
      signal.hasOgTitle || signal.hasOgDescription ? 6 : 12,
      signal.hasOgTitle && signal.hasOgDescription
        ? "og:title + og:description detected."
        : signal.hasOgTitle || signal.hasOgDescription
          ? "Only one Open Graph field detected."
          : "No Open Graph essentials detected.",
      "Set OG title and description for better share click-through and social relevance.",
      "S",
      "Med",
    ),
  );

  const socialCount = Object.values(signal.socialLinks).filter(Boolean).length;
  checks.push(
    check(
      "social-presence",
      "Visibility",
      "Social footprint",
      socialCount >= 2 ? "green" : socialCount === 1 ? "amber" : "red",
      socialCount === 1 ? 6 : 10,
      `${socialCount} social profile links detected.`,
      "Link active social profiles to reinforce trust and discovery signals.",
      "S",
      "Med",
    ),
  );

  checks.push(
    check(
      "google-business",
      "Visibility",
      "Google Business visibility signal",
      signal.hasGoogleBusinessHint ? "green" : localLike ? "amber" : "green",
      localLike ? 6 : 0,
      signal.hasGoogleBusinessHint ? "Google Maps/Business hint detected." : "No Google Business hint detected in page source.",
      "Connect and reference your Google Business Profile on local-facing pages.",
      "S",
      localLike ? "Med" : "Low",
    ),
  );

  checks.push(
    check(
      "authority-baseline",
      "Visibility",
      "Authority baseline signals",
      signal.hasAuthorityBaseline ? "green" : "amber",
      5,
      signal.hasAuthorityBaseline
        ? `Baseline signals found (external links ${signal.externalLinkCount}, schema ${signal.jsonLdCount}).`
        : "No clear authority baseline signals detected.",
      "Add citations, partnership mentions, and structured organization signals to strengthen authority baseline.",
      "M",
      "Med",
    ),
  );

  if (!signal.fetchSucceeded) {
    checks.push(
      check(
        "fetch-access",
        "Visibility",
        "Live fetch accessibility",
        "amber",
        8,
        signal.fetchError ? `Live fetch issue: ${signal.fetchError}.` : "Could not fetch page HTML.",
        "Ensure the homepage is publicly reachable over HTTPS and re-run the scan.",
        "S",
        "High",
      ),
    );
  }

  return checks;
}

function computeScores(checks: AuditCheck[]): AuditScores {
  const categoryScore: Record<AuditCategory, number> = {
    Speed: 100,
    SEO: 100,
    Conversion: 100,
    Trust: 100,
    Visibility: 100,
  };

  for (const check of checks) {
    if (check.status === "green") {
      continue;
    }
    categoryScore[check.category] -= check.scoreDelta;
  }

  for (const category of CATEGORY_ORDER) {
    categoryScore[category] = clamp(Math.round(categoryScore[category]), 0, 100);
  }

  const overall = clamp(
    Math.round(
      categoryScore.Speed * 0.2 +
        categoryScore.SEO * 0.25 +
        categoryScore.Conversion * 0.25 +
        categoryScore.Trust * 0.15 +
        categoryScore.Visibility * 0.15,
    ),
    0,
    100,
  );

  return {
    overall,
    speed: categoryScore.Speed,
    seo: categoryScore.SEO,
    conversion: categoryScore.Conversion,
    trust: categoryScore.Trust,
    visibility: categoryScore.Visibility,
  };
}

function buildNarrative(result: {
  scores: AuditScores;
  topFindings: AuditCheck[];
  industry?: string;
  goal?: string;
}) {
  const weakest = [
    { key: "speed", value: result.scores.speed, label: "Speed" },
    { key: "seo", value: result.scores.seo, label: "Search visibility" },
    { key: "conversion", value: result.scores.conversion, label: "Conversion path" },
    { key: "trust", value: result.scores.trust, label: "Trust layer" },
    { key: "visibility", value: result.scores.visibility, label: "Visibility signals" },
  ].sort((a, b) => a.value - b.value);

  const critical = result.topFindings.filter((finding) => finding.status === "red").length;
  const summaryTone = result.scores.overall >= 80 ? "strong" : result.scores.overall >= 55 ? "recoverable" : "urgent";

  const executiveSummary =
    summaryTone === "strong"
      ? `Your website baseline is solid (${result.scores.overall}/100), but there are still revenue gains available in ${weakest
          .slice(0, 2)
          .map((item) => item.label)
          .join(" and ")}.`
      : summaryTone === "recoverable"
        ? `Your website is currently leaking opportunities (${result.scores.overall}/100). The biggest drag is ${weakest[0]?.label.toLowerCase()}, followed by ${weakest[1]?.label.toLowerCase()}.`
        : `Your website has critical commercial gaps (${result.scores.overall}/100) that are likely suppressing leads and sales. Priority weaknesses are ${weakest
            .slice(0, 2)
            .map((item) => item.label.toLowerCase())
            .join(" and ")}.`;

  const whyItMatters =
    critical > 0
      ? `You currently have ${critical} high-severity issues. When response speed, trust, or conversion cues are weak, buyers leave quickly and competitors capture demand first.`
      : "The current gaps are mostly medium severity, but they still compound into lower lead quality, higher acquisition costs, and slower sales cycles.";

  const nextSteps = result.topFindings
    .slice(0, 6)
    .map((finding) => `${finding.label}: ${finding.fix || "Apply fix guidance."}`)
    .filter(Boolean);

  return {
    executiveSummary,
    whyItMatters,
    nextSteps,
  };
}

function sortFindings(checks: AuditCheck[]) {
  return [...checks].sort((a, b) => {
    const statusDiff = statusWeight(b.status) - statusWeight(a.status);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    const impactDiff = impactWeight(b.impact) - impactWeight(a.impact);
    if (impactDiff !== 0) {
      return impactDiff;
    }

    return b.scoreDelta - a.scoreDelta;
  });
}

function scoreDiffLabel(category: AuditCategory, competitor: number, mine: number) {
  return `${category}: ${competitor} vs your ${mine}`;
}

function buildCompetitorComparison(domain: string, competitorScores: AuditScores, myScores: AuditScores): CompetitorResult {
  const categories: Array<{ category: AuditCategory; competitor: number; mine: number }> = [
    { category: "Speed", competitor: competitorScores.speed, mine: myScores.speed },
    { category: "SEO", competitor: competitorScores.seo, mine: myScores.seo },
    { category: "Conversion", competitor: competitorScores.conversion, mine: myScores.conversion },
    { category: "Trust", competitor: competitorScores.trust, mine: myScores.trust },
    { category: "Visibility", competitor: competitorScores.visibility, mine: myScores.visibility },
  ];

  const topWins = categories
    .filter((item) => item.competitor - item.mine >= 10)
    .sort((a, b) => b.competitor - b.mine - (a.competitor - a.mine))
    .slice(0, 3)
    .map((item) => scoreDiffLabel(item.category, item.competitor, item.mine));

  const topGaps = categories
    .filter((item) => item.mine - item.competitor >= 10)
    .sort((a, b) => b.mine - b.competitor - (a.mine - a.competitor))
    .slice(0, 3)
    .map((item) => scoreDiffLabel(item.category, item.mine, item.competitor));

  return {
    domain,
    scores: competitorScores,
    topWins,
    topGaps,
  };
}

export function normalizeCompetitorDomain(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    return parsed.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

export function parseCompetitorList(value?: string) {
  if (!value) {
    return [] as string[];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => normalizeCompetitorDomain(item))
        .filter(Boolean),
    ),
  ).slice(0, 3);
}

async function buildAudit(input: AuditInput, options: BuildOptions = {}): Promise<AuditResult> {
  const normalizedUrl = normalizeUrl(input.url);
  const signal = await fetchSignal(normalizedUrl);
  const heuristic = buildSpeedHeuristic(signal);
  const psi = options.includePsi === false ? null : await fetchPageSpeedMetrics(signal.fetchUrl);
  const speedScore = psi
    ? clamp(Math.round(heuristic.score * 0.4 + psi.performanceScore * 0.6), 0, 100)
    : heuristic.score;

  const checks = buildChecks(signal, speedScore, psi, input.industry || "", input.goal || "");
  const scores = computeScores(checks);
  const sortedFindings = sortFindings(checks);
  const topFindings = sortedFindings.slice(0, 10);

  const leakTypes = topFindings
    .filter((check) => check.status !== "green")
    .slice(0, 4)
    .map((check) => check.category.toLowerCase());

  const recommendedModules = mapRecommendedModules({
    speedScore: scores.speed,
    seoScore: scores.seo,
    conversionScore: scores.conversion,
    trustScore: scores.trust,
    leakTypes,
    industry: input.industry,
    goal: input.goal,
  });

  const narrative = buildNarrative({
    scores,
    topFindings,
    industry: input.industry,
    goal: input.goal,
  });

  let competitors: CompetitorResult[] | undefined;
  if (!options.skipCompetitors && input.competitors?.length) {
    const competitorAudits = await Promise.all(
      input.competitors.slice(0, 3).map(async (domain) => {
        const competitorUrl = `https://${normalizeCompetitorDomain(domain)}`;
        if (!normalizeCompetitorDomain(domain)) {
          return null;
        }
        const competitorAudit = await buildAudit(
          {
            url: competitorUrl,
            industry: input.industry,
            goal: input.goal,
          },
          { skipCompetitors: true, includePsi: false },
        );
        return buildCompetitorComparison(normalizeCompetitorDomain(domain), competitorAudit.scores, scores);
      }),
    );
    competitors = competitorAudits.filter((item): item is CompetitorResult => Boolean(item));
  }

  const visibilitySignals: VisibilitySignals = {
    socialLinks: signal.socialLinks,
    hasGoogleBusinessHint: signal.hasGoogleBusinessHint,
    hasOgTitle: signal.hasOgTitle,
    hasOgDescription: signal.hasOgDescription,
  };

  return {
    url: normalizedUrl,
    businessName: input.businessName,
    industry: input.industry,
    goal: input.goal,
    generatedAt: new Date().toISOString(),
    scores,
    categories: [
      { category: "Speed", score: scores.speed, rag: toRag(scores.speed) },
      { category: "SEO", score: scores.seo, rag: toRag(scores.seo) },
      { category: "Conversion", score: scores.conversion, rag: toRag(scores.conversion) },
      { category: "Trust", score: scores.trust, rag: toRag(scores.trust) },
      { category: "Visibility", score: scores.visibility, rag: toRag(scores.visibility) },
    ],
    checks,
    topFindings,
    narrative,
    pageExperience: {
      source: psi ? "hybrid" : "heuristic",
      scriptCount: signal.scriptCount,
      imageCount: signal.imageCount,
      domEstimate: signal.domEstimate,
      estimatedLoadComplexity: heuristic.estimatedLoadComplexity,
      lcpMs: psi?.lcpMs,
      cls: psi?.cls,
      inpMs: psi?.inpMs,
      psiPerformance: psi?.performanceScore,
    },
    visibilitySignals,
    competitors,
    recommendedModules: recommendedModules.map((module) => ({
      id: module.id,
      title: module.title,
      why: module.why,
      action: module.action,
      href: module.href,
      phase: module.phase,
      priceLabel: module.priceLabel,
    })),
  };
}

export async function runWebsiteGrowthAudit(input: AuditInput) {
  return buildAudit(input);
}

export function ragFromScore(score: number): RAG {
  return toRag(score);
}
