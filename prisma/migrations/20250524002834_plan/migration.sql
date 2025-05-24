/*
  Warnings:

  - You are about to drop the column `applicablePlans` on the `Feature` table. All the data in the column will be lost.
  - Changed the type of `pricePerMonth` on the `BillingPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pricePerYear` on the `BillingPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BillingPlan" ADD COLUMN     "extraFeaturesWithPrice" JSONB,
DROP COLUMN "pricePerMonth",
ADD COLUMN     "pricePerMonth" JSONB NOT NULL,
DROP COLUMN "pricePerYear",
ADD COLUMN     "pricePerYear" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "applicablePlans";
