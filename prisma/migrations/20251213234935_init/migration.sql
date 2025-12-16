/*
  Warnings:

  - A unique constraint covering the columns `[subDomain]` on the table `OrganizationInformation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subDomain` to the `OrganizationInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationInformation" ADD COLUMN     "subDomain" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationInformation_subDomain_key" ON "OrganizationInformation"("subDomain");
