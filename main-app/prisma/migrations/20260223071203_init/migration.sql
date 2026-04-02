-- CreateTable
CREATE TABLE "TenantDeactivation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "deactivatedById" TEXT NOT NULL,
    "deactivatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reactivationDate" TIMESTAMP(3),

    CONSTRAINT "TenantDeactivation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantDeactivation_tenantId_key" ON "TenantDeactivation"("tenantId");

-- AddForeignKey
ALTER TABLE "TenantDeactivation" ADD CONSTRAINT "TenantDeactivation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantDeactivation" ADD CONSTRAINT "TenantDeactivation_deactivatedById_fkey" FOREIGN KEY ("deactivatedById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
