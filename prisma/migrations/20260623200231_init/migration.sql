-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_roleId_fkey";

-- AlterTable
ALTER TABLE "Forms" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
