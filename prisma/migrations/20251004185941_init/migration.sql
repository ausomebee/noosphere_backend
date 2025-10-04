/*
  Warnings:

  - Changed the type of `ratePerUnit` on the `PayerServiceCodes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PayerServiceCodes" DROP COLUMN "ratePerUnit",
ADD COLUMN     "ratePerUnit" INTEGER NOT NULL;
