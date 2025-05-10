/*
  Warnings:

  - Added the required column `stage` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PipelineItem" ALTER COLUMN "doneTasks" DROP NOT NULL,
ALTER COLUMN "sentDocuments" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "stage" TEXT NOT NULL;
