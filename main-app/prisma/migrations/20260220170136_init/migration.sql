/*
  Warnings:

  - Made the column `dataAccessLevel` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "dataAccessLevel" SET NOT NULL;
