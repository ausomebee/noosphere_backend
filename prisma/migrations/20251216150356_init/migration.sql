/*
  Warnings:

  - You are about to drop the column `service` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `OrganizationSessionTypes` table. All the data in the column will be lost.
  - Added the required column `utilization` to the `ClientAuthorization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "service";

-- AlterTable
ALTER TABLE "ClientAuthorization" ADD COLUMN     "utilization" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationSessionTypes" DROP COLUMN "service";

-- CreateTable
CREATE TABLE "SessionTypeService" (
    "id" TEXT NOT NULL,
    "serviceCodeId" TEXT NOT NULL,
    "sessionTypeId" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,

    CONSTRAINT "SessionTypeService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentService" (
    "id" TEXT NOT NULL,
    "serviceCodeId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAuthorizationService" (
    "id" TEXT NOT NULL,
    "serviceCodeId" TEXT NOT NULL,
    "ClientAuthorizationId" TEXT NOT NULL,
    "modifiers" JSONB NOT NULL,

    CONSTRAINT "ClientAuthorizationService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SessionAuthorizations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SessionAuthorizations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SessionAuthorizations_B_index" ON "_SessionAuthorizations"("B");

-- AddForeignKey
ALTER TABLE "SessionTypeService" ADD CONSTRAINT "SessionTypeService_serviceCodeId_fkey" FOREIGN KEY ("serviceCodeId") REFERENCES "ServiceCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTypeService" ADD CONSTRAINT "SessionTypeService_sessionTypeId_fkey" FOREIGN KEY ("sessionTypeId") REFERENCES "OrganizationSessionTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_serviceCodeId_fkey" FOREIGN KEY ("serviceCodeId") REFERENCES "ServiceCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationService" ADD CONSTRAINT "ClientAuthorizationService_serviceCodeId_fkey" FOREIGN KEY ("serviceCodeId") REFERENCES "ServiceCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationService" ADD CONSTRAINT "ClientAuthorizationService_ClientAuthorizationId_fkey" FOREIGN KEY ("ClientAuthorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionAuthorizations" ADD CONSTRAINT "_SessionAuthorizations_A_fkey" FOREIGN KEY ("A") REFERENCES "ClientAuthorization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionAuthorizations" ADD CONSTRAINT "_SessionAuthorizations_B_fkey" FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
