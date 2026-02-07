/*
  Warnings:

  - You are about to drop the column `dueDate` on the `ClientForm` table. All the data in the column will be lost.
  - Added the required column `clientTenantId` to the `ClientFiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientFiles" ADD COLUMN     "clientTenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClientForm" DROP COLUMN "dueDate";

-- AddForeignKey
ALTER TABLE "ClientFiles" ADD CONSTRAINT "ClientFiles_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
