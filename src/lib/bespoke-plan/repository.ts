import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Prisma } from "@prisma/client";

import { isPrismaReady, prisma } from "@/lib/db/prisma";

export type BespokePlanInput = {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  industry?: string;
  track: "track1" | "track2" | "unknown";
  monthlyRevenueRange?: string;
  leadVolumeRange?: string;
  biggestBlocker: string;
  preferredContact: "book-call" | "message";
  notes?: string;
  selectedModules?: Array<{ slug: string; title: string; price?: string }>;
};

type FallbackPlanRecord = BespokePlanInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

const storageFile = path.join(process.cwd(), ".data", "bespoke-plan-requests.json");

async function readFallback() {
  try {
    const raw = await readFile(storageFile, "utf8");
    const parsed = JSON.parse(raw) as FallbackPlanRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as FallbackPlanRecord[];
  }
}

async function writeFallback(records: FallbackPlanRecord[]) {
  await mkdir(path.dirname(storageFile), { recursive: true });
  await writeFile(storageFile, JSON.stringify(records, null, 2), "utf8");
}

export async function createBespokePlanRequest(input: BespokePlanInput) {
  const normalized = {
    ...input,
    email: input.email.trim().toLowerCase(),
  };

  if (isPrismaReady()) {
    try {
      return await prisma.bespokePlanRequest.create({
        data: {
          userId: normalized.userId,
          name: normalized.name,
          email: normalized.email,
          phone: normalized.phone,
          company: normalized.company,
          website: normalized.website,
          industry: normalized.industry,
          track: normalized.track,
          monthlyRevenueRange: normalized.monthlyRevenueRange,
          leadVolumeRange: normalized.leadVolumeRange,
          biggestBlocker: normalized.biggestBlocker,
          preferredContact: normalized.preferredContact,
          notes: normalized.notes,
          selectedModules: (normalized.selectedModules || []) as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      console.error("[bespoke-plan] prisma create failed, fallback to file", error);
    }
  }

  const now = new Date().toISOString();
  const records = await readFallback();
  const record: FallbackPlanRecord = {
    id: crypto.randomUUID(),
    ...normalized,
    createdAt: now,
    updatedAt: now,
  };
  records.unshift(record);
  await writeFallback(records);
  return record;
}

export async function listBespokePlanRequestsByEmail(email: string, limit = 20) {
  const normalized = email.trim().toLowerCase();

  if (isPrismaReady()) {
    try {
      return await prisma.bespokePlanRequest.findMany({
        where: { email: normalized },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    } catch (error) {
      console.error("[bespoke-plan] prisma list failed, fallback to file", error);
    }
  }

  const records = await readFallback();
  return records
    .filter((record) => record.email === normalized)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

