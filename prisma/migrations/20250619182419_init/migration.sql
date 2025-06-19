-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_adminId_fkey";

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "adminId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
