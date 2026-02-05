/*
  Warnings:

  - You are about to drop the column `deductions` on the `TenantStaffPayroll` table. All the data in the column will be lost.
  - You are about to drop the column `otherPays` on the `TenantStaffPayroll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TenantStaffPayroll" DROP COLUMN "deductions",
DROP COLUMN "otherPays";

-- CreateTable
CREATE TABLE "RefreshTokens" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "staffId" TEXT,
    "clientId" TEXT,
    "tokenHash" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PayrollIncomItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PayrollIncomItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PayrollDeductions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PayrollDeductions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PayrollIncomItems_B_index" ON "_PayrollIncomItems"("B");

-- CreateIndex
CREATE INDEX "_PayrollDeductions_B_index" ON "_PayrollDeductions"("B");

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollIncomItems" ADD CONSTRAINT "_PayrollIncomItems_A_fkey" FOREIGN KEY ("A") REFERENCES "IncomeItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollIncomItems" ADD CONSTRAINT "_PayrollIncomItems_B_fkey" FOREIGN KEY ("B") REFERENCES "TenantStaffPayroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollDeductions" ADD CONSTRAINT "_PayrollDeductions_A_fkey" FOREIGN KEY ("A") REFERENCES "Deductions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollDeductions" ADD CONSTRAINT "_PayrollDeductions_B_fkey" FOREIGN KEY ("B") REFERENCES "TenantStaffPayroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
