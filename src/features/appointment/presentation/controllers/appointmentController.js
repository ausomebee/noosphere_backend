import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import AppointmentRepository from "../../infrastructure/appointmentRepository.js";
import AppointmentService from "../../application/appointmentService.js";
import Appointment from "../../domain/appointment.js";
import AppointmentServiceRepository from "../../infrastructure/appointmentServiceRepository.js";
import AppointmentServiceService from "../../application/appointmentServiceService.js";
import AppointmentServiceDomain from "../../domain/appointmentService.js";

class AppointmentController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.appointmentRepository = new AppointmentRepository(this.prisma.appointment, this.prisma);
        this.service = new AppointmentService({ appointmentRepository: this.appointmentRepository });
        this.appointmentServiceRepository = new AppointmentServiceRepository(this.prisma.appointmentService, this.prisma);
        this.appointmentServiceService = new AppointmentServiceService({ appointmentServiceRepository: this.appointmentServiceRepository });
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
