-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FeatureModule" ADD VALUE 'TENANT';
ALTER TYPE "FeatureModule" ADD VALUE 'BILLING';
ALTER TYPE "FeatureModule" ADD VALUE 'ISSUE_MANAGEMENT';
ALTER TYPE "FeatureModule" ADD VALUE 'FEATURE_MANAGEMENT';
