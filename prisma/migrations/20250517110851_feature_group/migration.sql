/*
  Warnings:

  - Added the required column `managedBy` to the `Feature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "managedBy" TEXT NOT NULL;
