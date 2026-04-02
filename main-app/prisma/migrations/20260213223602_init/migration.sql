-- DropForeignKey
ALTER TABLE "TimesheetHistory" DROP CONSTRAINT "TimesheetHistory_createdBy_fkey";

-- AlterTable
ALTER TABLE "TimesheetHistory" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TimesheetHistory" ADD CONSTRAINT "TimesheetHistory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
