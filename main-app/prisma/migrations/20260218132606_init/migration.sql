-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "isCustom" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Target" ADD COLUMN     "isCustom" BOOLEAN NOT NULL DEFAULT false;
