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
        const appointment = await this.appointmentRepository.findFirstDynamic({
            where: { id: data.id }, include: {
                clinicians: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    }
                }
            }
        });
        if ((!data.forAll || !appointment.isRecurring) && data.relatedAppointment || !appointment.isRecurring) {
            if (appointment && appointment.relatedAppointment || !appointment.isRecurring) {
                const update = await this.appointmentRepository.update(data.id, {
                    clientId: data.clientId || appointment.clientId,
                    sessionId: data.sessionId || appointment.sessionId,
                    clinicians: {
                        set: data.clinicians || appointment.clinicians
                    },
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
                    rescheduleAccepted: data.rescheduled ? false : (data.rescheduleAccepted ?? appointment.rescheduleAccepted),
                    canceledBy: data.canceledBy ?? appointment.canceledBy,
                    cancelTime: data.isCanceled ? new Date() : null,
                    previousDate: data.rescheduled ? appointment.date : null,
                    previousStartTime: data.rescheduled ? appointment.startTime : null,
                    previousEndTime: data.rescheduled ? appointment.endTime : null
                });

                if (!update) {
                    throw new Error("Failed to update Appointment");
                }

                return update;
            } else {
                const appointmentData = new Appointment({ ...appointment, ...data });
                const newAppointment = await this.appointmentRepository.create({
                    ...appointmentData.createAppointment,
                    clinicians: {
                        connect: data.clinicians || appointment.clinicians
                    },
                    rescheduleAccepted: data.rescheduled ? false : (data.rescheduleAccepted ?? appointment.rescheduleAccepted),
                    previousDate: data.rescheduled ? appointment.date : null,
                    previousStartTime: data.rescheduled ? appointment.startTime : null,
                    previousEndTime: data.rescheduled ? appointment.endTime : null
                });

                if (!newAppointment) {
                    throw new Error("Failed to create Appointment");
                }

                return newAppointment;
            }
        }


        if (!appointment) {
            throw new Error("Appointment not found");
        }

        const update = await this.appointmentRepository.update(data.id, {
            clientId: data.clientId || appointment.clientId,
            sessionId: data.sessionId || appointment.sessionId,
            clinicians: {
                set: data.clinicians || appointment.clinicians
            }, service: data.service || appointment.service,
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
            rescheduleAccepted: data.rescheduled ? false : (data.rescheduleAccepted ?? appointment.rescheduleAccepted),
            canceledBy: data.canceledBy ?? appointment.canceledBy,
            cancelTime: data.isCanceled ? new Date() : null,
            previousDate: data.rescheduled ? appointment.date : null,
            previousStartTime: data.rescheduled ? appointment.startTime : null,
            previousEndTime: data.rescheduled ? appointment.endTime : null
        });

        if (!update) {
            throw new Error("Failed to update Appointment");
        }

        return update;
    }

    async getClientAppointments(clientId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate(
            { clientId },
            {
                tenant: true, client: true, session: true, appointmentServices: true, clinicians: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    }
                }
            }
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
                    some: { id: staffId }
                }
            },
            {
                tenant: true, client: true, appointmentServices: true, session: true, clinicians: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    }
                }
            }
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

    async getTenantRescheduledAppointments(tenantId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate({ tenantId, rescheduled: true, rescheduleAccepted: false, rescheduleRejected: false }, {
            client: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    preferredName: true,
                    email: true,
                },
            },
            session: true,
            clinicians: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                }
            },
            appointmentServices: { include: { serviceCode: true } },
        });

        if (!appointments) {
            throw new Error("Failed to fetch Appointment");
        }

        return appointments;
    }

    async getStaffRescheduledAppointments(staffId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate({
            clinicians: {
                some: { id: staffId }
            }
            , rescheduled: true, rescheduleAccepted: false, rescheduleRejected: false
        }, {
            client: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    preferredName: true,
                    email: true,
                },
            },
            session: true,
            appointmentServices: { include: { serviceCode: true } },
            clinicians: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                }
            }
        });

        if (!appointments) {
            throw new Error("Failed to fetch Appointment");
        }

        return appointments;
    }

    async acceptRescheduleAppointment(data) {
        for (const obj of data) {
            const appointment = await this.appointmentRepository.findOne({ id: obj.id });

            if (!appointment) {
                throw new Error("Appointment not found");
            }

            const update = await this.appointmentRepository.update(obj.id, {
                rescheduleAccepted: true,
            });

            if (!update) {
                throw new Error("Failed to update Appointment");
            }
        };

        return "appointment recheduled successfully";
    }

    async rejectRescheduleAppointment(data) {
        for (const obj of data) {
            const appointment = await this.appointmentRepository.findOne({ id: obj.id });

            if (!appointment) {
                throw new Error("Appointment not found");
            }

            const update = await this.appointmentRepository.update(obj.id, {
                rescheduleRejected: true,
                isCanceled: true
            });

            if (!update) {
                throw new Error("Failed to update Appointment");
            }
        };

        return "appointment rechedule rejected successfully";
    }

    async getTenantCanceledAppointments(tenantId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate({ tenantId, isCanceled: true }, {
            client: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    preferredName: true,
                    email: true,
                },
            },
            session: true,
            appointmentServices: { include: { serviceCode: true } },
            clinicians: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                }
            }
        });

        if (!appointments) {
            throw new Error("Failed to fetch Appointment");
        }

        return appointments;
    }

    async getClientCanceledAppointments(clientId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate({ clientId, isCanceled: true }, {
            client: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    preferredName: true,
                    email: true,
                },
            },
            session: true,
            appointmentServices: { include: { serviceCode: true } },
            clinicians: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                }
            }
        });

        if (!appointments) {
            throw new Error("Failed to fetch Appointment");
        }

        return appointments;
    }

    async getStaffCanceledAppointments(staffId) {
        const appointments = await this.appointmentRepository.findAllAndPopulate({
            clinicians: {
                some: { id: staffId }
            }, isCanceled: true
        }, {
            client: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    preferredName: true,
                    email: true,
                },
            },
            session: true,
            appointmentServices: { include: { serviceCode: true } },
            clinicians: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                }
            }
        });

        if (!appointments) {
            throw new Error("Failed to fetch Appointment");
        }

        return appointments;
    }

    async appointmentsMetric(tenantId, status, period) {
        const appointments = await this.appointmentRepository.appointmentsMetric(tenantId, status, period);

        if (!appointments) {
            throw new Error("Failed to fetch Appointment");
        }

        return appointments;
    }

    isUpcoming(appt, now = new Date()) {
        const start = new Date(`${appt.date}T${appt.startTime}:00`);

        // if (!appt.isRecurring) {
        return start >= now;
        // }

        // const recurrenceEnd = appt.recurrence?.endOn
        //     ? new Date(appt.recurrence.endOn)
        //     : null;

        // if (!recurrenceEnd) return true;

        // return recurrenceEnd >= now;
    }

    isPast(appt, now = new Date()) {
        const end = new Date(`${appt.date}T${appt.endTime}:00`);

        // if (!appt.isRecurring) {
        return end < now;
        // }

        // const recurrenceEnd = appt.recurrence?.endOn
        //     ? new Date(appt.recurrence.endOn)
        //     : null;

        // if (!recurrenceEnd) return false;

        // return recurrenceEnd < now;
    }

    async getTenantUpcomingAppointments(tenantId) {
        const now = new Date();

        const allAppointments = await this.appointmentRepository.findAllAndPopulate(
            { isCanceled: false, tenantId },
            {
                client: {
                    select: {
                        id: true, firstName: true,
                        lastName: true,
                        preferredName: true, email: true
                    }
                },
                session: true,
                appointmentServices: { include: { serviceCode: true } },
                clinicians: { select: { id: true, fullName: true, email: true } }
            }
        );

        return allAppointments
            .filter(appt => this.isUpcoming(appt, now))
            .sort((a, b) => {
                const aDate = new Date(`${a.date}T${a.startTime}:00`);
                const bDate = new Date(`${b.date}T${b.startTime}:00`);
                return aDate - bDate;
            });
    }

    async getTenantPastAppointments(tenantId) {
        const now = new Date();

        const allAppointments = await this.appointmentRepository.findAllAndPopulate(
            { isCanceled: false, tenantId },
            {
                client: {
                    select: {
                        id: true, firstName: true,
                        lastName: true,
                        preferredName: true, email: true
                    }
                },
                session: true,
                appointmentServices: { include: { serviceCode: true } },
                clinicians: { select: { id: true, fullName: true, email: true } }
            }
        );

        return allAppointments
            .filter(appt => this.isPast(appt, now))
            .sort((a, b) => {
                const aDate = new Date(`${a.date}T${a.startTime}:00`);
                const bDate = new Date(`${b.date}T${b.startTime}:00`);
                return bDate - aDate;
            });
    }

    async getStaffUpcomingAppointments(staffId) {
        const now = new Date();

        const allAppointments = await this.appointmentRepository.findAllAndPopulate(
            {
                isCanceled: false, clinicians: {
                    some: { id: staffId }
                }
            },
            {
                client: {
                    select: {
                        id: true, firstName: true,
                        lastName: true,
                        preferredName: true, email: true
                    }
                },
                session: true,
                appointmentServices: { include: { serviceCode: true } },
                clinicians: { select: { id: true, fullName: true, email: true } }
            }
        );

        return allAppointments
            .filter(appt => this.isUpcoming(appt, now))
            .sort((a, b) => {
                const aDate = new Date(`${a.date}T${a.startTime}:00`);
                const bDate = new Date(`${b.date}T${b.startTime}:00`);
                return aDate - bDate;
            });
    }

    async getStaffPastAppointments(staffId) {
        const now = new Date();

        const allAppointments = await this.appointmentRepository.findAllAndPopulate(
            {
                isCanceled: false, clinicians: {
                    some: { id: staffId }
                }
            },
            {
                client: {
                    select: {
                        id: true, firstName: true,
                        lastName: true,
                        preferredName: true, email: true
                    }
                },
                session: true,
                appointmentServices: { include: { serviceCode: true } },
                clinicians: { select: { id: true, fullName: true, email: true } }
            }
        );

        return allAppointments
            .filter(appt => this.isPast(appt, now))
            .sort((a, b) => {
                const aDate = new Date(`${a.date}T${a.startTime}:00`);
                const bDate = new Date(`${b.date}T${b.startTime}:00`);
                return bDate - aDate;
            });
    }

    async getClientUpcomingAppointments(clientId) {
        const now = new Date();

        const allAppointments = await this.appointmentRepository.findAllAndPopulate(
            { isCanceled: false, clientId },
            {
                client: {
                    select: {
                        id: true, firstName: true,
                        lastName: true,
                        preferredName: true, email: true
                    }
                },
                session: true,
                appointmentServices: { include: { serviceCode: true } },
                clinicians: { select: { id: true, fullName: true, email: true } }
            }
        );

        return allAppointments
            .filter(appt => this.isUpcoming(appt, now))
            .sort((a, b) => {
                const aDate = new Date(`${a.date}T${a.startTime}:00`);
                const bDate = new Date(`${b.date}T${b.startTime}:00`);
                return aDate - bDate;
            });
    }

    async getClientPastAppointments(clientId) {
        const now = new Date();

        const allAppointments = await this.appointmentRepository.findAllAndPopulate(
            { isCanceled: false, clientId },
            {
                client: {
                    select: {
                        id: true, firstName: true,
                        lastName: true,
                        preferredName: true, email: true
                    }
                },
                session: true,
                appointmentServices: { include: { serviceCode: true } },
                clinicians: { select: { id: true, fullName: true, email: true } }
            }
        );

        return allAppointments
            .filter(appt => this.isPast(appt, now))
            .sort((a, b) => {
                const aDate = new Date(`${a.date}T${a.startTime}:00`);
                const bDate = new Date(`${b.date}T${b.startTime}:00`);
                return bDate - aDate;
            });
    }

    async getAppointment(id) {
        const appointment = await this.appointmentRepository.findFirstDynamic({
            where: {
                id: id,
            },
            include: {
                client: { include: { payer: true } },
                clinicians: true,
                session: true,
                appointmentServices: { include: { serviceCode: true } },
            }
        });

        if (!appointment) {
            throw new Error("appointment not found.");
        }

        return appointment;
    }

    async getAppointmentsForTimesheet(id) {
        const appointment = await this.appointmentRepository.getAppointmentsForTimesheet(id);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        const tenantClientId = appointment.client.tenantLinks[0]?.id;

        if (!tenantClientId) {
            throw new Error("Client is not linked to tenant");
        }

        const requiredServices = appointment.appointmentServices.map(s => ({
            serviceCodeId: s.serviceCodeId,
        }));

        return { tenantClientId, requiredServices };
    }
}

export default AppointmentService;
