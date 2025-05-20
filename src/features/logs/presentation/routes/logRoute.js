import express from "express";
import LogsDto from "../dto/logDto.js";
import LogsController from "../controllers/logController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateLogDto:
 *       type: object
 *       properties:
 *         adminId:
 *           type: string
 *           format: uuid
 *           description: Optional Admin ID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: Optional Client ID
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Optional Tenant ID
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         featureId:
 *           type: string
 *           format: uuid
 *           description: Optional Feature ID
 *           example: "550e8400-e29b-41d4-a716-446655440003"
 *         module:
 *           type: string
 *           description: Name of the module
 *           example: "Authentication"
 *         action:
 *           type: string
 *           description: Performed action
 *           example: "Login attempt"
 *         details:
 *           type: string
 *           description: Optional detailed description
 *           example: "User attempted to log in with wrong credentials"
 *         ipAddress:
 *           type: string
 *           description: IP address of the requester
 *           example: "192.168.1.100"
 *       required:
 *         - module
 *         - action
 *         - ipAddress
 */

class LogsRoutes {
    constructor() {
        this.controller = new LogsController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/logs:
         *   post:
         *     summary: Create log 
         *     tags: [log]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateLogDto'
         *     responses:
         *       201:
         *         description: Log created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", LogsDto.createLogDto, this.controller.createLog);

        /**
        * @swagger
        * /api/v1/logs/{id}:
        *   get:
        *     summary: gets single log
        *     tags: [log]
        *     parameters:
        *       - in: path
        *         name: logId
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the log
        *     responses:
        *       200:
        *         description: Log fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:id", LogsDto.checkIdDto, this.controller.getSingleLog);

    }

    getRouter() {
        return this.router;
    }
}

export default new LogsRoutes().getRouter();