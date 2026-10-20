import express from "express";
import ClientFormController from "../controllers/clientFormController.js";
import ClientFormDto from "../dto/clientFormDto.js";
import { clientProtect, staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientFormDto:
 *       type: object
 *       required:
 *         - tenantClientId
 *         - formId
 *       properties:
 *         tenantClientId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the tenant client
 *         formId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the form
 */

class ClientFormRoutes {
    constructor() {
        this.controller = new ClientFormController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/client-forms:
         *   post:
         *     summary: Create Client Form
         *     tags: [client-forms]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientFormDto'
         *     responses:
         *       201:
         *         description: Client Form created successfully
         */
        this.router.post(
            "/",
            clientProtect(),
            ClientFormDto.createClientFormDto,
            this.controller.createClientForm
        );

        /**
         * @swagger
         * /api/v1/client-forms/tenant/:
         *   post:
         *     summary: Create Client Form
         *     tags: [client-forms]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientFormDto'
         *     responses:
         *       201:
         *         description: Client Form created successfully
         */
        this.router.post(
            "/tenant/",
            staffProtect(),
            ClientFormDto.createClientFormDto,
            this.controller.createClientForm
        );

        /**
         * @swagger
         * /api/v1/client-forms/{tenantClientId}:
         *   get:
         *     summary: Get Client Forms
         *     tags: [client-forms]
         *     parameters:
         *       - in: path
         *         name: tenantClientId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Forms fetched successfully
         */
        this.router.get("/:tenantClientId", clientProtect(), this.controller.getClientForms);

        /**
         * @swagger
         * /api/v1/client-forms/tenant/{tenantClientId}:
         *   get:
         *     summary: Get Client Forms
         *     tags: [client-forms]
         *     parameters:
         *       - in: path
         *         name: tenantClientId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Forms fetched successfully
         */
        this.router.get("/tenant/:tenantClientId", staffProtect(), this.controller.getClientForms);

        /**
         * @swagger
         * /api/v1/client-forms/count/status/{tenantClientId}:
         *   get:
         *     summary: count client forms
         *     tags: [client-forms]
         *     parameters:
         *       - in: path
         *         name: tenantClientId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Forms counted successfully
         */
        this.router.get("/count/status/:tenantClientId", clientProtect(), this.controller.countAllClientFormsByStatus);
    }

    getRouter() {
        return this.router;
    }
}

export default new ClientFormRoutes().getRouter();
