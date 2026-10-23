class AppointmentServiceDomain {
    constructor({
        id,
        serviceCodeId,
        appointmentId,
        modifiers,
    }) {
        this.id = id;
        this.serviceCodeId = serviceCodeId;
        this.appointmentId = appointmentId;
        this.modifiers = modifiers;
    }

    get createAppointmentService() {
        return {
            serviceCodeId: this.serviceCodeId,
            appointmentId: this.appointmentId,
            modifiers: this.modifiers,
        };
    }
}

export default AppointmentServiceDomain;
