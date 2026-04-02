/*
  Warnings:

  - You are about to drop the column `compensationTypeId` on the `PayrollCycles` table. All the data in the column will be lost.
  - Added the required column `compensationType` to the `PayrollCycles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PayrollCycles" DROP CONSTRAINT "PayrollCycles_compensationTypeId_fkey";

-- AlterTable
ALTER TABLE "PayrollCycles" DROP COLUMN "compensationTypeId",
ADD COLUMN     "compensationType" TEXT NOT NULL;
