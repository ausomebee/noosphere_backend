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
 *         - tenantId
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
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
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
 *           type: array
 *           items:
 *             type: object
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
 *           format: time
 *           description: Start time of the appointment
 *         endTime:
 *           type: string
 *           format: time
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
 *
 *     AppointmentUpdateDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique appointment identifier
 *         canceledBy:
 *           type: string
 *         tenantId:
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
 *           type: array
 *           items:
 *             type: object
 *         date:
 *           type: string
 *           format: date-time
 *         isRecurring:
 *           type: boolean
 *         startTime:
 *           type: string
 *           format: time
 *         endTime:
 *           type: string
 *           format: time
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
 *         isCanceled:
 *           type: boolean
 *           description: Indicates if the appointment has been canceled
 *           example: false
 *         reasonForCancel:
 *           type: string
 *           description: Reason for cancellation
 *           example: "Client unavailable"
 *         rescheduled:
 *           type: boolean
 *           description: Indicates if the appointment has been rescheduled
 *           example: false
 *         rescheduleAccepted:
 *           type: boolean
 *           description: Indicates if the reschedule was accepted
 *           example: false
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

        /**
        * @swagger
        * /api/v1/appointments/tenant/{tenantId}:
        *   get:
        *     summary: get tenant appointments
        *     tags: [appointments]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the tenant
        *     responses:
        *       200:
        *         description: tenant appointments fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/:tenantId", this.controller.getTenantAppointments);

        /**
        * @swagger
        * /api/v1/appointments/tenant/rescheduled/{tenantId}:
        *   get:
        *     summary: get tenant recheduled appointments
        *     tags: [appointments]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the tenant
        *     responses:
        *       200:
        *         description: tenant appointments fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/rescheduled/:tenantId", this.controller.getTenantRescheduledAppointments);

        /**
        * @swagger
        * /api/v1/appointments/staff/{staffId}:
        *   get:
        *     summary: get staff appointments
        *     tags: [appointments]
        *     parameters:
        *       - in: path
        *         name: staffId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the staff
        *     responses:
        *       200:
        *         description: staff appointments fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/staff/:staffId", this.controller.getStaffAppointments);

        /**
        * @swagger
        * /api/v1/appointments/tenant/canceled/{tenantId}:
        *   get:
        *     summary: get tenant canceled appointments
        *     tags: [appointments]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the tenant
        *     responses:
        *       200:
        *         description: tenant appointments fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/canceled/:tenantId", this.controller.getTenantCanceledAppointments);

        /**
        * @swagger
        * /api/v1/appointments/staff/canceled/{staffId}:
        *   get:
        *     summary: get staff canceled appointments
        *     tags: [appointments]
        *     parameters:
        *       - in: path
        *         name: staffId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the staff
        *     responses:
        *       200:
        *         description: staff appointments fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/staff/canceled/:staffId", this.controller.getStaffCanceledAppointments);

        /**
        * @swagger
        * /api/v1/appointments/staff/rescheduled/{staffId}:
        *   get:
        *     summary: get staff rescheduled appointments
        *     tags: [appointments]
        *     parameters:
        *       - in: path
        *         name: staffId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the staff
        *     responses:
        *       200:
        *         description: staff appointments fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/staff/rescheduled/:staffId", this.controller.getStaffRescheduledAppointments);

         /**
        * @swagger
        * /api/v1/appointments/client/{clientId}:
        *   get:
        *     summary: get client appointments
        *     tags: [appointments]
        *     parameters:
        *       - in: path
        *         name: clientId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the client
        *     responses:
        *       200:
        *         description: client appointments fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/client/:clientId", this.controller.getClientAppointments);

        /**
         * @swagger
         * /api/v1/appointments/accept-reschedule:
         *   patch:
         *     summary: Accept rescheduled appointments
         *     tags: [appointments]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: array
         *             items:
         *               type: string
         *               format: uuid
         *             example:
         *               - "550e8400-e29b-41d4-a716-446655440000"
         *               - "550e8400-e29b-41d4-a716-446655440111"
         *     responses:
         *       200:
         *         description: Appointments updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Appointment not found
         */
        this.router.put("/", this.controller.acceptRescheduleAppointment);

        /**
         * @swagger
         * /api/v1/appointments/reject-reschedule:
         *   patch:
         *     summary: Reject rescheduled appointments
         *     tags: [appointments]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: array
         *             items:
         *               type: string
         *               format: uuid
         *             example:
         *               - "550e8400-e29b-41d4-a716-446655440000"
         *               - "550e8400-e29b-41d4-a716-446655440111"
         *     responses:
         *       200:
         *         description: Appointments updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Appointment not found
         */
        this.router.put("/", this.controller.rejectRescheduleAppointment);

    }

    getRouter() {
        return this.router;
    }
}

export default new AppointmentRoutes().getRouter();