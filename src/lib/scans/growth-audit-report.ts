import { mapRecommendedModules, type ModuleRecommendation } from "@/lib/scans/module-map";

export type GrowthAuditInput = {
  url: string;
  industry?: string;
  goal?: string;
};

export type AuditCategory = "speed" | "seo" | "conversion" | "trust";

export type RevenueLeak = {
  category: AuditCategory;
  title: string;
  what: string;
  why: string;
  fix: string;
  estimatedImpact: string;
};

export type LiveAuditSignal = {
  source: "live";
  titleLength: number | null;
  hasMetaDescription: boolean;
  hasH1: boolean;
  hasDirectContact: boolean;
  summary: string;
};

export type GrowthAuditReport = {
  normalizedUrl: string;
  score: number;
  speedScore: number;
  seoScore: number;
  conversionScore: number;
  trustScore: number;
  topLeaks: RevenueLeak[];
  quickWins: string[];
  mediumWins: string[];
  recommendedModules: ModuleRecommendation[];
  liveSignal: LiveAuditSignal | null;
};

type AuditContext = {
  isEcom: boolean;
  isLocalOrService: boolean;
  focusesLeads: boolean;
  focusesSales: boolean;
};

function scoreFromSeed(seed: string) {
  let hash = 17;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100000;
  }
  return hash;
}

function clampScore(value: number) {
  return Math.max(18, Math.min(96, Math.round(value)));
}

function noise(seed: number, shift: number) {
  return ((seed + shift) % 7) - 3;
}

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "https://example.co.uk";
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "https://example.co.uk";
  }
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function resolveContext(lowerIndustry: string, lowerGoal: string): AuditContext {
  return {
    isEcom: /(ecom|e-commerce|retail|shop|store|d2c)/.test(lowerIndustry),
    isLocalOrService: /(local|service|trade|plumb|electric|builder|clinic|dent|estate|beauty|medical|law)/.test(lowerIndustry),
    focusesLeads: /(lead|enquir|inbound|contact)/.test(lowerGoal),
    focusesSales: /(sale|sales|checkout|order|revenue|pricing)/.test(lowerGoal),
  };
}

function estimatedImpactForCategory(category: AuditCategory, score: number) {
  if (category === "conversion") {
    if (score < 55) return "Likely reducing conversion: 1.1-2.2 percentage points";
    if (score < 65) return "Likely reducing conversion: 0.8-1.6 percentage points";
    return "Likely reducing conversion: 0.5-1.1 percentage points";
  }

  if (category === "speed") {
    if (score < 50) return "Likely costing: 12-28% of enquiries";
    if (score < 62) return "Likely costing: 10-22% of enquiries";
    return "Likely costing: 6-14% of enquiries";
  }

  if (category === "seo") {
    if (score < 52) return "Likely costing: 15-30% of qualified traffic";
    if (score < 64) return "Likely costing: 10-24% of qualified traffic";
    return "Likely costing: 6-16% of qualified traffic";
  }

  if (score < 52) return "Likely reducing close rate: 0.9-1.8 percentage points";
  if (score < 64) return "Likely reducing close rate: 0.6-1.4 percentage points";
  return "Likely reducing close rate: 0.3-0.9 percentage points";
}

function leakForCategory(category: AuditCategory, categoryScore: number, context: AuditContext): RevenueLeak {
  if (category === "speed") {
    return {
      category,
      title: "Leak: slow page speed",
      what: "Your key pages likely load too slowly on mobile, especially at first paint and first interaction.",
      why: "When load time drifts past buyer patience, enquiry volume drops and cost-per-lead rises.",
      fix: "Compress heavy media, trim scripts, and prioritise core rendering so high-intent visitors can act quickly.",
      estimatedImpact: estimatedImpactForCategory(category, categoryScore),
    };
  }

  if (category === "seo") {
    if (context.isEcom) {
      return {
        category,
        title: "Leak: low-intent traffic to PDP/collection pages",
        what: "Product and collection pages likely rank for broad terms instead of purchase-ready intent.",
        why: "Traffic arrives but does not add to cart, so sessions increase while sales stay flat.",
        fix: "Retarget titles, H1s, and internal links around buy-intent queries tied to PDP and checkout intent.",
        estimatedImpact: estimatedImpactForCategory(category, categoryScore),
      };
    }

    if (context.isLocalOrService) {
      return {
        category,
        title: "Leak: weak map-pack and local visibility",
        what: "Local service intent signals are likely too thin across service pages, reviews, and location relevance.",
        why: "Nearby buyers pick competitors who appear first with strong proof and tap-to-call options.",
        fix: "Strengthen local page intent, review acquisition cadence, and map-pack relevance signals.",
        estimatedImpact: estimatedImpactForCategory(category, categoryScore),
      };
    }

    return {
      category,
      title: "Leak: low-intent traffic",
      what: "Current SEO positioning likely attracts broad visitors rather than decision-ready prospects.",
      why: "Low-intent sessions consume budget and attention without translating into booked opportunities.",
      fix: "Rebuild metadata and internal linking around high-intent commercial keywords tied to your core offer.",
      estimatedImpact: estimatedImpactForCategory(category, categoryScore),
    };
  }

  if (category === "conversion") {
    if (context.isEcom || context.focusesSales) {
      return {
        category,
        title: "Leak: weak pricing and checkout flow",
        what: "The path from product detail to checkout likely has unnecessary hesitation points.",
        why: "Cart abandonment increases when pricing, shipping, or trust reassurance is unclear at decision moments.",
        fix: "Simplify checkout, clarify pricing/returns early, and tighten PDP-to-cart messaging around one primary offer.",
        estimatedImpact: estimatedImpactForCategory(category, categoryScore),
      };
    }

    if (context.isLocalOrService || context.focusesLeads) {
      return {
        category,
        title: "Leak: lead form friction and weak CTA clarity",
        what: "Visitors likely face too many form fields and competing CTAs before they are ready to enquire.",
        why: "High-intent prospects leave when they cannot contact you in under 30 seconds.",
        fix: "Cut forms to essential fields, set one primary CTA, and add call/WhatsApp shortcuts above the fold.",
        estimatedImpact: estimatedImpactForCategory(category, categoryScore),
      };
    }

    return {
      category,
      title: "Leak: weak above-the-fold offer",
      what: "Your first screen likely explains what you do but not why someone should act now.",
      why: "When value is unclear early, users scroll, compare, and often drop out before converting.",
      fix: "Lead with one concrete outcome promise, one CTA, and short proof bullets tied to business results.",
      estimatedImpact: estimatedImpactForCategory(category, categoryScore),
    };
  }

  if (context.isLocalOrService) {
    return {
      category,
      title: "Leak: weak trust and review proof",
      what: "The trust layer appears light across reviews, credentials, and response-time confidence cues.",
      why: "Service buyers compare proof first; without it, they call the competitor who feels safer.",
      fix: "Add recent reviews, guarantees, and response commitments near every enquiry action.",
      estimatedImpact: estimatedImpactForCategory(category, categoryScore),
    };
  }

  return {
    category,
    title: "Leak: low buying confidence",
    what: "Trust and authority cues are likely underdeveloped at key conversion points.",
    why: "Prospects hesitate when they cannot verify reliability, outcomes, or risk reversal quickly.",
    fix: "Install proof blocks, case outcomes, and guarantee framing across homepage and high-intent pages.",
    estimatedImpact: estimatedImpactForCategory(category, categoryScore),
  };
}

function buildQuickWins(ranked: AuditCategory[], context: AuditContext): string[] {
  const byCategory: Record<AuditCategory, string> = {
    speed: "Remove non-essential scripts and compress above-the-fold assets so mobile visitors can see your offer faster.",
    seo: "Rewrite title tags, meta descriptions, and H1s around high-intent search phrases your buyers actually use.",
    conversion: "Simplify the hero to one offer, one CTA, and one short proof stack to lift enquiry rate quickly.",
    trust: "Place trust badges, guarantee wording, and recent testimonials directly beside your main CTA.",
  };

  const contextWins: string[] = [];
  if (context.focusesLeads) {
    contextWins.push("Reduce lead form friction to 3-5 fields and move contact options above the fold to recover dropped enquiries.");
  }
  if (context.focusesSales) {
    contextWins.push("Clarify pricing and offer framing early to reduce hesitation before checkout or quote request.");
  }
  if (context.isEcom) {
    contextWins.push("Add sticky add-to-cart and visible delivery/returns messaging to recover high-intent product sessions.");
  }
  if (context.isLocalOrService) {
    contextWins.push("Add click-to-call and WhatsApp actions on mobile to capture urgent local buyers instantly.");
  }

  return uniqueStrings([...contextWins, ...ranked.map((category) => byCategory[category])]).slice(0, 3);
}

function buildMediumWins(ranked: AuditCategory[], context: AuditContext): string[] {
  const byCategory: Record<AuditCategory, string> = {
    speed: "Rebuild top landing templates with performance budgets and script governance to protect conversion at scale.",
    seo: "Ship a focused intent cluster plan so high-value pages rank for buyer-ready terms, not informational traffic.",
    conversion: "Deploy conversion-specific page variants and objection-handling blocks across core service funnels.",
    trust: "Systemise social proof: review requests, case snippets, and authority signals across all conversion paths.",
  };

  const contextWins: string[] = [];
  if (context.isEcom) {
    contextWins.push("Rework PDP, cart, and checkout flow with abandonment triggers and lifecycle follow-up to protect revenue.");
  }
  if (context.isLocalOrService) {
    contextWins.push("Implement missed-call capture, rapid callback workflows, and map-pack review acceleration to lift local bookings.");
  }
  if (context.focusesLeads) {
    contextWins.push("Connect forms, call events, and CRM stages so every lead has owner, status, and next action.");
  }
  if (context.focusesSales) {
    contextWins.push("Introduce offer packaging and pricing anchors to improve close rate without heavy discounting.");
  }

  return uniqueStrings([...contextWins, ...ranked.map((category) => byCategory[category])]).slice(0, 3);
}

function parseHtmlSignal(html: string): Omit<LiveAuditSignal, "source"> {
  const normalizedHtml = html.slice(0, 350000);

  const titleMatch = normalizedHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "";
  const titleLength = titleText ? titleText.length : null;

  const hasMetaDescription =
    /<meta[^>]+name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(normalizedHtml) ||
    /<meta[^>]+content=["'][^"']+["'][^>]*name=["']description["'][^>]*>/i.test(normalizedHtml);
  const hasH1 = /<h1[\s>][\s\S]*?<\/h1>/i.test(normalizedHtml);
  const hasDirectContact = /href=["'](?:tel:|mailto:)/i.test(normalizedHtml);

  const summaryParts: string[] = [];
  summaryParts.push(hasMetaDescription ? "Meta description found" : "Meta description missing");
  summaryParts.push(hasH1 ? "H1 found" : "H1 missing");
  summaryParts.push(hasDirectContact ? "Direct contact link found" : "No direct contact link detected");

  return {
    titleLength,
    hasMetaDescription,
    hasH1,
    hasDirectContact,
    summary: summaryParts.join(" · "),
  };
}

export async function fetchLiveAuditSignal(rawUrl: string): Promise<LiveAuditSignal | null> {
  const normalizedUrl = normalizeUrl(rawUrl);

  let parsed: URL;
  try {
    parsed = new URL(normalizedUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:") {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(parsed.toString(), {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "user-agent": "DigitalBusinessAssetsAuditBot/1.0 (+https://digitalbusinessassets.co.uk)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const parsedSignal = parseHtmlSignal(html);
    return {
      source: "live",
      ...parsedSignal,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

type BuildReportOptions = {
  liveSignal?: LiveAuditSignal | null;
};

export function buildGrowthAuditReport(input: GrowthAuditInput, options: BuildReportOptions = {}): GrowthAuditReport {
  const normalizedUrl = normalizeUrl(input.url);
  const urlObject = new URL(normalizedUrl);
  const seed = scoreFromSeed(`${normalizedUrl}|${input.industry || ""}|${input.goal || ""}`);

  const hostname = urlObject.hostname.replace(/^www\./, "");
  const domainLength = hostname.length;
  const lowerUrl = normalizedUrl.toLowerCase();
  const lowerGoal = (input.goal || "all of it").toLowerCase();
  const lowerIndustry = (input.industry || "").toLowerCase();
  const hasHttps = urlObject.protocol === "https:";
  const hasKeywordBoost = /(shop|clinic|studio)/.test(`${hostname}${urlObject.pathname}`.toLowerCase());
  const hasLegacySignals = /wp-|index\.php|\?p=/.test(lowerUrl);
  const hasTrackingQuery = /(utm_|fbclid|gclid)/.test(urlObject.search.toLowerCase());

  let speedScore = 54;
  if (hasHttps) speedScore += 7;
  if (domainLength <= 14) speedScore += 5;
  else if (domainLength <= 22) speedScore += 2;
  else speedScore -= 4;
  if (hasTrackingQuery) speedScore -= 3;
  if (hasLegacySignals) speedScore -= 4;
  if (lowerGoal.includes("slow")) speedScore -= 4;
  speedScore += noise(seed, 3);

  let seoScore = 50;
  if (hasHttps) seoScore += 3;
  if (hostname.endsWith(".co.uk")) seoScore += 5;
  if (urlObject.pathname === "/" || urlObject.pathname.split("/").length <= 3) seoScore += 2;
  if (hasTrackingQuery) seoScore -= 2;
  if (hasLegacySignals) seoScore -= 4;
  if (lowerGoal.includes("bad seo")) seoScore -= 5;
  if (/restaurant|clinic|dent|trade|estate|beauty|legal/.test(lowerIndustry)) seoScore += 2;
  seoScore += noise(seed, 7);

  let conversionScore = 48;
  if (hasKeywordBoost) conversionScore += 8;
  if (/(book|quote|contact|get-started|checkout|buy)/.test(lowerUrl)) conversionScore += 3;
  if (domainLength <= 16) conversionScore += 2;
  if (lowerGoal.includes("low conversion")) conversionScore -= 6;
  if (lowerGoal.includes("no leads")) conversionScore -= 4;
  if (/(sale|sales|checkout|order)/.test(lowerGoal)) conversionScore -= 2;
  conversionScore += noise(seed, 11);

  let trustScore = 49;
  if (hasHttps) trustScore += 8;
  else trustScore -= 8;
  if (/test|demo|staging/.test(hostname)) trustScore -= 6;
  if (hostname.includes("-")) trustScore -= 1;
  if (/medical|clinic|law|legal|estate/.test(lowerIndustry)) trustScore += 2;
  if (lowerGoal.includes("need website")) trustScore -= 4;
  trustScore += noise(seed, 17);

  const liveSignal = options.liveSignal || null;
  if (liveSignal) {
    if (liveSignal.titleLength !== null) {
      if (liveSignal.titleLength >= 30 && liveSignal.titleLength <= 65) {
        seoScore += 2;
      } else {
        seoScore -= 2;
      }
    }

    seoScore += liveSignal.hasMetaDescription ? 3 : -3;
    conversionScore += liveSignal.hasH1 ? 2 : -2;
    trustScore += liveSignal.hasDirectContact ? 2 : -1;
  }

  speedScore = clampScore(speedScore);
  seoScore = clampScore(seoScore);
  conversionScore = clampScore(conversionScore);
  trustScore = clampScore(trustScore);

  const score = clampScore(speedScore * 0.25 + seoScore * 0.25 + conversionScore * 0.3 + trustScore * 0.2);
  const context = resolveContext(lowerIndustry, lowerGoal);

  const rankedCategories = [
    { key: "speed" as const, value: speedScore },
    { key: "seo" as const, value: seoScore },
    { key: "conversion" as const, value: conversionScore },
    { key: "trust" as const, value: trustScore },
  ].sort((a, b) => a.value - b.value);

  const topLeaks = rankedCategories
    .slice(0, 3)
    .map((item) => leakForCategory(item.key, item.value, context));
  const quickWins = buildQuickWins(rankedCategories.map((item) => item.key), context);
  const mediumWins = buildMediumWins(rankedCategories.map((item) => item.key), context);
  const recommendedModules = mapRecommendedModules({
    speedScore,
    seoScore,
    conversionScore,
    trustScore,
    leakTypes: topLeaks.map((leak) => leak.category),
    industry: input.industry,
    goal: input.goal,
  });

  return {
    normalizedUrl,
    score,
    speedScore,
    seoScore,
    conversionScore,
    trustScore,
    topLeaks,
    quickWins,
    mediumWins,
    recommendedModules,
    liveSignal,
  };
}
