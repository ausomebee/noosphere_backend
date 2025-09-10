import express from "express";
import ClientProgramController from "../controllers/clientProgramController.js";
import ClientProgramDto from "../dto/clientProgramDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientProgramDto:
 *       type: object
 *       required:
 *         - clientId
 *         - programId
 *       properties:
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the client
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         programId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the program
 *           example: "223e4567-e89b-12d3-a456-426614174111"
 */

class ClientProgramRoutes {
    constructor() {
        this.controller = new ClientProgramController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/client-programs:
         *   post:
         *     summary: Create Client Program
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientProgramDto'
         *     responses:
         *       201:
         *         description: Client Program created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", ClientProgramDto.createClientProgramDto, this.controller.createClientProgram);

    }

    getRouter() {
        return this.router;
    }
}

export default new ClientProgramRoutes().getRouter();