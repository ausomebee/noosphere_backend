/*
  Warnings:

  - The `status` column on the `ClinicalReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ClinicalReportStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'SIGNED', 'APPROVED', 'AWAITING_SIGNATURE', 'CHANGES_REQUESTED');

-- AlterTable
ALTER TABLE "ClinicalReport" DROP COLUMN "status",
ADD COLUMN     "status" "ClinicalReportStatus" NOT NULL DEFAULT 'DRAFT';
