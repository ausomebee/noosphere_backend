import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import AppointmentRepository from "../../infrastructure/appointmentRepository.js";
import AppointmentService from "../../application/appointmentService.js";
import Appointment from "../../domain/appointment.js";
import AppointmentServiceRepository from "../../infrastructure/appointmentServiceRepository.js";
import AppointmentServiceService from "../../application/appointmentServiceService.js";
import AppointmentServiceDomain from "../../domain/appointmentService.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import SocketService from "../../../../config/socket.js";

export class AppointmentController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.appointmentRepository = new AppointmentRepository(this.prisma.appointment, this.prisma);
        this.service = new AppointmentService({ appointmentRepository: this.appointmentRepository });
        this.appointmentServiceRepository = new AppointmentServiceRepository(this.prisma.appointmentService, this.prisma);
        this.appointmentServiceService = new AppointmentServiceService({ appointmentServiceRepository: this.appointmentServiceRepository });
        this.notificationRepository = new NotificationsRepository(this.prisma.notification);
        this.notificationService = new NotificationService({ notificationRepository: this.notificationRepository });
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
            const notificationPayload = {
                userId: data.clientId,
                userType: "CLIENT",
                type: "Appointment Created",
                title: "Appointment Created",
                content: `Your appointment has been created for ${data.date || "the selected date"}.`,
                isRead: false,
            };

            const clientNotification = await this.notificationService.createNotification(notificationPayload);
            SocketService.emitToUser(clientNotification.userId, clientNotification.userType, "newNotification", {
                notification: clientNotification,
            });

            const clinicianIds = this.resolveClinicianIds(data.clinicians);
            for (const clinicianId of clinicianIds) {
                if (!clinicianId) continue;

                const clinicianNotification = await this.notificationService.createNotification({
                    userId: clinicianId,
                    userType: "TENANT_STAFF",
                    type: "Appointment Created",
                    title: "Appointment Created",
                    content: `A new appointment has been created for ${data.clientName || "the selected client"}.`,
                    isRead: false,
                });

                SocketService.emitToUser(clinicianNotification.userId, clinicianNotification.userType, "newNotification", {
                    notification: clinicianNotification,
                });
            }
        } catch (notificationError) {
            console.error("Appointment notification failed:", notificationError);
        }

        return res.status(201).json({
            message: "Appointment created successfully",
            status: "ok",
            data: appointment
        });
    });

    updateAppointment = expressAsyncHandler(async (req, res) => {
        const appointment = await this.service.updateAppointment(req.body);

        if (!appointment) {
            return res.status(500).json({ message: "Failed to update appointment" });
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
        const appointments = await this.service.acceptRescheduleAppointment(req.body);

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
        const appointments = await this.service.updateAppointment({
            id: req.params.id,
            rescheduled: true
        });

        if (!appointments) {
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }

        return res.status(201).json({
            message: "appointments fetched successfully",
            status: 'ok',
            data: appointments
        });
    });

    rejectRescheduleAppointment = expressAsyncHandler(async (req, res) => {
        const appointments = await this.service.rejectRescheduleAppointment(req.body);

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
