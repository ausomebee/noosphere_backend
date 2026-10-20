ALTER TABLE "Invoice"
ADD COLUMN "subscriptionId" TEXT,
ADD COLUMN "billingPeriodEnd" TIMESTAMP(3),
ADD COLUMN "emailedAt" TIMESTAMP(3);

ALTER TABLE "Invoice"
ADD CONSTRAINT "Invoice_subscriptionId_fkey"
FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Invoice_subscriptionId_billingPeriodEnd_key"
ON "Invoice"("subscriptionId", "billingPeriodEnd");
