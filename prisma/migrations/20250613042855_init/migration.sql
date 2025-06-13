/*
  Warnings:

  - The values [INACTIVE] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `amount` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingCycle` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastPaymentStatus` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('ACTIVE', 'PAUSED', 'PENDING', 'CANCELLED');
ALTER TABLE "Subscription" ALTER COLUMN "status" TYPE "SubscriptionStatus_new" USING ("status"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "SubscriptionStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "billingCycle" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastPaymentStatus" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "InvoiceManagement" (
    "id" TEXT NOT NULL,
    "onPlanPurchase" BOOLEAN NOT NULL,
    "daysBeforeDueDate" INTEGER NOT NULL,
    "upcomingInvoiceHeader" TEXT NOT NULL,
    "upcomingInvoiceBody" TEXT NOT NULL,
    "onDueDate" BOOLEAN NOT NULL,
    "dueInvoiceHeader" TEXT NOT NULL,
    "dueInvoiceBody" TEXT NOT NULL,
    "markOverDue" INTEGER NOT NULL,
    "unpaidReminderTimesBefore" INTEGER NOT NULL,
    "attachInvoiceToReminder" BOOLEAN NOT NULL,
    "reminderEmai" JSONB NOT NULL,

    CONSTRAINT "InvoiceManagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAndAccountAccess" (
    "id" TEXT NOT NULL,
    "chargeOnDueDate" BOOLEAN NOT NULL,
    "chargeLastUsedFirst" BOOLEAN NOT NULL,
    "chargeAlternative" BOOLEAN NOT NULL,
    "retryBefore" BOOLEAN NOT NULL,
    "retryAfter" BOOLEAN NOT NULL,
    "notifyTenant" BOOLEAN NOT NULL,
    "notificationEmailHeader" TEXT NOT NULL,
    "notificationEmailBody" TEXT NOT NULL,
    "cancelAfter" INTEGER NOT NULL,
    "manualCancel" BOOLEAN NOT NULL,
    "suspensionAction" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "emailAfterAttempts" INTEGER NOT NULL,
    "warningMailHeader" TEXT NOT NULL,
    "warningMailBody" TEXT NOT NULL,
    "sendOnSubscriptionCancel" BOOLEAN NOT NULL,
    "cancelMailHeader" TEXT NOT NULL,
    "cancelMailBody" TEXT NOT NULL,

    CONSTRAINT "PaymentAndAccountAccess_pkey" PRIMARY KEY ("id")
);
