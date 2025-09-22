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
        relatedAppointment
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
    }

    get createAppointment() {
        return {
            clientId: this.clientId,
            sessionId: this.sessionId,
            clinicians: this.clinicians,
            service: this.service,
            date: this.date,
            isRecurring: this.isRecurring,
            startTime: this.startTime,
            endTime: this.endTime,
            recurrence: this.recurrence,
            isBillable: this.isBillable,
            serviceLocation: this.serviceLocation,
            requiresTravel: this.requiresTravel,
            colourCode: this.colourCode,
            relatedAppointment: this.relatedAppointment
        };
    }
}

export default Appointment;
