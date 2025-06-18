/*
  Warnings:

  - Added the required column `adminId` to the `IssueComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IssueComment" ADD COLUMN     "adminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
