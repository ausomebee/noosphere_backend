/*
  Warnings:

  - You are about to drop the column `active` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `Client` table. All the data in the column will be lost.
  - Added the required column `password` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage` to the `ClientTenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "active",
DROP COLUMN "stage",
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClientTenant" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stage" TEXT NOT NULL;
