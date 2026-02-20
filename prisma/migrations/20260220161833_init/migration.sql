/*
  Warnings:

  - The `dataAccessLevel` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DataAccessLevel" AS ENUM ('GLOBAL', 'INDIVIDUAL', 'TEAM');

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "dataAccessLevel",
ADD COLUMN     "dataAccessLevel" "DataAccessLevel";
