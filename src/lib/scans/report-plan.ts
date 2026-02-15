import type { GrowthAuditReport, LiveAuditSignal } from "@/lib/scans/growth-audit-report";

type ActionTheme = "discoverability" | "conversion" | "performance" | "trust" | "lead-capture";

export type ReportTopAction = {
  id: string;
  title: string;
  why: string;
  becauseDetected: string;
  revenueWhy: string;
  upliftLow: number;
  upliftHigh: number;
  upliftRange: string;
  href: string;
  moduleId: string;
};

export type BusinessSnapshot = {
  hostname: string;
  isHttps: boolean;
  titleText: string | null;
  h1Text: string | null;
  hasEmailContact: boolean;
  hasPhoneContact: boolean;
  hasAddressSignal: boolean;
  likelySiteType: "ecom" | "service/local" | "general";
};

export type ReportModulePack = {
  id: string;
  title: string;
  why: string;
  href: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function themeRevenueLine(theme: ActionTheme) {
  if (theme === "discoverability") {
    return "This improves discoverability so more qualified buyers reach your offer pages.";
  }
  if (theme === "conversion") {
    return "This removes decision friction so more of your existing traffic becomes leads.";
  }
  if (theme === "performance") {
    return "This improves speed-to-action so high-intent visitors do not drop before enquiring.";
  }
  if (theme === "trust") {
    return "This increases buyer confidence so prospects commit instead of comparing and leaving.";
  }
  return "This improves lead capture coverage so fewer warm enquiries are lost.";
}

function parseHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "example.co.uk";
  }
}

export function buildBusinessSnapshot(url: string, liveSignal: LiveAuditSignal | null): BusinessSnapshot {
  const hostname = parseHostname(url);
  const isHttps = /^https:\/\//i.test(url);
  const likelySiteTypeFromUrl = /(shop|store|cart|checkout|product)/i.test(url)
    ? "ecom"
    : /(book|appointment|service|clinic|quote|contact)/i.test(url)
      ? "service/local"
      : "general";

  return {
    hostname,
    isHttps,
    titleText: liveSignal?.titleText || null,
    h1Text: liveSignal?.h1Text || null,
    hasEmailContact: Boolean(liveSignal?.hasEmailContact),
    hasPhoneContact: Boolean(liveSignal?.hasPhoneContact),
    hasAddressSignal: Boolean(liveSignal?.hasAddressSignal),
    likelySiteType: liveSignal?.likelySiteType || likelySiteTypeFromUrl,
  };
}

export function buildReportTopActions(report: GrowthAuditReport): ReportTopAction[] {
  const pressure = (100 - report.score) / 100;
  const moduleById = new Map(report.recommendedModules.map((module) => [module.id, module]));
  const fallbackModule = report.recommendedModules[0];
  const findModule = (priorityIds: string[]) => {
    for (const id of priorityIds) {
      const found = moduleById.get(id);
      if (found) {
        return found;
      }
    }
    return fallbackModule;
  };

  type Candidate = {
    key: string;
    title: string;
    why: string;
    becauseDetected: string;
    theme: ActionTheme;
    moduleIdPriority: string[];
    severity: number;
  };

  const candidates: Candidate[] = [];
  const failedChecks = report.liveSignal?.checks.filter((check) => !check.pass) || [];
  for (const check of failedChecks) {
    if (check.label === "Meta description") {
      candidates.push({
        key: "meta-description",
        title: "Fix search snippet messaging on key pages",
        why: "Improve commercial relevance in search results and increase qualified click-through.",
        becauseDetected: `${check.label} — ${check.note}`,
        theme: "discoverability",
        moduleIdPriority: ["seoSprint", "websitePro"],
        severity: 3,
      });
    } else if (check.label === "Canonical tag") {
      candidates.push({
        key: "canonical",
        title: "Stabilise canonical signals for core pages",
        why: "Consolidate ranking value onto priority URLs instead of splitting authority.",
        becauseDetected: `${check.label} — ${check.note}`,
        theme: "discoverability",
        moduleIdPriority: ["seoSprint", "websitePro"],
        severity: 3,
      });
    } else if (check.label === "JSON-LD schema") {
      candidates.push({
        key: "json-ld",
        title: "Add structured data on revenue pages",
        why: "Help search systems understand your offer and improve trust signals in results.",
        becauseDetected: `${check.label} — ${check.note}`,
        theme: "trust",
        moduleIdPriority: ["seoSprint", "websitePro"],
        severity: 2,
      });
    } else if (check.label === "Script load") {
      candidates.push({
        key: "script-load",
        title: "Reduce script payload on conversion pages",
        why: "Lower rendering delays and improve first interaction speed for high-intent visitors.",
        becauseDetected: `${check.label} — ${check.note}`,
        theme: "performance",
        moduleIdPriority: ["websitePro", "analytics"],
        severity: 3,
      });
    } else if (check.label === "Image density") {
      candidates.push({
        key: "image-density",
        title: "Optimise media delivery for mobile traffic",
        why: "Reduce media bottlenecks that slow page load and weaken lead conversion.",
        becauseDetected: `${check.label} — ${check.note}`,
        theme: "performance",
        moduleIdPriority: ["websitePro", "websiteStarter"],
        severity: 2,
      });
    } else if (check.label === "Open Graph essentials") {
      candidates.push({
        key: "open-graph",
        title: "Improve trust previews for shared links",
        why: "Strengthen social/referral click confidence with consistent metadata.",
        becauseDetected: `${check.label} — ${check.note}`,
        theme: "trust",
        moduleIdPriority: ["websitePro", "seoSprint"],
        severity: 1,
      });
    } else if (check.label === "Title length") {
      candidates.push({
        key: "title-length",
        title: "Rewrite title tags around buyer intent",
        why: "Align titles to what buyers search before they enquire or buy.",
        becauseDetected: `${check.label} — ${check.note}`,
        theme: "discoverability",
        moduleIdPriority: ["seoSprint", "websitePro"],
        severity: 2,
      });
    } else if (check.label === "Robots meta") {
      candidates.push({
        key: "robots-meta",
        title: "Correct robots directives on indexable pages",
        why: "Avoid accidental crawl/index loss on high-value conversion pages.",
        becauseDetected: `${check.label} — ${check.note}`,
        theme: "discoverability",
        moduleIdPriority: ["seoSprint", "analytics"],
        severity: 2,
      });
    }
  }

  for (const leak of report.topLeaks) {
    if (leak.category === "conversion") {
      candidates.push({
        key: "conversion-leak",
        title: "Tighten offer and CTA conversion path",
        why: leak.fix,
        becauseDetected: `${leak.category.toUpperCase()} leak — ${leak.estimatedImpact}`,
        theme: "conversion",
        moduleIdPriority: ["websitePro", "booking", "followUp"],
        severity: 3,
      });
    } else if (leak.category === "speed") {
      candidates.push({
        key: "speed-leak",
        title: "Run a performance compression sprint",
        why: leak.fix,
        becauseDetected: `${leak.category.toUpperCase()} leak — ${leak.estimatedImpact}`,
        theme: "performance",
        moduleIdPriority: ["websitePro", "websiteStarter"],
        severity: 2,
      });
    } else if (leak.category === "seo") {
      candidates.push({
        key: "seo-leak",
        title: "Rebuild on-page intent for money terms",
        why: leak.fix,
        becauseDetected: `${leak.category.toUpperCase()} leak — ${leak.estimatedImpact}`,
        theme: "discoverability",
        moduleIdPriority: ["seoSprint", "websitePro"],
        severity: 2,
      });
    } else if (leak.category === "trust") {
      candidates.push({
        key: "trust-leak",
        title: "Install trust and proof blocks at decision points",
        why: leak.fix,
        becauseDetected: `${leak.category.toUpperCase()} leak — ${leak.estimatedImpact}`,
        theme: "trust",
        moduleIdPriority: ["websitePro", "crm", "chatbot"],
        severity: 2,
      });
    }
  }

  const deduped = Array.from(new Map(candidates.map((candidate) => [candidate.key, candidate])).values());
  const selected = deduped.slice(0, 3);

  return selected.map((candidate, index) => {
    const moduleMatch = findModule(candidate.moduleIdPriority);
    const upliftLow = clamp(Math.round(8 + pressure * 10 + candidate.severity * 2 - index), 6, 30);
    const upliftHigh = clamp(upliftLow + Math.round(6 + pressure * 6 + candidate.severity), upliftLow + 4, 42);
    return {
      id: `${candidate.key}-${index}`,
      title: candidate.title,
      why: candidate.why,
      becauseDetected: candidate.becauseDetected,
      revenueWhy: themeRevenueLine(candidate.theme),
      upliftLow,
      upliftHigh,
      upliftRange: `+${upliftLow}% to +${upliftHigh}%`,
      href: moduleMatch?.href || "/tools",
      moduleId: moduleMatch?.id || "websiteStarter",
    };
  });
}

export function buildReportModulePacks(report: GrowthAuditReport, actions: ReportTopAction[]): ReportModulePack[] {
  const failedLabels = new Set((report.liveSignal?.checks || []).filter((check) => !check.pass).map((check) => check.label));
  const packs: ReportModulePack[] = [];

  const pushPack = (pack: ReportModulePack) => {
    if (packs.some((item) => item.id === pack.id)) {
      return;
    }
    packs.push(pack);
  };

  if (
    failedLabels.has("Meta description") ||
    failedLabels.has("Canonical tag") ||
    failedLabels.has("Open Graph essentials") ||
    failedLabels.has("JSON-LD schema") ||
    failedLabels.has("Title length") ||
    failedLabels.has("Robots meta")
  ) {
    pushPack({
      id: "seo-pack",
      title: "On-page SEO Pack",
      why: "Fix metadata, canonical, OG, and structured data gaps to improve discoverability.",
      href: "/services/seo-upgrade-pack",
    });
  }

  if (failedLabels.has("Script load") || failedLabels.has("Image density") || report.speedScore < 62) {
    pushPack({
      id: "performance-pack",
      title: "Performance Pack",
      why: "Reduce script and media weight to improve mobile speed and response.",
      href: "/services/website-pro-build#performance",
    });
  }

  if (
    report.conversionScore < 65 ||
    actions.some((action) => /cta|conversion|offer|lead/i.test(action.title))
  ) {
    pushPack({
      id: "conversion-pack",
      title: "Conversion Pack",
      why: "Improve offer clarity, CTA hierarchy, and lead capture path.",
      href: "/services/website-pro-build#conversion",
    });
  }

  if (
    !report.liveSignal?.hasEmailContact ||
    !report.liveSignal?.hasPhoneContact ||
    !report.liveSignal?.hasAddressSignal ||
    report.trustScore < 65
  ) {
    pushPack({
      id: "trust-pack",
      title: "Trust & Proof Pack",
      why: "Add confidence and contact signals that reduce hesitation and increase enquiries.",
      href: "/services/website-pro-build#trust-proof",
    });
  }

  if (actions.some((action) => /follow|crm|pipeline/i.test(action.title)) || report.conversionScore < 58) {
    pushPack({
      id: "follow-up-pack",
      title: "Follow-up Automation Pack",
      why: "Protect every enquiry with stage ownership and automated follow-up.",
      href: "/services/follow-up-automation",
    });
  }

  if (report.liveSignal && !report.liveSignal.hasDirectContact && report.liveSignal.likelySiteType === "service/local") {
    pushPack({
      id: "call-capture-pack",
      title: "Lead Capture Recovery Pack",
      why: "Recover missed call demand and add instant response channels for local buyers.",
      href: "/services/call-tracking-missed-call-capture",
    });
  }

  return packs.slice(0, 6);
}
