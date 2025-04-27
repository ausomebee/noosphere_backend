import express from "express";
import ClientController from "../controllers/clientController.js";
import ClientDto from "../dto/clientDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateClientDto:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - phoneNumber
 *         - stage
 *         - gender
 *         - DOB
 *         - tenantId
 *         - dbAccess
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
 *           description: Must include uppercase, lowercase, number, special char and be at least 8 characters
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *         stage:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         DOB:
 *           type: string
 *           format: date
 *         tenantId:
 *           type: string
 *           format: uuid
 *         dbAccess:
 *           type: boolean
 *
 *     CreateClientTenantDto:
 *       type: object
 *       required:
 *         - dbAccess
 *         - stage
 *         - clientId
 *         - tenantId
 *       properties:
 *         dbAccess:
 *           type: boolean
 *         stage:
 *           type: string
 *         clientId:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *
 *     ClientSigninDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
 *           description: Must include uppercase, lowercase, number, special char and be at least 8 characters
 */

class ClientRoutes {
    constructor() {
        this.controller = new ClientController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/client/createclient:
         *   post:
         *     summary: Create a new client
         *     tags: [Client]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateClientDto'
         *     responses:
         *       201:
         *         description: Client created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/createclient", ClientDto.createClientDto, this.controller.createClient);

        /**
         * @swagger
         * /api/v1/client/createclienttenant:
         *   post:
         *     summary: Create a new tenant client staff
         *     tags: [Client]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateClientTenantDto'
         *     responses:
         *       201:
         *         description: Tenant client created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/createclienttenant", ClientDto.createClientTenantDto, this.controller.createClientTenant);

        /**
         * @swagger
         * /api/v1/client/clientsignindto:
         *   post:
         *     summary: Client sign in
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientSigninDto'
         *     responses:
         *       200:
         *         description: Sign-in successful
         *       401:
         *         description: Invalid credentials
         */
        this.router.post("/clientsignindto", ClientDto.clientSigninDto, this.controller.clientSignin);

    }

    getRouter() {
        return this.router;
    }
}

export default new ClientRoutes().getRouter();