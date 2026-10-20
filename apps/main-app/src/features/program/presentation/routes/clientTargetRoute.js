import express from "express";
import ClientTargetDto from "../dto/clientTargetDto.js";
import ClientTargetController from "../controllers/clientTargetController.js";
import { clientProtect, staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientTargetDto:
 *       type: object
 *       required:
 *         - clientId
 *         - targetId
 *         - programId
 *       properties:
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the client
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         targetId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the target
 *           example: "223e4567-e89b-12d3-a456-426614174111"
 *         programId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the program
 *           example: "223e4567-e89b-12d3-a456-426614174111"
 */

class ClientTargetRoutes {
    constructor() {
        this.controller = new ClientTargetController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/client-targets:
         *   post:
         *     summary: Create Client Target
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientTargetDto'
         *     responses:
         *       201:
         *         description: Client Target created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", staffProtect(), ClientTargetDto.createClientTargetDto, this.controller.createClientTarget);

        /**
         * @swagger
         * /api/v1/client-targets/{targetId}/client/{clientId}:
         *   get:
         *     summary: Get All Client Targets
         *     tags: [program]
         *     parameters:
         *       - in: path
         *         name: clientId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         example: "123e4567-e89b-12d3-a456-426614174000"
         *         description: Unique identifier of the client
         *       - in: path
         *         name: targetId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: false
         *         example: "223e4567-e89b-12d3-a456-426614174111"
         *         description: Unique identifier of the target
         *     description: Fetch all client targets, optionally filtered by targetId
         *     responses:
         *       201:
         *         description: Client Targets fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/:targetId/client/:clientId", staffProtect(), this.controller.getAllClientTargets);

    }

    getRouter() {
        return this.router;
    }
}

export default new ClientTargetRoutes().getRouter();