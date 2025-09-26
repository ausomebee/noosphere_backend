class Appointment {
    constructor({
        id,
        clientId,
        sessionId,
        clinicians,
        service,
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
        this.service = service;
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
        return {
            clientId: this.clientId,
            sessionId: this.sessionId,
            clinicians: {
                connect: this.clinicians
            },
            service: this.service,
            date: new Date(`${this.date}T00:00:00.000Z`),
            isRecurring: this.isRecurring,
            startTime: this.startTime,
            endTime: this.endTime,
            recurrence: this.recurrence,
            isBillable: this.isBillable,
            serviceLocation: this.serviceLocation,
            requiresTravel: this.requiresTravel,
            colourCode: this.colourCode,
            relatedAppointment: this.relatedAppointment,
            tenantId: this.tenantId
        };
    }
}

export default Appointment;
