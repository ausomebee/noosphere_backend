/*
  Warnings:

  - You are about to drop the column `description` on the `PipelineItemCustomDocument` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `PipelineItemCustomDocument` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `PipelineItemCustomDocument` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PipelineItemCustomDocument" DROP COLUMN "description",
DROP COLUMN "fileUrl",
DROP COLUMN "isVerified";
