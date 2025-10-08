-- CreateTable
CREATE TABLE "CompensationTypes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CompensationTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeItems" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "IncomeItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deductions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Deductions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollCycles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "compensationTypeId" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "startDate" TEXT NOT NULL,
    "autoRun" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PayrollCycles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompensationTypes" ADD CONSTRAINT "CompensationTypes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeItems" ADD CONSTRAINT "IncomeItems_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deductions" ADD CONSTRAINT "Deductions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCycles" ADD CONSTRAINT "PayrollCycles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollCycles" ADD CONSTRAINT "PayrollCycles_compensationTypeId_fkey" FOREIGN KEY ("compensationTypeId") REFERENCES "CompensationTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
