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
         *             $ref: '#/components/schemas/TargetDataDto'
         *     responses:
         *       201:
         *         description: Target Data created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", TargetDataDto.createTargetDataDto, this.controller.createTargetData);

        /**
         * @swagger
         * /api/v1/target-data/{targetId}/client/{clientId}:
         *   get:
         *     summary: Get Target Data by ID
         *     tags: [program]
         *     parameters:
         *      - in: path
         *        name: targetId
         *        required: true
         *        schema:
         *          type: string
         *        description: The Target ID
         *      - in: path
         *        name: clientId
         *        required: true
         *        schema:
         *          type: string
         *        description: The Client ID
         *     responses:
         *       201:
         *         description: Target Data fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/:targetId/client/:clientId", this.controller.getClientTargetData);

    }

    getRouter() {
        return this.router;
    }
}

export default new TargetDataRoutes().getRouter();