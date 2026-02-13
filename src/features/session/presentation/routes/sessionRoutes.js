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
 *         createdBy:
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
         * /api/v1/sessions/approve/{id}/{supervisorId}:
         *   patch:
         *     summary: approve a single session
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Session ID
         *       - in: path
         *         name: supervisorId
         *         schema:
         *           type: string
         *         required: true
         *         description: Supervisor ID
         *     responses:
         *       200:
         *         description: Session approved successfully
         */
        this.router.patch(
            "/approve/:id/:supervisorId",
            this.controller.approveSession
        );

        /**
         * @swagger
         * /api/v1/sessions/performance/{targetId}/{clientId}:
         *   get:
         *     summary: Get client performance graph
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: targetId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: target ID
         *       - in: path
         *         name: clientId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: client ID
         *     responses:
         *       200:
         *         description: Session data fetched successfully
         */
        this.router.get(
            "/performance/:targetId/:clientId",
            this.controller.getTargetPerformanceGraph
        );

        /**
         * @swagger
         * /api/v1/sessions/client/{clientId}:
         *   get:
         *     summary: Get client sessions
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: clientId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Client ID
         *     responses:
         *       200:
         *         description: Session data fetched successfully
         */
        this.router.get(
            "/client/:clientId",
            this.controller.getClientSessions
        );

        /**
         * @swagger
         * /api/v1/sessions/client/awaiting-feedback/{clientId}:
         *   get:
         *     summary: Get client sessions awaiting feedback
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: clientId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Client ID
         *     responses:
         *       200:
         *         description: Session data fetched successfully
         */
        this.router.get(
            "/client/awaiting-feedback/:clientId",
            this.controller.getSessionsAwaitingApproval
        );

        /**
         * @swagger
         * /api/v1/sessions/tenant/overview/{tenantId}:
         *   get:
         *     summary: tenant sessions overview
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         schema:
         *           type: string
         *         required: true
         *         description: Tenant ID
         *       
         *     responses:
         *       200:
         *         description: overvoew fetched successfully
         */
        this.router.get(
            "/tenant/overview/:tenantId",
            this.controller.getProductivityOverview
        );

        /**
         * @swagger
         * /api/v1/sessions/reject/{id}/{supervisorId}:
         *   patch:
         *     summary: reject a single session
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Session ID
         *       - in: path
         *         name: supervisorId
         *         schema:
         *           type: string
         *         required: true
         *         description: Supervisor ID
         *     responses:
         *       200:
         *         description: Session rejected successfully
         */
        this.router.patch(
            "/reject/:id/:supervisorId",
            this.controller.rejectSession
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

        /**
         * @swagger
         * /api/v1/sessions/claims/{tenantId}:
         *   get:
         *     summary: Get all claims for a given tenantId
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
         *         description: claims fetched successfully
         */
        this.router.get(
            "/claims/:tenantId",
            this.controller.getClaims
        );

        /**
        * @swagger
        * /api/v1/sessions/client-approval/{tenantId}/{clientId}:
        *   get:
        *     summary: Get all sessions awaition approval for a given clientId
        *     tags: [sessions]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         schema:
        *           type: string
        *         required: true
        *         description: tenant ID (foreign key)
        *       - in: path
        *         name: clientId
        *         schema:
        *           type: string
        *         required: true
        *         description: client ID (foreign key)
        *     responses:
        *       200:
        *         description: claims fetched successfully
        */
        this.router.get(
            "/client-approval/:tenantId/:clientId",
            this.controller.getClientAwaitingApproval
        );

        /**
         * @swagger
         * /api/v1/sessions/client/overview/{clientId}:
         *   get:
         *     summary: Get client session overview
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: clientId
         *         schema:
         *           type: string
         *         required: true
         *         description: client Id
         *     responses:
         *       200:
         *         description: Session overview fetched successfully
         */
        this.router.get(
            "/client/overview/:clientId",
            this.controller.getClientSessionOverview
        );

        /**
         * @swagger
         * /api/v1/sessions/client/overview-chart/{clientId}/{groupBy}:
         *   get:
         *     summary: Get client session overview chart
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: clientId
         *         schema:
         *           type: string
         *         required: true
         *         description: client Id
         *       - in: path
         *         name: groupBy
         *         schema:
         *           type: string
         *         required: true
         *         description: group by (year, month)
         *     responses:
         *       200:
         *         description: Session overview chart fetched successfully
         */
        this.router.get(
            "/client/overview-chart/:clientId/:groupBy",
            this.controller.clientOverviewGraph
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new SessionRoutes().getRouter();
