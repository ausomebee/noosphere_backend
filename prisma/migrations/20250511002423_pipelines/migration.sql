/*
  Warnings:

  - You are about to drop the column `fullName` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `assignToStaff` to the `PipelineItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentDocuments` to the `PipelineItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colourCode` to the `PipelineStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documents` to the `PipelineStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companySize` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPerson` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadSource` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationType` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PipelineItem" ADD COLUMN     "assignToStaff" TEXT NOT NULL,
ADD COLUMN     "sentDocuments" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "PipelineStage" ADD COLUMN     "colourCode" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "documents" JSONB NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "fullName",
DROP COLUMN "stage",
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "companySize" TEXT NOT NULL,
ADD COLUMN     "contactPerson" TEXT NOT NULL,
ADD COLUMN     "leadSource" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "organizationType" TEXT NOT NULL;
