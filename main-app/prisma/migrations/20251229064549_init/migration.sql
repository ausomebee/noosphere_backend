/*
  Warnings:

  - You are about to drop the column `subDomain` on the `OrganizationInformation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subdomain]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "OrganizationInformation_subDomain_key";

-- AlterTable
ALTER TABLE "OrganizationInformation" DROP COLUMN "subDomain";

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "subdomain" TEXT NOT NULL DEFAULT 'ab';

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_subdomain_key" ON "Tenant"("subdomain");
