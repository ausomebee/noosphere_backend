-- CreateTable
CREATE TABLE "clientNotificationSettings" (
    "id" TEXT NOT NULL,
    "tenantClientId" TEXT NOT NULL,
    "reshedule" BOOLEAN NOT NULL,
    "starts" BOOLEAN NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "awaitingReview" BOOLEAN NOT NULL,
    "approvedReschedule" BOOLEAN NOT NULL,

    CONSTRAINT "clientNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clientNotificationSettings" ADD CONSTRAINT "clientNotificationSettings_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
