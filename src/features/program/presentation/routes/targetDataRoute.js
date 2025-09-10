import express from "express";
import TargetDataDto from "../dto/targetDataDto.js";
import TargetDataController from "../controllers/targetDataController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TargetDataDto:
 *       type: object
 *       required:
 *         - clientId
 *         - targetId
 *         - data
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
 *         data:
 *           type: object
 *           additionalProperties: true
 *           description: JSON payload containing target data (up to 5000 characters if serialized)
 *           example:
 *             metrics:
 *               score: 87
 *               level: "intermediate"
 *             preferences:
 *               notifications: true
 *               theme: "dark"
 */

class TargetDataRoutes {
    constructor() {
        this.controller = new TargetDataController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/target-data:
         *   post:
         *     summary: Create Target Data
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientProgramDto'
         *     responses:
         *       201:
         *         description: Target Data created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", TargetDataDto.createTargetDataDto, this.controller.createTargetData);

    }

    getRouter() {
        return this.router;
    }
}

export default new TargetDataRoutes().getRouter();