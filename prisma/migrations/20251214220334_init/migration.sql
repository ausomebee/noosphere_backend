/*
  Warnings:

  - You are about to drop the column `password` on the `Client` table. All the data in the column will be lost.
  - Added the required column `password` to the `ClientTenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "ClientTenant" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "passwordChanged" BOOLEAN NOT NULL DEFAULT false;
