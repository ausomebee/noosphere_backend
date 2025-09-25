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
        const appointment = await this.appointmentRepository.findOne({ id: data.id });
        if (!data.forAll && data.relatedAppointment) {
            const appointmentData = new Appointment({...appointment, ...data});
            const newAppointment = await this.appointmentRepository.create(appointmentData.createAppointment);

            if (!newAppointment) {
                throw new Error("Failed to create Appointment");
            }

            return newAppointment;
        }


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
        const appointments = await this.appointmentRepository.findAllAndPopulate(
            { clientId },
            { tenant: true, client: true, session: true }
        );

        if (!appointments || appointments.length === 0) {
            return [];
        }

        const grouped = {};

        for (const appt of appointments) {
            if (!appt.relatedAppointment) {
                grouped[appt.id] = {
                    ...appt,
                    relatedAppointments: [],
                };
            }
        }

        for (const appt of appointments) {
            if (appt.relatedAppointment) {
                if (grouped[appt.relatedAppointment]) {
                    grouped[appt.relatedAppointment].relatedAppointments.push(appt);
                } else {
                    grouped[appt.id] = {
                        ...appt,
                        relatedAppointments: [],
                    };
                }
            }
        }

        const result = Object.values(grouped).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        for (const item of result) {
            item.relatedAppointments.sort((a, b) => {
                const d = new Date(a.date) - new Date(b.date);
                if (d !== 0) return d;
                return a.startTime.localeCompare(b.startTime);
            });
        }

        return result;
    }

    async getStaffAppointments(staffId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate(
            {
                clinicians: {
                    array_contains: [staffId]
                }
            },
            { tenant: true, client: true, session: true }
        );

        if (!appointments || appointments.length === 0) {
            return [];
        }

        const grouped = {};

        for (const appt of appointments) {
            if (!appt.relatedAppointment) {
                grouped[appt.id] = {
                    ...appt,
                    relatedAppointments: [],
                };
            }
        }

        for (const appt of appointments) {
            if (appt.relatedAppointment) {
                if (grouped[appt.relatedAppointment]) {
                    grouped[appt.relatedAppointment].relatedAppointments.push(appt);
                } else {
                    grouped[appt.id] = {
                        ...appt,
                        relatedAppointments: [],
                    };
                }
            }
        }

        const result = Object.values(grouped).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        for (const item of result) {
            item.relatedAppointments.sort((a, b) => {
                const d = new Date(a.date) - new Date(b.date);
                if (d !== 0) return d;
                return a.startTime.localeCompare(b.startTime);
            });
        }

        return result;
    }

    async getTenantAppointments(tenantId) {
        const appointments = await this.appointmentRepository.getAppointmentsByTenant(tenantId);

        if (!appointments || appointments.length === 0) {
            return [];
        }

        const grouped = {};

        for (const appt of appointments) {
            if (!appt.relatedAppointment) {
                grouped[appt.id] = {
                    ...appt,
                    relatedAppointments: [],
                };
            }
        }

        for (const appt of appointments) {
            if (appt.relatedAppointment) {
                if (grouped[appt.relatedAppointment]) {
                    grouped[appt.relatedAppointment].relatedAppointments.push(appt);
                } else {
                    grouped[appt.id] = {
                        ...appt,
                        relatedAppointments: [],
                    };
                }
            }
        }

        const result = Object.values(grouped).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        for (const item of result) {
            item.relatedAppointments.sort((a, b) => {
                const d = new Date(a.date) - new Date(b.date);
                if (d !== 0) return d;
                return a.startTime.localeCompare(b.startTime);
            });
        }

        return result;
    }

}

export default AppointmentService;
