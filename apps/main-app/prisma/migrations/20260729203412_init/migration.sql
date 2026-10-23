-- CreateEnum
CREATE TYPE "NotificationEntityType" AS ENUM ('APPOINTMENT', 'ISSUE', 'SUBSCRIPTION', 'INVOICE', 'PAYMENT', 'TENANT', 'PLAN');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" "NotificationEntityType",
ADD COLUMN     "metadata" JSONB;

-- CreateIndex
CREATE INDEX "Notification_entityType_entityId_idx" ON "Notification"("entityType", "entityId");
