/*
  Warnings:

  - You are about to drop the column `access` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FeatureModule" AS ENUM ('DASHBOARD', 'SCHEDULER', 'CLIENTS', 'MY_ORGANIZATION', 'BILLINGS_PAYMENTS', 'PAYROLL', 'PROGRAM_LIBRARY', 'CUSTOM_FORMS', 'REPORTS', 'HELP_SUPPORT', 'SETTINGS');

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_createdByAdminId_fkey";

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_createdByTenantId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_departmentId_fkey";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "access",
DROP COLUMN "departmentId",
DROP COLUMN "description",
ADD COLUMN     "createdByAdminId" TEXT,
ADD COLUMN     "createdByTenantId" TEXT,
ADD COLUMN     "dataAccessLevel" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "systemModule" "Module";

-- DropTable
DROP TABLE "Department";

-- CreateTable
CREATE TABLE "RoleModuleAccess" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "module" "FeatureModule" NOT NULL,
    "permissions" JSONB[],

    CONSTRAINT "RoleModuleAccess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdByTenantId_fkey" FOREIGN KEY ("createdByTenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleModuleAccess" ADD CONSTRAINT "RoleModuleAccess_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
