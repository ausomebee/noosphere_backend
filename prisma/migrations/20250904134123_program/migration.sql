/*
  Warnings:

  - Added the required column `attachment` to the `Target` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialStatus` to the `Target` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Target` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `promptingStrategy` on the `Target` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Target" ADD COLUMN     "attachment" TEXT NOT NULL,
ADD COLUMN     "initialStatus" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL,
DROP COLUMN "promptingStrategy",
ADD COLUMN     "promptingStrategy" JSONB NOT NULL;
