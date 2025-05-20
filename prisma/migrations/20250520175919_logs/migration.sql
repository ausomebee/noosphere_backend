-- CreateTable
CREATE TABLE "Logs" (
    "logId" TEXT NOT NULL,
    "tenantId" TEXT,
    "clientId" TEXT,
    "adminId" TEXT,
    "featureId" TEXT,
    "module" "Module" NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("logId")
);

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE SET NULL ON UPDATE CASCADE;
