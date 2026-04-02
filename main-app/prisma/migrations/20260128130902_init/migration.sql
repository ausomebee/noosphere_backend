-- CreateTable
CREATE TABLE "TenantGeneralSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dateFormat" TEXT NOT NULL,
    "timeFormat" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantGeneralSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantAdditionalSecurityQuestions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantAdditionalSecurityQuestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TenantGeneralSettings" ADD CONSTRAINT "TenantGeneralSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantAdditionalSecurityQuestions" ADD CONSTRAINT "TenantAdditionalSecurityQuestions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
