-- AlterTable
ALTER TABLE "ClinicalReportSection" ALTER COLUMN "order" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ClinicalReportVersion" (
    "id" TEXT NOT NULL,
    "clinicalReportId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalReportVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClinicalReportVersion" ADD CONSTRAINT "ClinicalReportVersion_clinicalReportId_fkey" FOREIGN KEY ("clinicalReportId") REFERENCES "ClinicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
