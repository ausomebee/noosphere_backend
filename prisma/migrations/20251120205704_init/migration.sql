/*
  Warnings:

  - You are about to drop the column `fullName` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `documents` on the `PipelineStage` table. All the data in the column will be lost.
  - You are about to drop the column `tasks` on the `PipelineStage` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "fullName",
ADD COLUMN     "caregiverCity" TEXT,
ADD COLUMN     "caregiverCountry" TEXT,
ADD COLUMN     "caregiverEmail" TEXT,
ADD COLUMN     "caregiverName" TEXT,
ADD COLUMN     "caregiverPhone" TEXT,
ADD COLUMN     "caregiverRelationship" TEXT,
ADD COLUMN     "caregiverState" TEXT,
ADD COLUMN     "caregiverStreetAddress" TEXT,
ADD COLUMN     "caregiverZip" TEXT,
ADD COLUMN     "documents" JSONB,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "preferredName" TEXT,
ADD COLUMN     "primaryPayer" TEXT,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "zipCode" DROP NOT NULL,
ALTER COLUMN "streetAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PipelineStage" DROP COLUMN "documents",
DROP COLUMN "tasks";
