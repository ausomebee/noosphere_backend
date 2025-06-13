/*
  Warnings:

  - You are about to drop the column `reminderEmai` on the `InvoiceManagement` table. All the data in the column will be lost.
  - Added the required column `reminderEmail` to the `InvoiceManagement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceManagement" DROP COLUMN "reminderEmai",
ADD COLUMN     "reminderEmail" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "reason" TEXT NOT NULL,
ALTER COLUMN "module" DROP NOT NULL,
ALTER COLUMN "ipAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "autoRenew" BOOLEAN DEFAULT true,
ADD COLUMN     "mailNotification" BOOLEAN,
ADD COLUMN     "pauseSchedule" TIMESTAMP(3),
ADD COLUMN     "resumeShedule" TIMESTAMP(3);
