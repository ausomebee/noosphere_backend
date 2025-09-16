/*
  Warnings:

  - You are about to drop the column `issueDate` on the `OrganizationLicenses` table. All the data in the column will be lost.
  - Added the required column `issueState` to the `OrganizationLicenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationLicenses" DROP COLUMN "issueDate",
ADD COLUMN     "issueState" TEXT NOT NULL;
