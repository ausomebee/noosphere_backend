-- CreateEnum
CREATE TYPE "RescheduleRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "AppointmentRescheduleRequest" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "reasonForReschedule" TEXT,
    "requestedByType" TEXT NOT NULL,
    "requestedById" TEXT,
    "status" "RescheduleRequestStatus" NOT NULL DEFAULT 'PENDING',
    "respondedByType" TEXT,
    "respondedById" TEXT,
    "respondedAt" TIMESTAMP(3),
    "newAppointmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentRescheduleRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentRescheduleRequest_newAppointmentId_key" ON "AppointmentRescheduleRequest"("newAppointmentId");

-- AddForeignKey
ALTER TABLE "AppointmentRescheduleRequest" ADD CONSTRAINT "AppointmentRescheduleRequest_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentRescheduleRequest" ADD CONSTRAINT "AppointmentRescheduleRequest_newAppointmentId_fkey" FOREIGN KEY ("newAppointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
