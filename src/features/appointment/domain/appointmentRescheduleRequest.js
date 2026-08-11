class AppointmentRescheduleRequest {
    constructor({
        id,
        appointmentId,
        tenantId,
        clientId,
        date,
        startTime,
        endTime,
        reasonForReschedule,
        requestedByType,
        requestedById,
        status
    }) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.reasonForReschedule = reasonForReschedule;
        this.requestedByType = requestedByType;
        this.requestedById = requestedById;
        this.status = status;
    }

    get createRescheduleRequest() {
        return {
            appointmentId: this.appointmentId,
            tenantId: this.tenantId,
            clientId: this.clientId,
            date: this.date,
            startTime: this.startTime,
            endTime: this.endTime,
            reasonForReschedule: this.reasonForReschedule || null,
            requestedByType: this.requestedByType,
            requestedById: this.requestedById || null,
            status: this.status || "PENDING"
        };
    }
}

export default AppointmentRescheduleRequest;
