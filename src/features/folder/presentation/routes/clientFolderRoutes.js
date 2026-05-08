import express from "express";
import ClientFolderController from "../controllers/clientFolderController.js";
import ClientFolderDto from "../dtos/clientFolderDto.js";
import { clientProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientFolderCreateDto:
 *       type: object
 *       required:
 *         - name
 *         - clientTenantId
 *       properties:
 *         name:
 *           type: string
 *           example: "Marketing Documents"
 *         clientTenantId:
 *           type: string
 *           format: uuid
 *
 *     ClientFolderUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 */

class ClientFolderRoutes {
    constructor() {
        this.controller = new ClientFolderController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/client-folders:
         *   post:
         *     summary: Create a client folder
         *     tags: [folder]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientFolderCreateDto'
         *     responses:
         *       201:
         *         description: Client folder created successfully
         */
        this.router.post(
            "/",
            clientProtect,
            ClientFolderDto.createClientFolderDto,
            this.controller.createClientFolder
        );

        /**
         * @swagger
         * /api/v1/client-folders:
         *   put:
         *     summary: Update a client folder
         *     tags: [folder]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientFolderUpdateDto'
         *     responses:
         *       201:
         *         description: Client folder updated successfully
         */
        this.router.put(
            "/",
            clientProtect,
            ClientFolderDto.updateClientFolderDto,
            this.controller.updateClientFolder
        );

        /**
         * @swagger
         * /api/v1/client-folders/{id}:
         *   get:
         *     summary: Get a single client folder
         *     tags: [folder]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Client folder ID
         *     responses:
         *       200:
         *         description: Client folder fetched successfully
         */
        this.router.get(
            "/:id",
            clientProtect,
            this.controller.getSingleClientFolder
        );

        /**
         * @swagger
         * /api/v1/client-folders/tenant/{clientTenantId}:
         *   get:
         *     summary: Get all client folders for a given clientTenantId
         *     tags: [folder]
         *     parameters:
         *       - in: path
         *         name: clientTenantId
         *         schema:
         *           type: string
         *         required: true
         *         description: The client tenant ID (foreign key)
         *     responses:
         *       200:
         *         description: Client folders fetched successfully
         */
        this.router.get(
            "/tenant/:clientTenantId",
            clientProtect,
            this.controller.getClientFolders
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClientFolderRoutes().getRouter();
