-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "clinicians" JSONB NOT NULL,
    "service" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "recurrence" JSONB NOT NULL,
    "isBillable" BOOLEAN NOT NULL,
    "serviceLocation" TEXT NOT NULL,
    "requiresTravel" BOOLEAN NOT NULL,
    "colourCode" TEXT NOT NULL,
    "relatedAppointment" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OrganizationSessionTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_relatedAppointment_fkey" FOREIGN KEY ("relatedAppointment") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
