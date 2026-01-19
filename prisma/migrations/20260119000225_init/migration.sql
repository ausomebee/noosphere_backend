-- CreateTable
CREATE TABLE "ClinicalReportTemplates" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalReportTemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReportTemplateSection" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "ClinicalReportTemplateSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientTenantId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "approverId" TEXT,
    "tenantId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReportSection" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "clinicalReportId" TEXT NOT NULL,

    CONSTRAINT "ClinicalReportSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalReportHistory" (
    "id" TEXT NOT NULL,
    "clinicalReportId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalReportHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClinicalReportTemplates" ADD CONSTRAINT "ClinicalReportTemplates_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportTemplateSection" ADD CONSTRAINT "ClinicalReportTemplateSection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ClinicalReportTemplates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReport" ADD CONSTRAINT "ClinicalReport_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReport" ADD CONSTRAINT "ClinicalReport_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReport" ADD CONSTRAINT "ClinicalReport_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReport" ADD CONSTRAINT "ClinicalReport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportSection" ADD CONSTRAINT "ClinicalReportSection_clinicalReportId_fkey" FOREIGN KEY ("clinicalReportId") REFERENCES "ClinicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportHistory" ADD CONSTRAINT "ClinicalReportHistory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportHistory" ADD CONSTRAINT "ClinicalReportHistory_clinicalReportId_fkey" FOREIGN KEY ("clinicalReportId") REFERENCES "ClinicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
