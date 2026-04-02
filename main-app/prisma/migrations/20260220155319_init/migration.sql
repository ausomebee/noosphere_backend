/*
  Warnings:

  - You are about to drop the column `staffId` on the `DepartmentMembers` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `DepartmentMembers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DepartmentMembers" DROP CONSTRAINT "DepartmentMembers_staffId_fkey";

-- AlterTable
ALTER TABLE "DepartmentMembers" DROP COLUMN "staffId",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DepartmentMembers" ADD CONSTRAINT "DepartmentMembers_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
