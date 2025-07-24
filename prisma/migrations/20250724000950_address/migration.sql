/*
  Warnings:

  - Added the required column `createdBy` to the `ClientTenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientTenant" ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ClientTenant" ADD CONSTRAINT "ClientTenant_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
