/*
  Warnings:

  - You are about to drop the column `ClientAuthorizationId` on the `ClientAuthorizationService` table. All the data in the column will be lost.
  - Added the required column `clientAuthorizationId` to the `ClientAuthorizationService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClientAuthorizationService" DROP CONSTRAINT "ClientAuthorizationService_ClientAuthorizationId_fkey";

-- AlterTable
ALTER TABLE "ClientAuthorizationService" DROP COLUMN "ClientAuthorizationId",
ADD COLUMN     "clientAuthorizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationService" ADD CONSTRAINT "ClientAuthorizationService_clientAuthorizationId_fkey" FOREIGN KEY ("clientAuthorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
