/*
  Warnings:

  - You are about to drop the `PayrolCycleStaffs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PayrolCycleStaffs" DROP CONSTRAINT "PayrolCycleStaffs_payrollCycleId_fkey";

-- DropForeignKey
ALTER TABLE "PayrolCycleStaffs" DROP CONSTRAINT "PayrolCycleStaffs_staffId_fkey";

-- DropTable
DROP TABLE "PayrolCycleStaffs";

-- CreateTable
CREATE TABLE "PayrollCycleStaffs" (
    "id" TEXT NOT NULL,
    "payrollCycleId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "PayrollCycleStaffs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PayrollCycleStaffs" ADD CONSTRAINT "PayrollCycleStaffs_payrollCycleId_fkey" FOREIGN KEY ("payrollCycleId") REFERENCES "PayrollCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCycleStaffs" ADD CONSTRAINT "PayrollCycleStaffs_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
