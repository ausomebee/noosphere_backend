-- CreateTable
CREATE TABLE "ServiceCodes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "ServiceCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoundingRules" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "standardUnit" INTEGER NOT NULL,
    "roundingRule" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "RoundingRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceType" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "InsuranceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payer" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "payerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "insuranceTypeId" TEXT NOT NULL,
    "tplCode" TEXT NOT NULL,
    "carrierPayerId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "serviceCodes" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Payer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayerServiceCodes" (
    "id" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    "serviceCodeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unitCurrency" TEXT NOT NULL,
    "ratePerUnit" TEXT NOT NULL,
    "roundingRuleId" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,
    "billable" BOOLEAN NOT NULL,

    CONSTRAINT "PayerServiceCodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceCodes" ADD CONSTRAINT "ServiceCodes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundingRules" ADD CONSTRAINT "RoundingRules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceType" ADD CONSTRAINT "InsuranceType_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payer" ADD CONSTRAINT "Payer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payer" ADD CONSTRAINT "Payer_insuranceTypeId_fkey" FOREIGN KEY ("insuranceTypeId") REFERENCES "InsuranceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayerServiceCodes" ADD CONSTRAINT "PayerServiceCodes_serviceCodeId_fkey" FOREIGN KEY ("serviceCodeId") REFERENCES "ServiceCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayerServiceCodes" ADD CONSTRAINT "PayerServiceCodes_roundingRuleId_fkey" FOREIGN KEY ("roundingRuleId") REFERENCES "RoundingRules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayerServiceCodes" ADD CONSTRAINT "PayerServiceCodes_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "Payer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
