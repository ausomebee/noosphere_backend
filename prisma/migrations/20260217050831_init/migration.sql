-- CreateTable
CREATE TABLE "PayrolCycleStaffs" (
    "id" TEXT NOT NULL,
    "payrollCycleId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "PayrolCycleStaffs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PayrolCycleStaffs" ADD CONSTRAINT "PayrolCycleStaffs_payrollCycleId_fkey" FOREIGN KEY ("payrollCycleId") REFERENCES "PayrollCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrolCycleStaffs" ADD CONSTRAINT "PayrolCycleStaffs_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
