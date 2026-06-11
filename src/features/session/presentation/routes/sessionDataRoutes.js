import express from "express";
import SessionDataController from "../controllers/sessionDataController.js";
import SessionDataDto from "../dto/sessionDataDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     SessionDataCreateDto:
 *       type: object
 *       required:
 *         - sessionId
 *         - targetId
 *         - data
 *       properties:
 *         sessionId:
 *           type: string
 *           format: uuid
 *           example: "b3c2f1e4-1234-5678-9101-abcdef123456"
 *         targetId:
 *           type: string
 *           format: uuid
 *           example: "f1a2b3c4-5678-9101-1121-abcdef123456"
 *         data:
 *           type: object
 *           example: { "score": 95, "remarks": "Great progress" }
 *
 *     SessionDataUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         sessionId:
 *           type: string
 *           format: uuid
 *         targetId:
 *           type: string
 *           format: uuid
 *         data:
 *           type: object
 */

class SessionDataRoutes {
    constructor() {
        this.controller = new SessionDataController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/session-data:
         *   post:
         *     summary: Create a session data record
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SessionDataCreateDto'
         *     responses:
         *       201:
         *         description: Session data created successfully
         */
        this.router.post(
            "/",
            staffProtect(),
            SessionDataDto.createSessionDataDto,
            this.controller.createSessionData
        );

        /**
         * @swagger
         * /api/v1/session-data:
         *   put:
         *     summary: Update a session data record
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SessionDataUpdateDto'
         *     responses:
         *       200:
         *         description: Session data updated successfully
         */
        this.router.put(
            "/",
            staffProtect(),
            SessionDataDto.updateSessionDataDto,
            this.controller.updateSessionData
        );

        /**
         * @swagger
         * /api/v1/session-data/{id}:
         *   get:
         *     summary: Get a single session data record
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: SessionData ID
         *     responses:
         *       200:
         *         description: Session data fetched successfully
         */
        this.router.get(
            "/:id",
            staffProtect(),
            this.controller.getSingleSessionData
        );

        /**
         * @swagger
         * /api/v1/session-data/session/{sessionId}:
         *   get:
         *     summary: Get all session data records for a specific session
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
         *         description: Session data records fetched successfully
         */
        this.router.get(
            "/session/:sessionId",
            staffProtect(),
            this.controller.getSessionDatas
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new SessionDataRoutes().getRouter();
