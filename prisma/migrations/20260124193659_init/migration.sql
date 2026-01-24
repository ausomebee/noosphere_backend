-- CreateTable
CREATE TABLE "ClinicalReportChangeRequest" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "clinicalReportId" TEXT NOT NULL,
    "clientTenantId" TEXT,
    "approverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalReportChangeRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClinicalReportChangeRequest" ADD CONSTRAINT "ClinicalReportChangeRequest_clinicalReportId_fkey" FOREIGN KEY ("clinicalReportId") REFERENCES "ClinicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportChangeRequest" ADD CONSTRAINT "ClinicalReportChangeRequest_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "ClientTenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalReportChangeRequest" ADD CONSTRAINT "ClinicalReportChangeRequest_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
