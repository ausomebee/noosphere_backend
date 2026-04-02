-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "transactionId" TEXT,
ADD COLUMN     "transactionRef" TEXT;

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "holderName" TEXT;
