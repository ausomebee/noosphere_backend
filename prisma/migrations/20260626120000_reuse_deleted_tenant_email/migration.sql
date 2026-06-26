-- Release tenant and tenant staff emails when records are soft-deleted.
-- Prisma cannot model PostgreSQL partial indexes directly, so these indexes
-- are maintained with SQL migrations.

UPDATE "TenantStaff"
SET "isDeleted" = true,
    "active" = false
WHERE "tenantId" IN (
    SELECT "id"
    FROM "Tenant"
    WHERE "isDeleted" = true
);

DROP INDEX IF EXISTS "Tenant_email_key";
DROP INDEX IF EXISTS "TenantStaff_email_key";

CREATE UNIQUE INDEX "Tenant_email_key"
ON "Tenant"("email")
WHERE "isDeleted" = false;

CREATE UNIQUE INDEX "TenantStaff_email_key"
ON "TenantStaff"("email")
WHERE "isDeleted" = false;
