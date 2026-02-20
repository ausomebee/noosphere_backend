/*
  Warnings:

  - The `compensationType` column on the `PayrollCycles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentSchedule` column on the `TenantStaffPayroll` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `PayrollRecord` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `dataAccessLevel` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `systemModule` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PaymentSchedule" AS ENUM ('MONTHLY', 'HOURLY', 'WEEKLY');

-- DropForeignKey
ALTER TABLE "PayrollRecord" DROP CONSTRAINT "PayrollRecord_payrollCycleId_fkey";

-- AlterTable
ALTER TABLE "PayrollCycleStaffs" ADD COLUMN     "minimumHours" TEXT,
ADD COLUMN     "paymentSchedule" "PaymentSchedule" NOT NULL DEFAULT 'HOURLY',
ADD COLUMN     "ratePerHour" TEXT NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE "PayrollCycles" DROP COLUMN "compensationType",
ADD COLUMN     "compensationType" "PaymentSchedule";

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "dataAccessLevel" SET NOT NULL,
ALTER COLUMN "systemModule" SET NOT NULL;

-- AlterTable
ALTER TABLE "TenantStaffPayroll" DROP COLUMN "paymentSchedule",
ADD COLUMN     "paymentSchedule" "PaymentSchedule";

-- DropTable
DROP TABLE "PayrollRecord";

-- CreateTable
CREATE TABLE "PayrollCycleStaffIncomeItems" (
    "id" TEXT NOT NULL,
    "payrollCycleStaffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" JSONB NOT NULL,

    CONSTRAINT "PayrollCycleStaffIncomeItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollCycleStaffDeductions" (
    "id" TEXT NOT NULL,
    "payrollCycleStaffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" JSONB NOT NULL,

    CONSTRAINT "PayrollCycleStaffDeductions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PayrollCycleStaffIncomeItems" ADD CONSTRAINT "PayrollCycleStaffIncomeItems_payrollCycleStaffId_fkey" FOREIGN KEY ("payrollCycleStaffId") REFERENCES "PayrollCycleStaffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCycleStaffDeductions" ADD CONSTRAINT "PayrollCycleStaffDeductions_payrollCycleStaffId_fkey" FOREIGN KEY ("payrollCycleStaffId") REFERENCES "PayrollCycleStaffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
