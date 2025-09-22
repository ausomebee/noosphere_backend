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

}

export default AppointmentController;
