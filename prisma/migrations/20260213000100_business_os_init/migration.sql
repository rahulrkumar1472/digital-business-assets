-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."ScanStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebsiteScan" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" "public"."ScanStatus" NOT NULL DEFAULT 'QUEUED',
    "websiteUrl" TEXT NOT NULL,
    "concern" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "scores" JSONB,
    "insights" JSONB,
    "recommendations" JSONB,
    "reportPath" TEXT,
    "rawResult" JSONB,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "public"."Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_businessName_idx" ON "public"."Lead"("businessName");

-- CreateIndex
CREATE INDEX "WebsiteScan_leadId_idx" ON "public"."WebsiteScan"("leadId");

-- CreateIndex
CREATE INDEX "WebsiteScan_status_idx" ON "public"."WebsiteScan"("status");

-- CreateIndex
CREATE INDEX "WebsiteScan_createdAt_idx" ON "public"."WebsiteScan"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."WebsiteScan" ADD CONSTRAINT "WebsiteScan_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

