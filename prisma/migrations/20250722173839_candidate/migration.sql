/*
  Warnings:

  - Added the required column `city` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetAdress` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "streetAdress" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
