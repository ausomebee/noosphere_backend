-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "StaffAvailability" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "StaffAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityDays" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "WeekDay" NOT NULL,
    "available" BOOLEAN NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "availabilityId" TEXT NOT NULL,

    CONSTRAINT "AvailabilityDays_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StaffAvailability" ADD CONSTRAINT "StaffAvailability_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "TenantStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityDays" ADD CONSTRAINT "AvailabilityDays_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "StaffAvailability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
