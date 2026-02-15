-- CreateTable
CREATE TABLE "public"."AutomationTask" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AutomationTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AutomationTask_leadId_createdAt_idx" ON "public"."AutomationTask"("leadId", "createdAt");
CREATE INDEX "AutomationTask_status_idx" ON "public"."AutomationTask"("status");

-- AddForeignKey
ALTER TABLE "public"."AutomationTask" ADD CONSTRAINT "AutomationTask_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
