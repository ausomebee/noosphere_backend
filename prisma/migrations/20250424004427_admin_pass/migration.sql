-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "administratorPassword" TEXT;

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "stage" SET DEFAULT 'DEFAULT';
