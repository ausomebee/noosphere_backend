/*
  Warnings:

  - You are about to drop the column `licencseName` on the `TenantStaffLicenses` table. All the data in the column will be lost.
  - Added the required column `licenseName` to the `TenantStaffLicenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TenantStaffLicenses" DROP COLUMN "licencseName",
ADD COLUMN     "licenseName" TEXT NOT NULL;
