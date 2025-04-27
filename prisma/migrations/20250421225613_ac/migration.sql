/*
  Warnings:

  - Changed the type of `DOB` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "DOB",
ADD COLUMN     "DOB" TIMESTAMP(3) NOT NULL;
