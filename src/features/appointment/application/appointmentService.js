import Appointment from "../domain/appointment.js";

class AppointmentService {
    constructor({ appointmentRepository }) {
        this.appointmentRepository = appointmentRepository;
    }

    async createAppointment(data) {
        const appointmentExists = await this.appointmentRepository.findFirstDynamic({
            where: {
                clientId: data.clientId,
                sessionId: data.sessionId,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime
            },
            select: { id: true }
        });

        if (appointmentExists) {
            throw new Error("This appointment already exists.");
        }

        const newAppointment = await this.appointmentRepository.create(data);

        if (!newAppointment) {
            throw new Error("Failed to create Appointment");
        }

        return newAppointment;
    }

    async updateAppointment(data) {
        if (!data.forAll && data.relatedAppointment) {
            const appointmentData = new Appointment(data);
            console.log(appointmentData.createAppointment)
            const newAppointment = await this.appointmentRepository.create(appointmentData.createAppointment);

            if (!newAppointment) {
                throw new Error("Failed to create Appointment");
            }

            return newAppointment;
        }

        const appointment = await this.appointmentRepository.findOne({ id: data.id });

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        const update = await this.appointmentRepository.update(data.id, {
            clientId: data.clientId || appointment.clientId,
            sessionId: data.sessionId || appointment.sessionId,
            clinicians: data.clinicians || appointment.clinicians,
            service: data.service || appointment.service,
            date: data.date || appointment.date,
            isRecurring: data.isRecurring ?? appointment.isRecurring,
            startTime: data.startTime || appointment.startTime,
            endTime: data.endTime || appointment.endTime,
            recurrence: data.recurrence || appointment.recurrence,
            isBillable: data.isBillable ?? appointment.isBillable,
            serviceLocation: data.serviceLocation || appointment.serviceLocation,
            requiresTravel: data.requiresTravel ?? appointment.requiresTravel,
            colourCode: data.colourCode || appointment.colourCode,
            isCanceled: data.isCanceled ?? appointment.isCanceled,
            reasonForCancel: data.reasonForCancel || appointment.reasonForCancel,
            rescheduled: data.rescheduled ?? appointment.rescheduled,
            rescheduleAccepted: data.rescheduleAccepted ?? appointment.rescheduleAccepted,
        });

        if (!update) {
            throw new Error("Failed to update Appointment");
        }

        return update;
    }

    async getClientAppointments(clientId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate({ clientId, relatedAppointment: null }, {tenant: true, client: true, session: true});

        if (!appointments) {
            throw new Error("appointments not found")
        }

        return appointments;
    }

    async getTenantAppointments(tenantId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate({ tenantId, relatedAppointment: null }, {tenant: true, client: true, session: true});

        if (!appointments) {
            throw new Error("appointments not found")
        }

        return appointments;
    }

    async getStaffAppointments(staffId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate({
            clinicians: {
                array_contains: [staffId]
            },
            relatedAppointment: null
        }, {tenant: true, client: true, session: true});

        if (!appointments) {
            throw new Error("appointments not found")
        }

        return appointments;
    }
}

export default AppointmentService;
