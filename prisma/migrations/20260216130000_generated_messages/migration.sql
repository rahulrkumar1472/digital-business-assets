-- CreateTable
CREATE TABLE "public"."GeneratedMessage" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "leadId" TEXT NOT NULL,
  "auditRunId" TEXT,
  "simulatorRunId" TEXT,
  "domain" TEXT NOT NULL,
  "weakestFunnelStage" TEXT NOT NULL,
  "topFindings" JSONB NOT NULL,
  "estimatedRevenueGain" TEXT NOT NULL,
  "urgencyFactor" TEXT NOT NULL,
  "emailVersion" TEXT NOT NULL,
  "whatsappVersion" TEXT NOT NULL,
  "smsVersion" TEXT NOT NULL,
  "callScriptVersion" TEXT NOT NULL,

  CONSTRAINT "GeneratedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GeneratedMessage_leadId_createdAt_idx" ON "public"."GeneratedMessage"("leadId", "createdAt");
CREATE INDEX "GeneratedMessage_auditRunId_idx" ON "public"."GeneratedMessage"("auditRunId");
CREATE INDEX "GeneratedMessage_simulatorRunId_idx" ON "public"."GeneratedMessage"("simulatorRunId");

-- AddForeignKey
ALTER TABLE "public"."GeneratedMessage" ADD CONSTRAINT "GeneratedMessage_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."GeneratedMessage" ADD CONSTRAINT "GeneratedMessage_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "public"."AuditRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."GeneratedMessage" ADD CONSTRAINT "GeneratedMessage_simulatorRunId_fkey" FOREIGN KEY ("simulatorRunId") REFERENCES "public"."SimulatorRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
