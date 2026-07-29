-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationEntityType" ADD VALUE 'CLIENT';
ALTER TYPE "NotificationEntityType" ADD VALUE 'DOCUMENT_REQUEST';
ALTER TYPE "NotificationEntityType" ADD VALUE 'FORM';
ALTER TYPE "NotificationEntityType" ADD VALUE 'AUTHORIZATION';
ALTER TYPE "NotificationEntityType" ADD VALUE 'CLINICAL_REPORT';
ALTER TYPE "NotificationEntityType" ADD VALUE 'LICENSE';
ALTER TYPE "NotificationEntityType" ADD VALUE 'TIMESHEET';
ALTER TYPE "NotificationEntityType" ADD VALUE 'PAYER';
ALTER TYPE "NotificationEntityType" ADD VALUE 'PAYROLL';
