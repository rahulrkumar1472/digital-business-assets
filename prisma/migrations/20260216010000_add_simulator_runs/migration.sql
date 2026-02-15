-- CreateTable
CREATE TABLE "public"."SimulatorRun" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "leadId" TEXT,
  "auditRunId" TEXT,
  "domain" TEXT,
  "businessName" TEXT,
  "industry" TEXT NOT NULL,
  "offerType" TEXT NOT NULL,
  "goal" TEXT NOT NULL,
  "locationIntent" TEXT NOT NULL,
  "visitors" INTEGER NOT NULL,
  "conversionRate" DOUBLE PRECISION NOT NULL,
  "avgOrderValue" DOUBLE PRECISION NOT NULL,
  "closeRate" DOUBLE PRECISION NOT NULL,
  "grossMargin" DOUBLE PRECISION,
  "responseTimeMinutes" INTEGER NOT NULL,
  "followups" INTEGER NOT NULL,
  "leadCapturePoints" JSONB,
  "trustSignals" JSONB,
  "outputs" JSONB NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'GBP',
  CONSTRAINT "SimulatorRun_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN "simulatorRunId" TEXT;

-- CreateIndex
CREATE INDEX "SimulatorRun_createdAt_idx" ON "public"."SimulatorRun"("createdAt");
CREATE INDEX "SimulatorRun_leadId_idx" ON "public"."SimulatorRun"("leadId");
CREATE INDEX "SimulatorRun_auditRunId_idx" ON "public"."SimulatorRun"("auditRunId");
CREATE INDEX "SimulatorRun_domain_idx" ON "public"."SimulatorRun"("domain");
CREATE INDEX "Event_simulatorRunId_idx" ON "public"."Event"("simulatorRunId");

-- AddForeignKey
ALTER TABLE "public"."SimulatorRun" ADD CONSTRAINT "SimulatorRun_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."SimulatorRun" ADD CONSTRAINT "SimulatorRun_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "public"."AuditRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_simulatorRunId_fkey" FOREIGN KEY ("simulatorRunId") REFERENCES "public"."SimulatorRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
