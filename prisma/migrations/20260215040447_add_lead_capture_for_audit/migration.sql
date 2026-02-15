-- AlterTable
ALTER TABLE "public"."Lead" ADD COLUMN     "auditReport" JSONB,
ADD COLUMN     "consentWeekly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "pagePath" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "public"."Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "public"."Lead"("source");
