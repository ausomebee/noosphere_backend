-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "cancelTime" TIMESTAMP(3),
ADD COLUMN     "canceledBy" TEXT,
ADD COLUMN     "rescheduleRejected" BOOLEAN NOT NULL DEFAULT false;
