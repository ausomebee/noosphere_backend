/*
  Warnings:

  - You are about to drop the `Notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_teanantClientId_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_tenantStaffId_fkey";

-- DropTable
DROP TABLE "Notifications";

-- CreateTable
CREATE TABLE "ServerRequest" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "adminId" TEXT,
    "tenantStaffId" TEXT,
    "tenantClientId" TEXT,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServerRequest" ADD CONSTRAINT "ServerRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerRequest" ADD CONSTRAINT "ServerRequest_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerRequest" ADD CONSTRAINT "ServerRequest_tenantStaffId_fkey" FOREIGN KEY ("tenantStaffId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerRequest" ADD CONSTRAINT "ServerRequest_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
