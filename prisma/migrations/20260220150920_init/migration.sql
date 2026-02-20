/*
  Warnings:

  - The values [MONTHLY,WEEKLY] on the enum `PaymentSchedule` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `paymentSchedule` on table `TenantStaffPayroll` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentSchedule_new" AS ENUM ('SALARIED', 'HOURLY', 'DAILY');
ALTER TABLE "public"."PayrollCycleStaffs" ALTER COLUMN "paymentSchedule" DROP DEFAULT;
ALTER TABLE "TenantStaffPayroll" ALTER COLUMN "paymentSchedule" TYPE "PaymentSchedule_new" USING ("paymentSchedule"::text::"PaymentSchedule_new");
ALTER TABLE "PayrollCycles" ALTER COLUMN "compensationType" TYPE "PaymentSchedule_new" USING ("compensationType"::text::"PaymentSchedule_new");
ALTER TABLE "PayrollCycleStaffs" ALTER COLUMN "paymentSchedule" TYPE "PaymentSchedule_new" USING ("paymentSchedule"::text::"PaymentSchedule_new");
ALTER TYPE "PaymentSchedule" RENAME TO "PaymentSchedule_old";
ALTER TYPE "PaymentSchedule_new" RENAME TO "PaymentSchedule";
DROP TYPE "public"."PaymentSchedule_old";
COMMIT;

-- AlterTable
ALTER TABLE "PayrollCycleStaffs" ALTER COLUMN "paymentSchedule" DROP DEFAULT,
ALTER COLUMN "ratePerHour" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TenantStaffPayroll" ALTER COLUMN "paymentSchedule" SET NOT NULL;

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdByAdminId" TEXT,
    "teamLeadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentMembers" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "DepartmentMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teamLeadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMembers" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "TeamMembers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMembers" ADD CONSTRAINT "DepartmentMembers_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMembers" ADD CONSTRAINT "DepartmentMembers_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMembers" ADD CONSTRAINT "TeamMembers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMembers" ADD CONSTRAINT "TeamMembers_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
