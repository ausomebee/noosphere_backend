-- AlterTable
ALTER TABLE "TenantStaff" ADD COLUMN     "auth2FADone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "authQuestion" TEXT,
ADD COLUMN     "authType" TEXT;

-- CreateTable
CREATE TABLE "TenantAdminChoices" (
    "id" TEXT NOT NULL,
    "Authenticator2FA" BOOLEAN NOT NULL,
    "securityQuestion" BOOLEAN NOT NULL,
    "setForAll" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantAdminChoices_pkey" PRIMARY KEY ("id")
);
