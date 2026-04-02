/*
  Warnings:

  - You are about to drop the column `fullName` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT 'jhc',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT 'hd';
