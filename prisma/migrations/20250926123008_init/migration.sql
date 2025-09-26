/*
  Warnings:

  - You are about to drop the column `clinicians` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "clinicians";

-- CreateTable
CREATE TABLE "_AppointmentClinicians" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AppointmentClinicians_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AppointmentClinicians_B_index" ON "_AppointmentClinicians"("B");

-- AddForeignKey
ALTER TABLE "_AppointmentClinicians" ADD CONSTRAINT "_AppointmentClinicians_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentClinicians" ADD CONSTRAINT "_AppointmentClinicians_B_fkey" FOREIGN KEY ("B") REFERENCES "TenantStaff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
