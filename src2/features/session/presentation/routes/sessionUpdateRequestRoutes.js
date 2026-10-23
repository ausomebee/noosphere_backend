import express from "express";
import SessionUpdateRequestController from "../controllers/sessionUpdateRequestController.js";
import SessionUpdateRequestDto from "../dto/sessionUpdateRequestDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     SessionUpdateRequestCreateDto:
 *       type: object
 *       required:
 *         - sessionId
 *         - description
 *         - requestedBy
 *       properties:
 *         sessionId:
 *           type: string
 *           format: uuid
 *           example: "b3c2f1e4-1234-5678-9101-abcdef123456"
 *         description:
 *           type: string
 *           example: "Request to update session time"
 *         requestedBy:
 *           type: string
 *           format: uuid
 *           example: "f1a2b3c4-5678-9101-1121-abcdef123456"
 *
 *     SessionUpdateRequestUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         description:
 *           type: string
 */

class SessionUpdateRequestRoutes {
    constructor() {
        this.controller = new SessionUpdateRequestController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/sessions-update-requests:
         *   post:
         *     summary: Create a session update request
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SessionUpdateRequestCreateDto'
         *     responses:
         *       201:
         *         description: Session update request created successfully
         */
        this.router.post(
            "/",
            SessionUpdateRequestDto.createSessionUpdateRequestDto,
            this.controller.createSessionUpdateRequest
        );

        /**
         * @swagger
         * /api/v1/sessions-update-requests:
         *   put:
         *     summary: Update a session update request
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SessionUpdateRequestUpdateDto'
         *     responses:
         *       200:
         *         description: Session update request updated successfully
         */
        this.router.put(
            "/",
            SessionUpdateRequestDto.updateSessionUpdateRequestDto,
            this.controller.updateSessionUpdateRequest
        );

        /**
         * @swagger
         * /api/v1/sessions-update-requests/{id}:
         *   get:
         *     summary: Get a single session update request
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: SessionUpdateRequest ID
         *     responses:
         *       200:
         *         description: Session update request fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleSessionUpdateRequest
        );

        /**
         * @swagger
         * /api/v1/sessions-update-requests/session/{sessionId}:
         *   get:
         *     summary: Get all session update requests for a specific session
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
         *         description: Session update requests fetched successfully
         */
        this.router.get(
            "/session/:sessionId",
            this.controller.getSessionUpdateRequests
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new SessionUpdateRequestRoutes().getRouter();
