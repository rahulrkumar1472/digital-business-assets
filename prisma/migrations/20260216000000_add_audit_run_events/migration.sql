-- CreateTable
CREATE TABLE "public"."AuditRun" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "url" TEXT NOT NULL,
  "scoresJson" JSONB NOT NULL,
  "leadId" TEXT,
  "reportId" TEXT,
  CONSTRAINT "AuditRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "leadId" TEXT,
  "auditRunId" TEXT,
  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditRun_createdAt_idx" ON "public"."AuditRun"("createdAt");
CREATE INDEX "AuditRun_leadId_idx" ON "public"."AuditRun"("leadId");
CREATE INDEX "AuditRun_url_idx" ON "public"."AuditRun"("url");
CREATE INDEX "AuditRun_reportId_idx" ON "public"."AuditRun"("reportId");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "public"."Event"("type");
CREATE INDEX "Event_createdAt_idx" ON "public"."Event"("createdAt");
CREATE INDEX "Event_leadId_idx" ON "public"."Event"("leadId");
CREATE INDEX "Event_auditRunId_idx" ON "public"."Event"("auditRunId");

-- AddForeignKey
ALTER TABLE "public"."AuditRun" ADD CONSTRAINT "AuditRun_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "public"."AuditRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
