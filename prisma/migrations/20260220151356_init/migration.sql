-- DropForeignKey
ALTER TABLE "Teams" DROP CONSTRAINT "Teams_teamLeadId_fkey";

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
