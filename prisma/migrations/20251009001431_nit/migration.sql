-- CreateTable
CREATE TABLE "PayrollRecord" (
    "id" TEXT NOT NULL,
    "payrollCycleId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "noOfStaff" INTEGER NOT NULL,
    "totalValue" INTEGER NOT NULL,

    CONSTRAINT "PayrollRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PayrollRecord" ADD CONSTRAINT "PayrollRecord_payrollCycleId_fkey" FOREIGN KEY ("payrollCycleId") REFERENCES "PayrollCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
