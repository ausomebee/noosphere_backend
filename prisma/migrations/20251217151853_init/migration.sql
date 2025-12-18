/*
  Warnings:

  - You are about to drop the column `utilization` on the `ClientAuthorization` table. All the data in the column will be lost.
  - Added the required column `usedUnit` to the `ClientAuthorizationService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientAuthorization" DROP COLUMN "utilization";

-- AlterTable
ALTER TABLE "ClientAuthorizationService" ADD COLUMN     "usedUnit" INTEGER NOT NULL;
