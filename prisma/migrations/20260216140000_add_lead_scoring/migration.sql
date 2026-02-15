-- AlterTable
ALTER TABLE "public"."Lead"
  ADD COLUMN "leadScore" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "leadTemperature" TEXT NOT NULL DEFAULT 'cold';

-- CreateIndex
CREATE INDEX "Lead_leadScore_idx" ON "public"."Lead"("leadScore");
CREATE INDEX "Lead_leadTemperature_idx" ON "public"."Lead"("leadTemperature");
