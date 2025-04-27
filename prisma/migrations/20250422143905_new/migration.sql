/*
  Warnings:

  - You are about to drop the column `password` on the `Tenant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "TenantStaff" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Billing" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingPlan" (
    "id" TEXT NOT NULL,

    CONSTRAINT "BillingPlan_pkey" PRIMARY KEY ("id")
);
