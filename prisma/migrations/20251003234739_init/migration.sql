-- AlterTable
ALTER TABLE "InsuranceType" ALTER COLUMN "isDeleted" SET DEFAULT false,
ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Payer" ALTER COLUMN "isDeleted" SET DEFAULT false,
ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "RoundingRules" ALTER COLUMN "isDeleted" SET DEFAULT false,
ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "ServiceCodes" ALTER COLUMN "isDeleted" SET DEFAULT false,
ALTER COLUMN "isActive" SET DEFAULT true;
