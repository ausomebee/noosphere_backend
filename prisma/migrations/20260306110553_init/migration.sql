/*
  Warnings:

  - You are about to drop the column `featureId` on the `Logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_featureId_fkey";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "featureId",
ADD COLUMN     "feature" TEXT;
