/*
  Warnings:

  - Changed the type of `retryBefore` on the `PaymentAndAccountAccess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `retryAfter` on the `PaymentAndAccountAccess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "issueId" TEXT,
ADD COLUMN     "subscriptionId" TEXT;

-- AlterTable
ALTER TABLE "PaymentAndAccountAccess" DROP COLUMN "retryBefore",
ADD COLUMN     "retryBefore" INTEGER NOT NULL,
DROP COLUMN "retryAfter",
ADD COLUMN     "retryAfter" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tenantStaffId" TEXT,
    "status" TEXT NOT NULL,
    "resolutionDeadline" TIMESTAMP(3) NOT NULL,
    "attachments" JSONB NOT NULL,
    "description" TEXT NOT NULL,
    "resolutionDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueComment" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_tenantStaffId_fkey" FOREIGN KEY ("tenantStaffId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
