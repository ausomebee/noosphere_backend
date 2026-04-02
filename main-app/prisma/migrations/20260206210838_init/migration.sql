/*
  Warnings:

  - You are about to drop the column `adminId` on the `RefreshTokens` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `RefreshTokens` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `RefreshTokens` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `RefreshTokens` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `RefreshTokens` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerType` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenOwnerType" AS ENUM ('ADMIN', 'STAFF', 'CLIENT');

-- CreateEnum
CREATE TYPE "ClientFormStatus" AS ENUM ('PENDING', 'FILLED');

-- DropForeignKey
ALTER TABLE "RefreshTokens" DROP CONSTRAINT "RefreshTokens_adminId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshTokens" DROP CONSTRAINT "RefreshTokens_clientId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshTokens" DROP CONSTRAINT "RefreshTokens_staffId_fkey";

-- AlterTable
ALTER TABLE "ClientForm" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "ClientFormStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "RefreshTokens" DROP COLUMN "adminId",
DROP COLUMN "clientId",
DROP COLUMN "created_at",
DROP COLUMN "expires_at",
DROP COLUMN "staffId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "ownerType" "TokenOwnerType" NOT NULL;
