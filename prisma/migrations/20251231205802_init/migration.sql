-- CreateTable
CREATE TABLE "ClientFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientTenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientFiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "fileType" TEXT NOT NULL,
    "folderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientFiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientFolder" ADD CONSTRAINT "ClientFolder_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "ClientTenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientFiles" ADD CONSTRAINT "ClientFiles_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "ClientFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientFiles" ADD CONSTRAINT "ClientFiles_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "TenantStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
