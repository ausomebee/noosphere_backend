-- AlterTable
ALTER TABLE "TenantStaff" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dob" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "npi" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zip" TEXT,
ALTER COLUMN "stage" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TenantStaffLicenses" (
    "id" TEXT NOT NULL,
    "licencseName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "tenantStaffId" TEXT NOT NULL,
    "issueState" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TenantStaffLicenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantStaffPayroll" (
    "id" TEXT NOT NULL,
    "paymentSchedule" TEXT NOT NULL,
    "ratePerHour" TEXT NOT NULL,
    "tenantStaffId" TEXT NOT NULL,
    "minimumHours" TEXT,
    "otherPays" JSONB,
    "deductions" JSONB,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TenantStaffPayroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantStaffDocuments" (
    "id" TEXT NOT NULL,
    "documentsUrl" JSONB NOT NULL,
    "tenantStaffId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TenantStaffDocuments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TenantStaffLicenses" ADD CONSTRAINT "TenantStaffLicenses_tenantStaffId_fkey" FOREIGN KEY ("tenantStaffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantStaffPayroll" ADD CONSTRAINT "TenantStaffPayroll_tenantStaffId_fkey" FOREIGN KEY ("tenantStaffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantStaffDocuments" ADD CONSTRAINT "TenantStaffDocuments_tenantStaffId_fkey" FOREIGN KEY ("tenantStaffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
