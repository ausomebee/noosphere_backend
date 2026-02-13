-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "clientRescheduleAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "clientRescheduleRejected" BOOLEAN NOT NULL DEFAULT false;
