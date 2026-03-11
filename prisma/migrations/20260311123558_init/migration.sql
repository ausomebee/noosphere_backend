/*
  Warnings:

  - You are about to drop the `clientNotificationSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "clientNotificationSettings" DROP CONSTRAINT "clientNotificationSettings_tenantClientId_fkey";

-- DropTable
DROP TABLE "clientNotificationSettings";

-- CreateTable
CREATE TABLE "TenantNotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientNotificationSettings" (
    "id" TEXT NOT NULL,
    "tenantClientId" TEXT NOT NULL,
    "appointmentScheduled" BOOLEAN NOT NULL DEFAULT true,
    "appointmentRescheduled" BOOLEAN NOT NULL DEFAULT true,
    "appointmentAboutToStart" BOOLEAN NOT NULL DEFAULT true,
    "appointmentStarted" BOOLEAN NOT NULL DEFAULT true,
    "appointmentCancelled" BOOLEAN NOT NULL DEFAULT true,
    "appointmentCompletedAwaitingFeedback" BOOLEAN NOT NULL DEFAULT true,
    "documentRequested" BOOLEAN NOT NULL DEFAULT true,
    "formShared" BOOLEAN NOT NULL DEFAULT true,
    "authorizationAboutToExpire" BOOLEAN NOT NULL DEFAULT true,
    "authorizationExpired" BOOLEAN NOT NULL DEFAULT true,
    "authorizationUnitsAlmostExhausted" BOOLEAN NOT NULL DEFAULT true,
    "authorizationUnitsExhausted" BOOLEAN NOT NULL DEFAULT true,
    "signatureRequested" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantNotificationSettings_userId_key" ON "TenantNotificationSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientNotificationSettings_tenantClientId_key" ON "ClientNotificationSettings"("tenantClientId");

-- AddForeignKey
ALTER TABLE "TenantNotificationSettings" ADD CONSTRAINT "TenantNotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientNotificationSettings" ADD CONSTRAINT "ClientNotificationSettings_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
