import express from "express";
import SessionApprovalController from "../controllers/sessionApprovalController.js";
import SessionApprovalDto from "../dto/sessionApprovalDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     SessionApprovalCreateDto:
 *       type: object
 *       required:
 *         - sessionId
 *         - confirmDelivery
 *         - signature
 *       properties:
 *         sessionId:
 *           type: string
 *           format: uuid
 *           example: "b3c2f1e4-1234-5678-9101-abcdef123456"
 *         confirmDelivery:
 *           type: boolean
 *           example: true
 *         rateService:
 *           type: integer
 *           example: 5
 *         rateTherapist:
 *           type: integer
 *           example: 4
 *         feedback:
 *           type: string
 *           example: "Very satisfied"
 *         signature:
 *           type: string
 *           example: "base64-signature-string"
 *
 *     SessionApprovalUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         confirmDelivery:
 *           type: boolean
 *         rateService:
 *           type: integer
 *         rateTherapist:
 *           type: integer
 *         feedback:
 *           type: string
 *         signature:
 *           type: string
 */

class SessionApprovalRoutes {
    constructor() {
        this.controller = new SessionApprovalController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/sessions-approval:
         *   post:
         *     summary: Create a session approval
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SessionApprovalCreateDto'
         *     responses:
         *       201:
         *         description: Session approval created successfully
         */
        this.router.post(
            "/",
            staffProtect,
            SessionApprovalDto.createSessionApprovalDto,
            this.controller.createSessionApproval
        );

        /**
         * @swagger
         * /api/v1/sessions-approval:
         *   put:
         *     summary: Update a session approval
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SessionApprovalUpdateDto'
         *     responses:
         *       200:
         *         description: Session approval updated successfully
         */
        this.router.put(
            "/",
            staffProtect,
            SessionApprovalDto.updateSessionApprovalDto,
            this.controller.updateSessionApproval
        );

        /**
         * @swagger
         * /api/v1/sessions-approval/{id}:
         *   get:
         *     summary: Get a single session approval
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: SessionApproval ID
         *     responses:
         *       200:
         *         description: Session approval fetched successfully
         */
        this.router.get(
            "/:id",
            staffProtect,
            this.controller.getSingleSessionApproval
        );

        /**
         * @swagger
         * /api/v1/sessions-approval/session/{sessionId}:
         *   get:
         *     summary: Get all session approvals for a specific session
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: sessionId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Session ID (foreign key)
         *     responses:
         *       200:
         *         description: Session approvals fetched successfully
         */
        this.router.get(
            "/session/:sessionId",
            staffProtect,
            this.controller.getSessionApprovals
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new SessionApprovalRoutes().getRouter();
