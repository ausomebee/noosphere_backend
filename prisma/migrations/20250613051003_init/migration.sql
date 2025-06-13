/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_transactionId_fkey";

-- DropIndex
DROP INDEX "Subscription_transactionId_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "transactionId";
