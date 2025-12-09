import express from "express";
import SessionDto from "../dto/sessionDto.js";
import SessionController from "../controllers/sessionController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     SessionCreateDto:
 *       type: object
 *       required:
 *         - note
 *         - appointmentId
 *         - startTime
 *         - endTime
 *       properties:
 *         note:
 *           type: string
 *           example: "Session notes"
 *         appointmentId:
 *           type: string
 *           format: uuid
 *         supervisorApprovalStatus:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           example: PENDING
 *         clientApprovalStatus:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           example: PENDING
 *         supervisorId:
 *           type: string
 *           format: uuid
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         travelStartTime:
 *           type: string
 *           format: date-time
 *         travelEndTime:
 *           type: string
 *           format: date-time
 *         sessionDatas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               targetId:
 *                 type: string
 *                 format: uuid
 *               data:
 *                 type: object
 *
 *     SessionUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         note:
 *           type: string
 *         appointmentId:
 *           type: string
 *           format: uuid
 *         supervisorApprovalStatus:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         clientApprovalStatus:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         supervisorId:
 *           type: string
 *           format: uuid
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         travelStartTime:
 *           type: string
 *           format: date-time
 *         travelEndTime:
 *           type: string
 *           format: date-time
 *         sessionDatas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               targetId:
 *                 type: string
 *                 format: uuid
 *               data:
 *                 type: object
 */

class SessionRoutes {
    constructor() {
        this.controller = new SessionController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/sessions:
         *   post:
         *     summary: Create a session
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SessionCreateDto'
         *     responses:
         *       201:
         *         description: Session created successfully
         */
        this.router.post(
            "/",
            SessionDto.createSessionDto,
            this.controller.createSession
        );

        /**
         * @swagger
         * /api/v1/sessions:
         *   put:
         *     summary: Update a session
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SessionUpdateDto'
         *     responses:
         *       200:
         *         description: Session updated successfully
         */
        this.router.put(
            "/",
            SessionDto.updateSessionDto,
            this.controller.updateSession
        );

        /**
         * @swagger
         * /api/v1/sessions/{id}:
         *   get:
         *     summary: Get a single session
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Session ID
         *     responses:
         *       200:
         *         description: Session fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleSession
        );

        /**
         * @swagger
         * /api/v1/sessions/appointment/{tenantId}:
         *   get:
         *     summary: Get all sessions for a given tenantId
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         schema:
         *           type: string
         *         required: true
         *         description: tenant ID (foreign key)
         *     responses:
         *       200:
         *         description: Sessions fetched successfully
         */
        this.router.get(
            "/appointment/:tenantId",
            this.controller.getSessions
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new SessionRoutes().getRouter();
