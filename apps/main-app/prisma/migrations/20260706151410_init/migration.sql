-- DropForeignKey
ALTER TABLE "Teams" DROP CONSTRAINT "Teams_teamLeadId_fkey";

-- AlterTable
ALTER TABLE "Teams" ALTER COLUMN "teamLeadId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
