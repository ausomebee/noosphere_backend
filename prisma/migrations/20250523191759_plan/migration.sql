/*
  Warnings:

  - You are about to drop the column `billingCycle` on the `BillingPlan` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `BillingPlan` table. All the data in the column will be lost.
  - Added the required column `colourCode` to the `BillingPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forClient` to the `BillingPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forStaff` to the `BillingPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forStorage` to the `BillingPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planType` to the `BillingPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerMonth` to the `BillingPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerYear` to the `BillingPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BillingPlan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('ENTERPRISE', 'STANDARD');

-- AlterTable
ALTER TABLE "BillingPlan" DROP COLUMN "billingCycle",
DROP COLUMN "price",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "colourCode" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "extraFeaturesEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "forClient" INTEGER NOT NULL,
ADD COLUMN     "forStaff" INTEGER NOT NULL,
ADD COLUMN     "forStorage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "planType" "PlanType" NOT NULL,
ADD COLUMN     "pricePerMonth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pricePerYear" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "BillingCycle";

-- CreateTable
CREATE TABLE "_ExtraFeatures" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExtraFeatures_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ExtraFeatures_B_index" ON "_ExtraFeatures"("B");

-- AddForeignKey
ALTER TABLE "BillingPlan" ADD CONSTRAINT "BillingPlan_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingPlan" ADD CONSTRAINT "BillingPlan_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraFeatures" ADD CONSTRAINT "_ExtraFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "BillingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraFeatures" ADD CONSTRAINT "_ExtraFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
