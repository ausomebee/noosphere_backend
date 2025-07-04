/*
  Warnings:

  - A unique constraint covering the columns `[tenantId]` on the table `TenantAdminChoices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `TenantAdminChoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TenantAdminChoices" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TenantAdminChoices_tenantId_key" ON "TenantAdminChoices"("tenantId");

-- AddForeignKey
ALTER TABLE "TenantAdminChoices" ADD CONSTRAINT "TenantAdminChoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
