/*
  Warnings:

  - You are about to drop the column `code` on the `PayerServiceCodes` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `PayerServiceCodes` table. All the data in the column will be lost.
  - You are about to drop the column `modifiers` on the `PayerServiceCodes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PayerServiceCodes" DROP COLUMN "code",
DROP COLUMN "description",
DROP COLUMN "modifiers";
