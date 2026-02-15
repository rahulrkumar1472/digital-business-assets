-- AlterTable
ALTER TABLE "public"."Lead"
  ADD COLUMN "intentTier" TEXT NOT NULL DEFAULT 'Warm',
  ADD COLUMN "nextAction" TEXT,
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'New',
  ADD COLUMN "notes" TEXT,
  ADD COLUMN "lastSeenAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."AuditRun"
  ADD COLUMN "snapshotJson" JSONB;

-- CreateIndex
CREATE INDEX "Lead_lastSeenAt_idx" ON "public"."Lead"("lastSeenAt");
CREATE INDEX "Lead_intentTier_idx" ON "public"."Lead"("intentTier");
CREATE INDEX "Lead_status_idx" ON "public"."Lead"("status");
