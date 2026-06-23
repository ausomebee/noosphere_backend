import express from "express";
import SessionDto from "../dto/sessionDto.js";
import SessionController from "../controllers/sessionController.js";
import { staffProtect, clientProtect } from "../../../../middleware/auth_handlers.js";

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
            staffProtect(),
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
            staffProtect(),
            SessionDto.updateSessionDto,
            this.controller.updateSession
        );

        /**
         * @swagger
         * /api/v1/sessions/service/{tenantId}/{serviceCodeId}:
         *   get:
         *     summary: Get sessions for a tenant filtered by service code
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: Tenant ID
         *       - in: path
         *         name: serviceCodeId
         *         required: true
         *         schema:
         *           type: string
         *         description: Service code ID
         *     responses:
         *       200:
         *         description: Sessions fetched successfully
         *       404:
         *         description: No sessions found
         *       500:
         *         description: Server error
         */
        this.router.get(
            "/service/:tenantId/:serviceCodeId",
            staffProtect(),
            this.controller.getSessionsByServiceCode
        );

        /**
         * @swagger
         * /api/v1/sessions/nudge-client/{clientId}/{senderId}:
         *   post:
         *     summary: nudge client
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: clientId
         *         required: true
         *         schema:
         *           type: string
         *         description: client ID
         *       - in: path
         *         name: senderId
         *         required: true
         *         schema:
         *           type: string
         *         description: staff ID
         *     responses:
         *       200:
         *         description: client nudged successfully
         *       404:
         *         description: No sessions found
         *       500:
         *         description: Server error
         */
        this.router.post(
            "/nudge-client/:clientId/:senderId",
            staffProtect(),
            this.controller.nudgeClient
        );

        /**
        * @swagger
        * /api/v1/sessions/session-type/{tenantId}/{sessionTypeId}:
        *   get:
        *     summary: Get sessions for a tenant filtered by session type
        *     tags: [sessions]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: Tenant ID
        *       - in: path
        *         name: sessionTypeId
        *         required: true
        *         schema:
        *           type: string
        *         description: Session type ID
        *     responses:
        *       200:
        *         description: Sessions fetched successfully
        *       404:
        *         description: No sessions found
        *       500:
        *         description: Server error
        */
        this.router.get(
            "/session-type/:tenantId/:sessionTypeId",
            staffProtect(),
            this.controller.getSessionsBySessionType
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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
            this.controller.getSessionsAwaitingApproval
        );

        /**
         * @swagger
         * /api/v1/sessions/target/{targetId}/{clientId}/{tenantId}:
         *   get:
         *     summary: Get sessions for a given targetId, clientId and tenantId
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: targetId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Target ID
         *       - in: path
         *         name: clientId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Client ID
         *       - in: path
         *         name: tenantId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Tenant ID (foreign key)
         *     responses:
         *       200:
         *         description: Session data fetched successfully
         */
        this.router.get(
            "/target/:targetId/:clientId/:tenantId",
            staffProtect(),
            this.controller.getSessionsByTargetId
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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
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
            staffProtect(),
            this.controller.getClientSessionOverview
        );

        /**
         * @swagger
         * /api/v1/sessions/client/overview/client/{clientId}:
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
            "/client/overview/client/:clientId",
            clientProtect(),
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
            staffProtect(),
            this.controller.clientOverviewGraph
        );

        /**
         * @swagger
         * /api/v1/sessions/client/overview-chart/client/{clientId}/{groupBy}:
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
            "/client/overview-chart/client/:clientId/:groupBy",
            clientProtect(),
            this.controller.clientOverviewGraph
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new SessionRoutes().getRouter();
