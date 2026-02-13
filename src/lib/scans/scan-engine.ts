import { runWebsiteAudit } from "@/lib/website-audit";
import {
  type AuditReason,
  type LeadScanInput,
  getScanById,
  updateScanStatus,
} from "@/lib/scans/repository";

export type UpgradeCard = {
  title: string;
  reason: string;
  serviceSlug: string;
  fromPrice: string;
};

export function buildUpgradeCards(reason: AuditReason): UpgradeCard[] {
  const defaults: UpgradeCard[] = [
    {
      title: "Website conversion upgrade",
      reason: "Your pages need clearer offers and stronger conversion routes.",
      serviceSlug: "website-pro-build",
      fromPrice: "From £549",
    },
    {
      title: "Follow-up automation",
      reason: "Fast response wins. Automation protects warm leads from cooling.",
      serviceSlug: "follow-up-automation",
      fromPrice: "From £549",
    },
    {
      title: "CRM setup",
      reason: "Visibility in pipeline stages prevents leakage and missed handoffs.",
      serviceSlug: "crm-setup",
      fromPrice: "From £599",
    },
  ];

  if (reason === "Need website") {
    return [
      {
        title: "Website Starter Build",
        reason: "Launch fast with a premium online presence in 72 hours.",
        serviceSlug: "website-starter-build",
        fromPrice: "From £399",
      },
      {
        title: "Booking system setup",
        reason: "Give buyers a clear path from enquiry to confirmed slot.",
        serviceSlug: "booking-system-setup",
        fromPrice: "From £449",
      },
      ...defaults.slice(1),
    ];
  }

  if (reason === "Slow replies") {
    return [
      {
        title: "Call tracking + missed call capture",
        reason: "Recover calls immediately before competitors respond.",
        serviceSlug: "call-tracking-missed-call-capture",
        fromPrice: "From £499",
      },
      {
        title: "WhatsApp business setup",
        reason: "Open a fast-response channel for mobile-first leads.",
        serviceSlug: "whatsapp-business-setup",
        fromPrice: "From £399",
      },
      defaults[1],
    ];
  }

  if (reason === "Bad SEO") {
    return [
      {
        title: "SEO Upgrade Pack",
        reason: "Fix technical visibility and improve high-intent rankings.",
        serviceSlug: "seo-upgrade-pack",
        fromPrice: "From £499",
      },
      defaults[0],
      defaults[2],
    ];
  }

  return defaults;
}

async function executeScan(scanId: string, input: LeadScanInput) {
  await updateScanStatus(scanId, {
    status: "PROCESSING",
    progress: 18,
    startedAt: new Date().toISOString(),
  });

  const audit = await runWebsiteAudit({
    websiteUrl: input.websiteUrl,
    name: input.fullName,
    email: input.email || "",
    phone: input.mobileNumber,
    industry: input.industry || "General",
    concern: input.reason,
  });

  const topInsights = audit.technicalChecks
    .slice(0, 4)
    .map((check) => `${check.label}: ${check.details}`);

  const recommendations = [
    ...audit.recommendations,
    ...buildUpgradeCards(input.reason).map((card) => `${card.title}: ${card.reason}`),
  ].slice(0, 8);

  await updateScanStatus(scanId, {
    status: "COMPLETED",
    progress: 100,
    scores: audit.scores,
    insights: topInsights,
    recommendations,
    reportPath: audit.assets.pdf,
    rawResult: {
      auditId: audit.id,
      technicalChecks: audit.technicalChecks,
      speedMetrics: audit.speedMetrics,
      domain: audit.domain,
      normalizedUrl: audit.normalizedUrl,
      upgradeCards: buildUpgradeCards(input.reason),
    },
    completedAt: new Date().toISOString(),
  });
}

const runningScans = new Set<string>();

export async function enqueueScanJob(scanId: string, input: LeadScanInput) {
  if (runningScans.has(scanId)) {
    return;
  }

  runningScans.add(scanId);

  queueMicrotask(async () => {
    try {
      await executeScan(scanId, input);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Scan failed.";
      await updateScanStatus(scanId, {
        status: "FAILED",
        progress: 100,
        errorMessage: message,
        completedAt: new Date().toISOString(),
      });
    } finally {
      runningScans.delete(scanId);
    }
  });
}

export async function ensureScanProgress(scanId: string, input: LeadScanInput) {
  const scan = await getScanById(scanId);
  if (!scan || scan.status === "COMPLETED" || scan.status === "FAILED") {
    return;
  }

  await enqueueScanJob(scanId, input);
}
