/*
  Warnings:

  - You are about to drop the column `tenantStaffId` on the `Issue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_tenantStaffId_fkey";

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "tenantStaffId",
ADD COLUMN     "adminLoggedById" TEXT;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_adminLoggedById_fkey" FOREIGN KEY ("adminLoggedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
