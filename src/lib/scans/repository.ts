import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Prisma, ScanStatus } from "@prisma/client";

import { isPrismaReady, prisma } from "@/lib/db/prisma";
import { auditReasons, type AuditReason } from "@/lib/scans/constants";

export { auditReasons };
export type { AuditReason };

export type LeadScanInput = {
  fullName: string;
  mobileNumber: string;
  businessName: string;
  websiteUrl: string;
  reason: AuditReason;
  email?: string;
  industry?: string;
};

type StoredLead = {
  id: string;
  fullName: string;
  mobileNumber: string;
  businessName: string;
  websiteUrl: string;
  reason: AuditReason;
  email?: string;
  industry?: string;
  createdAt: string;
};

type StoredScan = {
  id: string;
  leadId: string;
  status: ScanStatus | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  websiteUrl: string;
  concern: AuditReason;
  industry: string;
  progress: number;
  scores?: Record<string, number>;
  insights?: string[];
  recommendations?: string[];
  reportPath?: string;
  rawResult?: Record<string, unknown>;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type FallbackStore = {
  leads: StoredLead[];
  scans: StoredScan[];
};

const storageDir = path.join(process.cwd(), ".data");
const storageFile = path.join(storageDir, "business-os-store.json");

const phonePattern = /^[+()\d\s-]{7,22}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeText(value: string, max: number) {
  return value.trim().slice(0, max);
}

function normaliseWebsiteUrl(input: string) {
  const raw = input.trim();
  if (!raw) {
    throw new Error("Website URL is required.");
  }

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = new URL(candidate);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Website URL must use HTTP or HTTPS.");
  }

  parsed.hash = "";
  return parsed.toString();
}

export function normalizeLeadScanInput(payload: Partial<LeadScanInput>): LeadScanInput {
  const fullName = sanitizeText(payload.fullName || "", 120);
  const mobileNumber = sanitizeText(payload.mobileNumber || "", 40);
  const businessName = sanitizeText(payload.businessName || "", 140);
  const websiteUrl = normaliseWebsiteUrl(payload.websiteUrl || "");
  const reason = auditReasons.includes(payload.reason as AuditReason) ? (payload.reason as AuditReason) : "All of it";
  const email = sanitizeText(payload.email || "", 180).toLowerCase();
  const industry = sanitizeText(payload.industry || "", 120);

  if (!fullName || !mobileNumber || !businessName) {
    throw new Error("Full name, mobile number, and business name are required.");
  }

  if (!phonePattern.test(mobileNumber)) {
    throw new Error("Please enter a valid mobile number.");
  }

  if (email && !emailPattern.test(email)) {
    throw new Error("Please enter a valid email address or leave it blank.");
  }

  return {
    fullName,
    mobileNumber,
    businessName,
    websiteUrl,
    reason,
    email: email || undefined,
    industry: industry || "General",
  };
}

async function readFallbackStore(): Promise<FallbackStore> {
  try {
    const raw = await readFile(storageFile, "utf8");
    const parsed = JSON.parse(raw) as FallbackStore;
    return {
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      scans: Array.isArray(parsed.scans) ? parsed.scans : [],
    };
  } catch {
    return {
      leads: [],
      scans: [],
    };
  }
}

async function writeFallbackStore(store: FallbackStore) {
  await mkdir(storageDir, { recursive: true });
  await writeFile(storageFile, JSON.stringify(store, null, 2), "utf8");
}

export async function createLeadAndScan(input: LeadScanInput) {
  if (isPrismaReady()) {
    try {
      const lead = await prisma.lead.create({
        data: {
          fullName: input.fullName,
          mobileNumber: input.mobileNumber,
          businessName: input.businessName,
          websiteUrl: input.websiteUrl,
          reason: input.reason,
          email: input.email,
        },
      });

      const scan = await prisma.websiteScan.create({
        data: {
          leadId: lead.id,
          websiteUrl: input.websiteUrl,
          concern: input.reason,
          industry: input.industry || "General",
          progress: 4,
          status: "QUEUED",
        },
      });

      return {
        leadId: lead.id,
        scanId: scan.id,
        source: "prisma" as const,
      };
    } catch (error) {
      console.error("[scan-repository] prisma create failed, using file fallback", error);
    }
  }

  const store = await readFallbackStore();
  const leadId = crypto.randomUUID();
  const scanId = crypto.randomUUID();
  const now = new Date().toISOString();

  store.leads.unshift({
    id: leadId,
    fullName: input.fullName,
    mobileNumber: input.mobileNumber,
    businessName: input.businessName,
    websiteUrl: input.websiteUrl,
    reason: input.reason,
    email: input.email,
    industry: input.industry,
    createdAt: now,
  });

  store.scans.unshift({
    id: scanId,
    leadId,
    websiteUrl: input.websiteUrl,
    concern: input.reason,
    industry: input.industry || "General",
    progress: 4,
    status: "QUEUED",
    createdAt: now,
    updatedAt: now,
  });

  await writeFallbackStore(store);

  return {
    leadId,
    scanId,
    source: "file" as const,
  };
}

export async function updateScanStatus(
  scanId: string,
  patch: {
    status?: ScanStatus | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
    progress?: number;
    scores?: Record<string, number>;
    insights?: string[];
    recommendations?: string[];
    reportPath?: string;
    rawResult?: Record<string, unknown>;
    errorMessage?: string;
    startedAt?: string;
    completedAt?: string;
  },
) {
  if (isPrismaReady()) {
    try {
      await prisma.websiteScan.update({
        where: { id: scanId },
        data: {
          status: patch.status,
          progress: patch.progress,
          scores: patch.scores,
          insights: patch.insights,
          recommendations: patch.recommendations,
          reportPath: patch.reportPath,
          rawResult: patch.rawResult as Prisma.InputJsonValue | undefined,
          errorMessage: patch.errorMessage,
          startedAt: patch.startedAt ? new Date(patch.startedAt) : undefined,
          completedAt: patch.completedAt ? new Date(patch.completedAt) : undefined,
        },
      });
      return;
    } catch (error) {
      console.error("[scan-repository] prisma update failed, using file fallback", error);
    }
  }

  const store = await readFallbackStore();
  const scan = store.scans.find((item) => item.id === scanId);
  if (!scan) {
    return;
  }

  if (patch.status) scan.status = patch.status;
  if (typeof patch.progress === "number") scan.progress = patch.progress;
  if (patch.scores) scan.scores = patch.scores;
  if (patch.insights) scan.insights = patch.insights;
  if (patch.recommendations) scan.recommendations = patch.recommendations;
  if (patch.reportPath) scan.reportPath = patch.reportPath;
  if (patch.rawResult) scan.rawResult = patch.rawResult;
  if (patch.errorMessage) scan.errorMessage = patch.errorMessage;
  if (patch.startedAt) scan.startedAt = patch.startedAt;
  if (patch.completedAt) scan.completedAt = patch.completedAt;
  scan.updatedAt = new Date().toISOString();

  await writeFallbackStore(store);
}

export async function getScanById(scanId: string) {
  if (isPrismaReady()) {
    try {
      return await prisma.websiteScan.findUnique({
        where: { id: scanId },
        include: { lead: true },
      });
    } catch (error) {
      console.error("[scan-repository] prisma get failed, using file fallback", error);
    }
  }

  const store = await readFallbackStore();
  const scan = store.scans.find((item) => item.id === scanId);
  if (!scan) {
    return null;
  }

  const lead = store.leads.find((item) => item.id === scan.leadId) || null;
  return {
    ...scan,
    lead,
  };
}

export async function listRecentScans(limit = 30) {
  if (isPrismaReady()) {
    try {
      return await prisma.websiteScan.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { lead: true },
      });
    } catch (error) {
      console.error("[scan-repository] prisma list scans failed, using file fallback", error);
    }
  }

  const store = await readFallbackStore();
  return store.scans
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map((scan) => ({
      ...scan,
      lead: store.leads.find((lead) => lead.id === scan.leadId) || null,
    }));
}

export async function listRecentLeads(limit = 40) {
  if (isPrismaReady()) {
    try {
      return await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    } catch (error) {
      console.error("[scan-repository] prisma list leads failed, using file fallback", error);
    }
  }

  const store = await readFallbackStore();
  return store.leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}
