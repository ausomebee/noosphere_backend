/*
  Warnings:

  - Added the required column `modifiers` to the `PayerServiceCodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PayerServiceCodes" ADD COLUMN     "modifiers" JSONB NOT NULL;
