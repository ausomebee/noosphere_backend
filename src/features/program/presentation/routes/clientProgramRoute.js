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

        /**
         * @swagger
         * /api/v1/client-programs/{clientId}:
         *   get:
         *     summary: Gets client programs
         *     tags: [program]
         *     parameters:
         *       - in: path
         *         name: clientId
         *         required: true
         *         schema:
         *           type: string
         *         description: The tenant ID of the Domain
         *     responses:
         *       200:
         *         description: programs fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/:clientId", this.controller.getClientPrograms);

        /**
         * @swagger
         * /api/v1/client-programs/target/{clientId}:
         *   get:
         *     summary: Gets client program with targets
         *     tags: [program]
         *     parameters:
         *       - in: path
         *         name: clientId
         *         required: true
         *         schema:
         *           type: string
         *         description: The tenant ID of the Domain
         *     responses:
         *       200:
         *         description: programs fetched successfully
         *       400:
         *         description: Validation error
         */
        this.router.get("/target/:clientId", this.controller.getClientProgramAndTraget);
    }

    getRouter() {
        return this.router;
    }
}

export default new ClientProgramRoutes().getRouter();