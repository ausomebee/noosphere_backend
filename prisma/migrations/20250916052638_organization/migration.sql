-- CreateTable
CREATE TABLE "OrganizationDiagnosisCodes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "OrganizationDiagnosisCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSessionTypes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "service" JSONB NOT NULL,
    "staffRolesAllowed" JSONB NOT NULL,
    "locationsAllowed" JSONB NOT NULL,
    "defaultDuration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isBillable" BOOLEAN NOT NULL,

    CONSTRAINT "OrganizationSessionTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizationDiagnosisCodes" ADD CONSTRAINT "OrganizationDiagnosisCodes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSessionTypes" ADD CONSTRAINT "OrganizationSessionTypes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
