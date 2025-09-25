import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import AppointmentRepository from "../../infrastructure/appointmentRepository.js";
import AppointmentService from "../../application/appointmentService.js";
import Appointment from "../../domain/appointment.js";

class AppointmentController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.appointmentRepository = new AppointmentRepository(this.prisma.appointment);
        this.service = new AppointmentService({ appointmentRepository: this.appointmentRepository });
    }

    createAppointment = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const appointmentData = new Appointment(data);
        const appointment = await this.service.createAppointment(appointmentData.createAppointment);

        if (!appointment) {
            return res.status(500).json({ message: "Failed to create appointment" });
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
}

export default AppointmentController;
