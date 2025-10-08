/*
  Warnings:

  - Changed the type of `rate` on the `Deductions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rate` on the `IncomeItems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Deductions" DROP COLUMN "rate",
ADD COLUMN     "rate" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "IncomeItems" DROP COLUMN "rate",
ADD COLUMN     "rate" JSONB NOT NULL;
