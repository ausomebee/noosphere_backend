ALTER TABLE "Tenant"
ADD COLUMN "stripeCustomerId" TEXT,
ADD COLUMN "suspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "featuresDisabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "suspensionReason" TEXT,
ADD COLUMN "suspendedAt" TIMESTAMP(3);

ALTER TABLE "PaymentMethod"
ADD COLUMN "lastUsedAt" TIMESTAMP(3),
ADD COLUMN "isDefault" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Invoice"
ADD COLUMN "chargeAttemptOffsetsSent" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN "lastChargeAttemptAt" TIMESTAMP(3),
ADD COLUMN "cancellationWarningEmailedAt" TIMESTAMP(3);
