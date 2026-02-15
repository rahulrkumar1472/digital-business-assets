-- CreateTable
CREATE TABLE "public"."PortalSession" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PortalSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditSnapshot" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "auditRunId" TEXT,
  "snapshotJson" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SimulatorSnapshot" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "simulatorRunId" TEXT,
  "snapshotJson" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SimulatorSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortalSession_token_key" ON "public"."PortalSession"("token");
CREATE INDEX "PortalSession_leadId_createdAt_idx" ON "public"."PortalSession"("leadId", "createdAt");
CREATE INDEX "PortalSession_expiresAt_idx" ON "public"."PortalSession"("expiresAt");
CREATE INDEX "AuditSnapshot_leadId_createdAt_idx" ON "public"."AuditSnapshot"("leadId", "createdAt");
CREATE INDEX "AuditSnapshot_auditRunId_idx" ON "public"."AuditSnapshot"("auditRunId");
CREATE INDEX "SimulatorSnapshot_leadId_createdAt_idx" ON "public"."SimulatorSnapshot"("leadId", "createdAt");
CREATE INDEX "SimulatorSnapshot_simulatorRunId_idx" ON "public"."SimulatorSnapshot"("simulatorRunId");

-- AddForeignKey
ALTER TABLE "public"."PortalSession" ADD CONSTRAINT "PortalSession_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."AuditSnapshot" ADD CONSTRAINT "AuditSnapshot_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."AuditSnapshot" ADD CONSTRAINT "AuditSnapshot_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "public"."AuditRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."SimulatorSnapshot" ADD CONSTRAINT "SimulatorSnapshot_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."SimulatorSnapshot" ADD CONSTRAINT "SimulatorSnapshot_simulatorRunId_fkey" FOREIGN KEY ("simulatorRunId") REFERENCES "public"."SimulatorRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
