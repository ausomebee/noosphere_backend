-- CreateTable
CREATE TABLE "ClientForm" (
    "id" TEXT NOT NULL,
    "tenantClientId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientForm_tenantClientId_formId_key" ON "ClientForm"("tenantClientId", "formId");

-- AddForeignKey
ALTER TABLE "ClientForm" ADD CONSTRAINT "ClientForm_tenantClientId_fkey" FOREIGN KEY ("tenantClientId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientForm" ADD CONSTRAINT "ClientForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
