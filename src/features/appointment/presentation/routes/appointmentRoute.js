import express from "express";
import AppointmentDto from "../dto/appointmentDto.js";
import AppointmentController from "../controllers/appointmentController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     AppointmentCreateDto:
 *       type: object
 *       required:
 *         - clientId
 *         - sessionId
 *         - clinicians
 *         - service
 *         - date
 *         - startTime
 *         - endTime
 *         - serviceLocation
 *         - colourCode
 *       properties:
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: Unique client identifier
 *         sessionId:
 *           type: string
 *           format: uuid
 *           description: Unique session type identifier
 *         clinicians:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: List of clinician IDs
 *         service:
 *           type: object
 *           description: Service details (JSON)
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the appointment
 *         isRecurring:
 *           type: boolean
 *           description: Indicates if the appointment is recurring
 *           example: false
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the appointment
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the appointment
 *         recurrence:
 *           type: object
 *           description: Recurrence rules (JSON)
 *         isBillable:
 *           type: boolean
 *           description: Indicates if the appointment is billable
 *           example: true
 *         serviceLocation:
 *           type: string
 *           description: Location of the service
 *         requiresTravel:
 *           type: boolean
 *           description: Indicates if travel is required
 *           example: false
 *         colourCode:
 *           type: string
 *           description: Colour code for the appointment
 *           example: "#FF5733"
 *         relatedAppointment:
 *           type: string
 *           format: uuid
 *           description: ID of a related appointment
 *         forAll:
 *           type: boolean
 *           description: Apply this update to all recurring appointments
 *           example: false
 *
 *     AppointmentUpdateDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         clientId:
 *           type: string
 *           format: uuid
 *         sessionId:
 *           type: string
 *           format: uuid
 *         clinicians:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         service:
 *           type: object
 *         date:
 *           type: string
 *           format: date-time
 *         isRecurring:
 *           type: boolean
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         recurrence:
 *           type: object
 *         isBillable:
 *           type: boolean
 *         serviceLocation:
 *           type: string
 *         requiresTravel:
 *           type: boolean
 *         colourCode:
 *           type: string
 *         relatedAppointment:
 *           type: string
 *           format: uuid
 *         forAll:
 *           type: boolean
 *           description: Apply this update to all recurring appointments
 *           example: false
 */

class AppointmentRoutes {
    constructor() {
        this.controller = new AppointmentController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/appointments:
         *   post:
         *     summary: Create a new appointment
         *     tags: [appointments]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AppointmentCreateDto'
         *     responses:
         *       201:
         *         description: Appointment created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", AppointmentDto.createAppointmentDto, this.controller.createAppointment);

        /**
         * @swagger
         * /api/v1/appointments/:
         *   put:
         *     summary: Update an existing appointment
         *     tags: [appointments]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AppointmentUpdateDto'
         *     responses:
         *       200:
         *         description: Appointment updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Appointment not found
         */
        this.router.put("/", AppointmentDto.updateAppointmentDto, this.controller.updateAppointment);
    }

    getRouter() {
        return this.router;
    }
}

export default new AppointmentRoutes().getRouter();