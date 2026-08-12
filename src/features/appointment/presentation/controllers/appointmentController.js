import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import AppointmentRepository from "../../infrastructure/appointmentRepository.js";
import AppointmentService from "../../application/appointmentService.js";
import Appointment from "../../domain/appointment.js";
import AppointmentServiceRepository from "../../infrastructure/appointmentServiceRepository.js";
import AppointmentServiceService from "../../application/appointmentServiceService.js";
import AppointmentServiceDomain from "../../domain/appointmentService.js";
import AppointmentRescheduleRequestRepository from "../../infrastructure/appointmentRescheduleRequestRepository.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import ClientNotificationEmitter from "../../../client/application/clientNotificationEmitter.js";
import SocketService from "../../../../config/socket.js";
import emailService from "../../../../utilities/ses.js";
import templateRenderer from "../../../../utilities/templateRenderer.js";
import { NotificationEntityType, NotificationType } from "../../../notifications/domain/notificationTypes.js";

export class AppointmentController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.appointmentRepository = new AppointmentRepository(this.prisma.appointment, this.prisma);
        this.appointmentServiceRepository = new AppointmentServiceRepository(this.prisma.appointmentService, this.prisma);
        this.appointmentRescheduleRequestRepository = new AppointmentRescheduleRequestRepository(this.prisma.appointmentRescheduleRequest, this.prisma);
        this.service = new AppointmentService({
            appointmentRepository: this.appointmentRepository,
            appointmentRescheduleRequestRepository: this.appointmentRescheduleRequestRepository,
            appointmentServiceRepository: this.appointmentServiceRepository,
        });
        this.appointmentServiceService = new AppointmentServiceService({ appointmentServiceRepository: this.appointmentServiceRepository });
        this.notificationRepository = new NotificationsRepository(this.prisma.notification);
        this.notificationService = new NotificationService({ notificationRepository: this.notificationRepository });
        this.clientNotificationEmitter = new ClientNotificationEmitter({
            prisma: this.prisma,
            notificationService: this.notificationService,
        });
    }

    async notifyAppointment({ appointment, type, title, staffContent, clientContent, metadata = {} }) {
        const fullAppointment = await this.prisma.appointment.findUnique({
            where: { id: appointment.id },
            include: { clinicians: { select: { id: true } }, client: { select: { id: true } } },
        });
        if (!fullAppointment) return [];

        const recipients = fullAppointment.clinicians.map((clinician) => ({ userId: clinician.id, userType: "TENANT_STAFF" }));
        const notifications = await this.notificationService.dispatch({
            recipients,
            type,
            title,
            content: staffContent,
            entityType: NotificationEntityType.APPOINTMENT,
            entityId: appointment.id,
            metadata: { tenantId: appointment.tenantId, clientId: appointment.clientId, ...metadata },
        }, SocketService.emitToUser.bind(SocketService));

        if (clientContent) {
            const clientEventMap = {
                [NotificationType.RESCHEDULED_APPOINTMENT]: NotificationType.APPOINTMENT_RESCHEDULED,
                [NotificationType.CANCELLED_APPOINTMENT]: NotificationType.APPOINTMENT_CANCELLED,
            };

            await this.clientNotificationEmitter.emit({
                clientId: appointment.clientId,
                tenantId: appointment.tenantId,
                type: clientEventMap[type] || type,
                title,
                content: clientContent,
                entityType: NotificationEntityType.APPOINTMENT,
                entityId: appointment.id,
                metadata,
            });
        }

        return notifications;
    }

    formatAppointmentDate(rawDate) {
        if (!rawDate) return "the selected date";

        const parsed = new Date(rawDate);
        if (Number.isNaN(parsed.getTime())) return rawDate;

        return parsed.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    formatAppointmentTime(startTime, endTime) {
        const formatOne = (time) => {
            if (!time) return null;

            const match = String(time).match(/^(\d{1,2}):(\d{2})/);
            if (!match) return time;

            let hours = parseInt(match[1], 10);
            const minutes = match[2];
            const period = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;

            return `${hours}:${minutes} ${period}`;
        };

        return [formatOne(startTime), formatOne(endTime)].filter(Boolean).join(" - ") || "the selected time";
    }

    formatClinicianNames(clinicians) {
        const names = Array.isArray(clinicians) ? clinicians.map((c) => c?.fullName).filter(Boolean) : [];

        if (names.length === 0) return "your clinician";
        if (names.length === 1) return names[0];
        if (names.length === 2) return names.join(" and ");

        return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
    }

    resolveClinicianIds(clinicians) {
        if (!Array.isArray(clinicians)) {
            return [];
        }

        return clinicians
            .map((clinician) => {
                if (!clinician) {
                    return null;
                }

                if (typeof clinician === "string") {
                    return clinician;
                }

                if (typeof clinician === "object") {
                    if (typeof clinician.id === "string") return clinician.id;
                    if (typeof clinician.userId === "string") return clinician.userId;
                    if (typeof clinician.tenantStaffId === "string") return clinician.tenantStaffId;
                    if (typeof clinician.clinicianId === "string") return clinician.clinicianId;
                }

                return null;
            })
            .filter(Boolean);
    }

    createAppointment = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const appointmentData = new Appointment(data);
        const appointment = await this.service.createAppointment(appointmentData.createAppointment);

        if (!appointment) {
            return res.status(500).json({ message: "Failed to create appointment" });
        }

        for (const as of data.service || []) {
            const asPayload = new AppointmentServiceDomain({ ...as, appointmentId: appointment.id });
            const newAs = await this.appointmentServiceService.createAppointmentService(asPayload.createAppointmentService);

            if (!newAs) {
                return res.status(500).json({ message: "Failed to create appointment service" });
            }
        }

        try {
            const appointmentWithRelations = await this.prisma.appointment.findUnique({
                where: { id: appointment.id },
                include: {
                    client: true,
                    tenant: true,
                    clinicians: { select: { id: true, fullName: true } },
                    session: { select: { name: true } },
                },
            });

            const persistedClient = appointmentWithRelations?.client;
            const tenant = appointmentWithRelations?.tenant;
            const clientName = persistedClient
                ? [persistedClient.firstName, persistedClient.lastName].filter(Boolean).join(" ") || persistedClient.preferredName || "the selected client"
                : data.clientName || "the selected client";
            const clientEmail = persistedClient?.email || data.clientEmail || null;
            const recipientName = persistedClient?.preferredName || persistedClient?.firstName || clientName;
            const appointmentDate = this.formatAppointmentDate(appointmentWithRelations?.date || data.date);
            const appointmentTime = this.formatAppointmentTime(
                appointmentWithRelations?.startTime || data.startTime,
                appointmentWithRelations?.endTime || data.endTime
            );
            const tenantSlug = tenant?.subdomain || "noosphere";
            const companyName = tenant?.companyName || "NooSphere";
            const sessionType = appointmentWithRelations?.session?.name || "Appointment";
            const serviceLocation = appointmentWithRelations?.serviceLocation || data.serviceLocation || "To be confirmed";
            const clinicianNames = this.formatClinicianNames(appointmentWithRelations?.clinicians);

            const clientTemplate = templateRenderer.render("appointment-scheduled-client.html", {
                recipientName,
                clientName,
                clinicianNames,
                companyName,
                subdomain: tenantSlug,
                appointmentDate,
                appointmentTime,
                sessionType,
                serviceLocation,
            });

            if (clientEmail) {
                await emailService.sendTenantEmail({
                    tenantSlug,
                    to: [clientEmail],
                    subject: `Your appointment with ${clinicianNames} is confirmed`,
                    html: clientTemplate,
                    text: `Hello ${recipientName}, you have an upcoming appointment with ${clinicianNames} on ${appointmentDate} at ${appointmentTime}.`,
                });
            }

            await this.clientNotificationEmitter.emit({
                clientId: data.clientId,
                tenantId: data.tenantId,
                type: NotificationType.APPOINTMENT_SCHEDULED,
                title: "Appointment Scheduled",
                content: `Your appointment has been scheduled for ${appointmentDate}.`,
                entityType: NotificationEntityType.APPOINTMENT,
                entityId: appointment.id,
                metadata: {
                    date: data.date || null,
                    startTime: data.startTime || null,
                    endTime: data.endTime || null,
                },
            });

            const clinicianIds = this.resolveClinicianIds(data.clinicians);
            for (const clinicianId of clinicianIds) {
                if (!clinicianId) continue;

                const clinicianNotification = await this.notificationService.createNotification({
                    userId: clinicianId,
                    userType: "TENANT_STAFF",
                    type: NotificationType.APPOINTMENT_SCHEDULED,
                    title: "Appointment Created",
                    content: `A new appointment has been created for ${clientName}.`,
                    entityType: NotificationEntityType.APPOINTMENT,
                    entityId: appointment.id,
                    metadata: {
                        tenantId: data.tenantId || null,
                        clientId: data.clientId || null,
                        date: data.date || null,
                        startTime: data.startTime || null,
                        endTime: data.endTime || null,
                    },
                    isRead: false,
                });

                SocketService.emitToUser(clinicianNotification.userId, clinicianNotification.userType, "newNotification", {
                    notification: clinicianNotification,
                });

                try {
                    const staffEmail = await this.prisma.tenantStaff.findUnique({
                        where: { id: clinicianId },
                        select: { email: true, fullName: true },
                    });

                    if (staffEmail?.email) {
                        const staffRecipientName = staffEmail.fullName || "there";
                        const staffTemplate = templateRenderer.render("appointment-scheduled-staff.html", {
                            recipientName: staffRecipientName,
                            clientName,
                            companyName,
                            subdomain: tenantSlug,
                            appointmentDate,
                            appointmentTime,
                            sessionType,
                            serviceLocation,
                        });

                        await emailService.sendTenantEmail({
                            tenantSlug,
                            to: [staffEmail.email],
                            subject: `New Appointment: ${clientName}`,
                            html: staffTemplate,
                            text: `Hello ${staffRecipientName}, a new appointment has been created for ${clientName} on ${appointmentDate} at ${appointmentTime}.`,
                        });
                    }
                } catch (staffEmailError) {
                    console.error(`Failed to send appointment email to clinician ${clinicianId}:`, staffEmailError);
                }
            }
        } catch (notificationError) {
            console.error("Appointment notification/email processing failed:", notificationError);
        }

        return res.status(201).json({
            message: "Appointment created successfully",
            status: "ok",
            data: appointment
        });
    });

    updateAppointment = expressAsyncHandler(async (req, res) => {
        const previous = await this.prisma.appointment.findUnique({ where: { id: req.body.id } });
        const appointment = await this.service.updateAppointment(req.body);

        if (!appointment) {
            return res.status(500).json({ message: "Failed to update appointment" });
        }

        if (req.body.isCanceled === true && !previous?.isCanceled) {
            await this.notifyAppointment({
                appointment,
                type: NotificationType.CANCELLED_APPOINTMENT,
                title: "Appointment Cancelled",
                staffContent: `Your appointment has been cancelled${appointment.reasonForCancel ? `: ${appointment.reasonForCancel}` : "."}`,
                clientContent: "Your appointment has been cancelled.",
                metadata: { reason: appointment.reasonForCancel || null },
            });
        } else if (req.body.rescheduled === true && !previous?.rescheduled) {
            const clientRequested = Boolean(req.body.reasonForReschedule && !req.user?.type?.includes("TENANT"));
            await this.notifyAppointment({
                appointment,
                type: clientRequested ? NotificationType.NEW_RESCHEDULE_REQUEST : NotificationType.RESCHEDULED_APPOINTMENT,
                title: clientRequested ? "New Reschedule Request" : "Appointment Rescheduled",
                staffContent: clientRequested
                    ? "A client requested to reschedule an appointment."
                    : "An appointment has been rescheduled.",
                clientContent: clientRequested ? null : "Your appointment has been rescheduled.",
                metadata: { previousDate: appointment.previousDate || null, reason: appointment.reasonForReschedule || null },
            });
        }

        return res.status(201).json({
            message: "Appointment updated successfully",
            status: "ok",
            data: appointment
        });
    });

    getCliniciansByClientId = expressAsyncHandler(async (req, res) => {
        const clients = await this.service.getCliniciansByClientId(req.params.clientId, req.params.tenantId);

        if (!clients) {
            res.status(500).json({ message: 'Failed to fetch clinicians' });
        }

        return res.status(201).json({
            message: "clinicians fetched successfully",
            status: 'ok',
            data: clients
        });
    });

    getTenantAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getTenantAppointments(req.params.tenantId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    appointmentsMetric = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.appointmentsMetric(
            req.params.tenantId,
            req.params.status,
            req.params.period
        );

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getTenantRescheduledAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getTenantRescheduledAppointments(req.params.tenantId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getAppointment = expressAsyncHandler(async (req, res) => {
        const appointment = await this.service.getAppointment(req.params.id);

        if (!appointment) {
            res.status(500).json({ message: 'Failed to fetch appointment' });
        }

        return res.status(201).json({
            message: "appointment fetched successfully",
            status: 'ok',
            data: appointment
        });
    });

    getTenantCanceledAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getTenantCanceledAppointments(req.params.tenantId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getStaffAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getStaffAppointments(req.params.staffId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getStaffRescheduledAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getStaffRescheduledAppointments(req.params.staffId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getClientCanceledAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getClientCanceledAppointments(req.params.clientId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getStaffCanceledAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getStaffCanceledAppointments(req.params.staffId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getClientAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getClientAppointments(req.params.clientId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    acceptRescheduleAppointment = expressAsyncHandler(async (req, res) => {
        const responder = {
            respondedByType: req.user?.type || null,
            respondedById: req.user?.id || null,
        };
        const requests = req.body.map((obj) => ({ ...obj, ...responder }));
        const appointments = await this.service.acceptRescheduleAppointment(requests);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    rescheduleAppointment = expressAsyncHandler(async (req, res) => {
        const requestedByType = req.user?.type || "STAFF";
        const requestedById = req.user?.id || null;
        const clientRequested = requestedByType === "CLIENT";

        const { request, appointment } = await this.service.requestReschedule({
            appointmentId: req.body.id,
            tenantId: req.body.tenantId,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            reasonForReschedule: req.body.reasonForReschedule,
            requestedByType,
            requestedById,
        });

        if (!request) {
            return res.status(500).json({ message: "Failed to create reschedule request" });
        }

        try {
            await this.notifyAppointment({
                appointment,
                type: clientRequested ? NotificationType.NEW_RESCHEDULE_REQUEST : NotificationType.RESCHEDULED_APPOINTMENT,
                title: clientRequested ? "New Reschedule Request" : "Appointment Rescheduled",
                staffContent: clientRequested
                    ? "A client requested to reschedule an appointment."
                    : "An appointment has been rescheduled.",
                clientContent: clientRequested ? null : "Your appointment has been rescheduled.",
                metadata: {
                    proposedDate: request.date,
                    proposedStartTime: request.startTime,
                    proposedEndTime: request.endTime,
                    reason: request.reasonForReschedule || null,
                },
            });
        } catch (notificationError) {
            console.error("Reschedule notification processing failed:", notificationError);
        }

        return res.status(201).json({
            message: "Reschedule request submitted successfully",
            status: 'ok',
            data: request
        });
    });

    rejectRescheduleAppointment = expressAsyncHandler(async (req, res) => {
        const responder = {
            respondedByType: req.user?.type || null,
            respondedById: req.user?.id || null,
        };
        const requests = req.body.map((obj) => ({ ...obj, ...responder }));
        const appointments = await this.service.rejectRescheduleAppointment(requests);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getTenantUpcomingAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getTenantUpcomingAppointments(req.params.tenantId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getClientUpcomingAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getClientUpcomingAppointments(req.params.clientId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getTenantPastAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getTenantPastAppointments(req.params.tenantId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getClientPastAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getClientPastAppointments(req.params.clientId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getClientRescheduledAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getClientRescheduledAppointments(req.params.clientId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getClientPastAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getClientPastAppointments(req.params.clientId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getStaffUpcomingAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getStaffUpcomingAppointments(req.params.staffId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    getStaffPastAppointments = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.getStaffPastAppointments(req.params.staffId);

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });
}

export default AppointmentController;
