-- CreateTable
CREATE TABLE "OrganizationInformation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "practiceNPI" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "OrganizationInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationLicenses" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "licenseName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationLicenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationDocuments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationInformation_tenantId_key" ON "OrganizationInformation"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationLicenses_tenantId_key" ON "OrganizationLicenses"("tenantId");

-- AddForeignKey
ALTER TABLE "OrganizationInformation" ADD CONSTRAINT "OrganizationInformation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationLicenses" ADD CONSTRAINT "OrganizationLicenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDocuments" ADD CONSTRAINT "OrganizationDocuments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
