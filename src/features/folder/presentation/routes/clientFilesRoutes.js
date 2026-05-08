import express from "express";
import ClientFilesController from "../controllers/clientFilesController.js";
import ClientFilesDto from "../dtos/clientFilesDto.js";
import { clientProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientFilesCreateDto:
 *       type: object
 *       required:
 *         - name
 *         - url
 *         - size
 *         - fileType
 *         - clientTenantId
 *       properties:
 *         name:
 *           type: string
 *           example: "Budget.xlsx"
 *         url:
 *           type: string
 *           format: uri
 *           example: "https://example.com/files/budget.xlsx"
 *         size:
 *           type: string
 *           example: "2MB"
 *         fileType:
 *           type: string
 *           example: "xlsx"
 *         clientTenantId:
 *           type: string
 *           format: uuid
 *         folderId:
 *           type: string
 *           format: uuid
 *         uploadedBy:
 *           type: string
 *           format: uuid
 *
 *     ClientFilesUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *         size:
 *           type: string
 *         fileType:
 *           type: string
 *         folderId:
 *           type: string
 *           format: uuid
 *         uploadedBy:
 *           type: string
 *           format: uuid
 */

class ClientFilesRoutes {
    constructor() {
        this.controller = new ClientFilesController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/client-files:
         *   post:
         *     summary: Create a client file
         *     tags: [folder]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientFilesCreateDto'
         *     responses:
         *       201:
         *         description: Client file created successfully
         */
        this.router.post(
            "/",
            clientProtect,
            ClientFilesDto.createClientFileDto,
            this.controller.createClientFile
        );

        /**
         * @swagger
         * /api/v1/client-files:
         *   put:
         *     summary: Update a client file
         *     tags: [folder]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientFilesUpdateDto'
         *     responses:
         *       201:
         *         description: Client file updated successfully
         */
        this.router.put(
            "/",
            clientProtect,
            ClientFilesDto.updateClientFileDto,
            this.controller.updateClientFile
        );

        /**
         * @swagger
         * /api/v1/client-files/{id}:
         *   get:
         *     summary: Get a single client file
         *     tags: [folder]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Client file ID
         *     responses:
         *       200:
         *         description: Client file fetched successfully
         */
        this.router.get(
            "/:id",
            clientProtect,
            this.controller.getSingleClientFile
        );

        /**
         * @swagger
         * /api/v1/client-files/recent/{clientTenantId}:
         *   get:
         *     summary: Get a recent client files
         *     tags: [folder]
         *     parameters:
         *       - in: path
         *         name: clientTenantId
         *         schema:
         *           type: string
         *         required: true
         *         description: Clienttenant ID
         *     responses:
         *       200:
         *         description: Client files fetched successfully
         */
        this.router.get(
            "/recent/:clientTenantId",
            clientProtect,
            this.controller.findRecentFilesByClientTenant
        );

        /**
         * @swagger
         * /api/v1/client-files/client/{clientTenantId}:
         *   get:
         *     summary: Get a client files
         *     tags: [folder]
         *     parameters:
         *       - in: path
         *         name: clientTenantId
         *         schema:
         *           type: string
         *         required: true
         *         description: Clienttenant ID
         *     responses:
         *       200:
         *         description: Client files fetched successfully
         */
        this.router.get(
            "/client/:clientTenantId",
            clientProtect,
            this.controller.findFilesByClientTenant
        );

        /**
         * @swagger
         * /api/v1/client-files/folder/{folderId}:
         *   get:
         *     summary: Get all client files in a given folder
         *     tags: [folder]
         *     parameters:
         *       - in: path
         *         name: folderId
         *         schema:
         *           type: string
         *         required: true
         *         description: The folder ID (foreign key)
         *     responses:
         *       200:
         *         description: Client files fetched successfully
         */
        this.router.get(
            "/folder/:folderId",
            clientProtect,
            this.controller.getClientFiles
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClientFilesRoutes().getRouter();
