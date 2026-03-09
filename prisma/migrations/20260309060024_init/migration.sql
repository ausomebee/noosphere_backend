-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_transactionId_fkey";

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "transactionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
