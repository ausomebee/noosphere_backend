class Appointment {
    constructor({
        id,
        clientId,
        sessionId,
        clinicians,
        date,
        isRecurring,
        startTime,
        endTime,
        recurrence,
        isBillable,
        serviceLocation,
        requiresTravel,
        colourCode,
        relatedAppointment,
        tenantId,
        isCanceled,
        reasonForCancel,
        rescheduled,
        rescheduleAccepted
    }) {
        this.id = id;
        this.clientId = clientId;
        this.sessionId = sessionId;
        this.clinicians = clinicians;
        this.date = date;
        this.isRecurring = isRecurring;
        this.startTime = startTime;
        this.endTime = endTime;
        this.recurrence = recurrence;
        this.isBillable = isBillable;
        this.serviceLocation = serviceLocation;
        this.requiresTravel = requiresTravel;
        this.colourCode = colourCode;
        this.relatedAppointment = relatedAppointment;
        this.tenantId = tenantId;
        this.isCanceled = isCanceled;
        this.reasonForCancel = reasonForCancel;
        this.rescheduled = rescheduled;
        this.rescheduleAccepted = rescheduleAccepted;
    }

    get createAppointment() {
        const payload = {
            clientId: this.clientId,
            sessionId: this.sessionId,
            date: this.date,
            isRecurring: this.isRecurring,
            startTime: this.startTime,
            endTime: this.endTime,
            recurrence: this.recurrence,
            isBillable: this.isBillable,
            serviceLocation: this.serviceLocation,
            requiresTravel: this.requiresTravel,
            colourCode: this.colourCode,
            relatedAppointment: this.relatedAppointment,
            tenantId: this.tenantId,
            rescheduled: this.rescheduled
        };

        const connectedClinicians = Array.isArray(this.clinicians)
            ? this.clinicians
                .map((clinician) => {
                    if (!clinician) return null;

                    if (typeof clinician === "string") {
                        return { id: clinician };
                    }

                    if (typeof clinician === "object") {
                        if (typeof clinician.id === "string") return { id: clinician.id };
                        if (typeof clinician.userId === "string") return { id: clinician.userId };
                        if (typeof clinician.tenantStaffId === "string") return { id: clinician.tenantStaffId };
                        if (typeof clinician.clinicianId === "string") return { id: clinician.clinicianId };
                    }

                    return null;
                })
                .filter(Boolean)
            : [];

        if (connectedClinicians.length > 0) {
            payload.clinicians = {
                connect: connectedClinicians
            };
        }

        return payload;
    }
}

export default Appointment;
