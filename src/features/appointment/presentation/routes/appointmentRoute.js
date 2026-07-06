import express from "express";
import AppointmentDto from "../dto/appointmentDto.js";
import AppointmentController from "../controllers/appointmentController.js";
import { clientProtect, staffProtect } from "../../../../middleware/auth_handlers.js";

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
 *           description: List of clinician objects
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Clinician identifier
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
 *           description: List of clinician objects
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Clinician identifier
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
 *         reasonForReschedule:
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
        this.router.post("/", staffProtect(), AppointmentDto.createAppointmentDto, this.controller.createAppointment);

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
        this.router.put("/", staffProtect(), AppointmentDto.updateAppointmentDto, this.controller.updateAppointment);

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
        this.router.get("/tenant/:tenantId", staffProtect(), this.controller.getTenantAppointments);

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
        this.router.get("/tenant/rescheduled/:tenantId", staffProtect(), this.controller.getTenantRescheduledAppointments);

        /**
        * @swagger
        * /api/v1/appointments/clinician/{clientId}/{tenantId}:
        *   get:
        *     summary: gets clinicians by client id
        *     tags: [Clients]
        *     parameters:
        *       - in: path
        *         name: clientId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the client
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the tenant
        *     responses:
        *       200:
        *         description: clinicians fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/clinician/:clientId/:tenantId", staffProtect(), this.controller.getCliniciansByClientId);

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
        this.router.get("/staff/:staffId", staffProtect(), this.controller.getStaffAppointments);

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
        this.router.get("/tenant/canceled/:tenantId", staffProtect(), this.controller.getTenantCanceledAppointments);

        /**
        * @swagger
        * /api/v1/appointments/client/canceled/{clientId}:
        *   get:
        *     summary: get client canceled appointments
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
        this.router.get("/client/canceled/:clientId", staffProtect(), this.controller.getClientCanceledAppointments);

        /**
        * @swagger
        * /api/v1/appointments/client/canceled/client/{clientId}:
        *   get:
        *     summary: get client canceled appointments
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
        this.router.get("/client/canceled/client/:clientId", clientProtect(), this.controller.getClientCanceledAppointments);

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
        this.router.get("/staff/canceled/:staffId", staffProtect(), this.controller.getStaffCanceledAppointments);

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
        this.router.get("/staff/rescheduled/:staffId", staffProtect(), this.controller.getStaffRescheduledAppointments);

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
        this.router.get("/client/:clientId", staffProtect(), this.controller.getClientAppointments);

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
         *               type: object
         *               properties:
         *                 id:
         *                   type: string
         *                   format: uuid
         *                   description: Appointment ID to reject reschedule for
         *             example:
         *               - id: "550e8400-e29b-41d4-a716-446655440000"
         *               - id: "550e8400-e29b-41d4-a716-446655440111"
         *     responses:
         *       200:
         *         description: Appointments updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Appointment not found
         */
        this.router.patch("/accept-reschedule", staffProtect(), this.controller.acceptRescheduleAppointment);

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
         *               type: object
         *               properties:
         *                 id:
         *                   type: string
         *                   format: uuid
         *                   description: Appointment ID to reject reschedule for
         *             example:
         *               - id: "550e8400-e29b-41d4-a716-446655440000"
         *               - id: "550e8400-e29b-41d4-a716-446655440111"
         *     responses:
         *       200:
         *         description: Appointments updated successfully
         *       400:
         *         description: Validation error
         *       404:
         *         description: Appointment not found
         */
        this.router.patch("/reject-reschedule", staffProtect(), this.controller.rejectRescheduleAppointment);

        /**
        * @swagger
        * /api/v1/appointments/reschedule:
        *   patch:
        *     summary: reschedule appointment
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
        this.router.patch("/reschedule", staffProtect(), AppointmentDto.updateAppointmentDto, this.controller.updateAppointment);

        /**
        * @swagger
        * /api/v1/appointments/tenant/upcoming/{tenantId}:
        *   get:
        *     summary: get tenant upcoming appointments
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
        this.router.get("/tenant/upcoming/:tenantId", staffProtect(), this.controller.getTenantUpcomingAppointments);

        /**
        * @swagger
        * /api/v1/appointments/tenant/past/{tenantId}:
        *   get:
        *     summary: get tenant past appointments
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
        this.router.get("/tenant/past/:tenantId", staffProtect(), this.controller.getTenantPastAppointments);

        /**
        * @swagger
        * /api/v1/appointments/tenant/metric/{tenantId}/{status}/{period}:
        *   get:
        *     summary: get tenant appointments metrics
        *     tags: [appointments]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the tenant
        *       - in: path
        *         name: status
        *         required: true
        *         schema:
        *           type: string
        *         description: The status of the appointment
        *       - in: path
        *         name: period
        *         required: true
        *         schema:
        *           type: string
        *         description: The period of the appointment
        *     responses:
        *       200:
        *         description: tenant appointments fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/metric/:tenantId/:status/:period", staffProtect(), this.controller.appointmentsMetric);

        /**
        * @swagger
        * /api/v1/appointments/{id}:
        *   get:
        *     summary: get appointment
        *     tags: [appointments]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the appointment
        *     responses:
        *       200:
        *         description: appointment fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:id", staffProtect(), this.controller.getAppointment);

        /**
        * @swagger
        * /api/v1/appointments/client/upcoming/{clientId}:
        *   get:
        *     summary: get client upcoming appointments
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
        this.router.get("/client/upcoming/:clientId", staffProtect(), this.controller.getClientUpcomingAppointments);

        /**
        * @swagger
        * /api/v1/appointments/client/upcoming/client/{clientId}:
        *   get:
        *     summary: get client upcoming appointments
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
        this.router.get("/client/upcoming/client/:clientId", clientProtect(), this.controller.getClientUpcomingAppointments);

        /**
        * @swagger
        * /api/v1/appointments/client/past/{clientId}:
        *   get:
        *     summary: get client past appointments
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
        this.router.get("/client/past/:clientId", staffProtect(), this.controller.getClientPastAppointments);

        /**
        * @swagger
        * /api/v1/appointments/client/rescheduled/{clientId}:
        *   get:
        *     summary: get client rescheduled appointments request
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
        this.router.get("/client/rescheduled/:clientId", staffProtect(), this.controller.getClientRescheduledAppointments);

        /**
        * @swagger
        * /api/v1/appointments/client/rescheduled/client/{clientId}:
        *   get:
        *     summary: get client rescheduled appointments request
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
        this.router.get("/client/rescheduled/client/:clientId", clientProtect(), this.controller.getClientRescheduledAppointments);

        /**
        * @swagger
        * /api/v1/appointments/client/past/{clientId}:
        *   get:
        *     summary: get client past appointments
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
        this.router.get("/client/past/:clientId", staffProtect(), this.controller.getClientPastAppointments);

        /**
        * @swagger
        * /api/v1/appointments/staff/upcoming/{staffId}:
        *   get:
        *     summary: get staff upcoming appointments
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
        this.router.get("/staff/upcoming/:staffId", staffProtect(), this.controller.getStaffUpcomingAppointments);

        /**
        * @swagger
        * /api/v1/appointments/staff/past/{staffId}:
        *   get:
        *     summary: get staff past appointments
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
        this.router.get("/staff/past/:staffId", staffProtect(), this.controller.getStaffPastAppointments);

    }

    getRouter() {
        return this.router;
    }
}

export default new AppointmentRoutes().getRouter();