/*
  Warnings:

  - A unique constraint covering the columns `[tenantId]` on the table `TenantGeneralSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TenantGeneralSettings_tenantId_key" ON "TenantGeneralSettings"("tenantId");
