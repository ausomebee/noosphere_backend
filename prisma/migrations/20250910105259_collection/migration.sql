/*
  Warnings:

  - You are about to drop the column `clientId` on the `ClientTargetDataCollection` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `ClientTargetDataCollection` table. All the data in the column will be lost.
  - Added the required column `clientTargetId` to the `ClientTargetDataCollection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClientTargetDataCollection" DROP CONSTRAINT "ClientTargetDataCollection_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientTargetDataCollection" DROP CONSTRAINT "ClientTargetDataCollection_targetId_fkey";

-- AlterTable
ALTER TABLE "ClientTargetDataCollection" DROP COLUMN "clientId",
DROP COLUMN "targetId",
ADD COLUMN     "clientTargetId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ClientTarget" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientTarget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientTarget" ADD CONSTRAINT "ClientTarget_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTarget" ADD CONSTRAINT "ClientTarget_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTargetDataCollection" ADD CONSTRAINT "ClientTargetDataCollection_clientTargetId_fkey" FOREIGN KEY ("clientTargetId") REFERENCES "ClientTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
