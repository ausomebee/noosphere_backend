/*
  Warnings:

  - Added the required column `billingFrequency` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "incoiceBillingFrequency" AS ENUM ('Monthly', 'Yearly');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "billingFrequency" "incoiceBillingFrequency" NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;
