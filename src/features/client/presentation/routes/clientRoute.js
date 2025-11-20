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
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - gender
 *         - tenantId
 *         - pipelineStageId
 *         - stage
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John"
 *         stage:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         preferredName:
 *           type: string
 *           example: "Johnny"
 *         email:
 *           type: string
 *           format: email
 *           example: "johndoe@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+2348123456789"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         DOB:
 *           type: string
 *           format: date
 *           example: "1995-06-15"
 *         primaryPayer:
 *           type: string
 *           example: "Insurance Co."
 *         streetAddress:
 *           type: string
 *           example: "123 Banana Street"
 *         city:
 *           type: string
 *           example: "Lagos"
 *         state:
 *           type: string
 *           example: "Lagos State"
 *         country:
 *           type: string
 *           example: "Nigeria"
 *         zipCode:
 *           type: string
 *           example: "100001"
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *           example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         assignToClinician:
 *           type: string
 *           format: uuid
 *           example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         createdBy:
 *           type: string
 *           format: uuid
 *           example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         clientPortalAccess:
 *           type: boolean
 *           default: false
 *           example: false
 *         caregiverName:
 *           type: string
 *           example: "Mary Doe"
 *         caregiverRelationship:
 *           type: string
 *           example: "Mother"
 *         caregiverPhone:
 *           type: string
 *           example: "+2348098765432"
 *         caregiverEmail:
 *           type: string
 *           format: email
 *           example: "caregiver@example.com"
 *         caregiverStreetAddress:
 *           type: string
 *           example: "45 Caregiver Street"
 *         caregiverCity:
 *           type: string
 *           example: "Abuja"
 *         caregiverState:
 *           type: string
 *           example: "FCT"
 *         caregiverCountry:
 *           type: string
 *           example: "Nigeria"
 *         caregiverZip:
 *           type: string
 *           example: "900001"
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *           example: [{ "fileName": "id-card.png", "url": "https://..." }]
 *
 *     UpdateClientDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         firstName:
 *           type: string
 *           example: "Jane"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         preferredName:
 *           type: string
 *           example: "Janey"
 *         email:
 *           type: string
 *           format: email
 *           example: "client@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         gender:
 *           type: string
 *           example: "female"
 *         DOB:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         streetAddress:
 *           type: string
 *           example: "123 Banana Island"
 *         city:
 *           type: string
 *           example: "Lagos"
 *         state:
 *           type: string
 *           example: "Lagos"
 *         country:
 *           type: string
 *           example: "Nigeria"
 *         zipCode:
 *           type: string
 *           example: "100001"
 *         primaryPayer:
 *           type: string
 *           example: "Private"
 *         caregiverName:
 *           type: string
 *           example: "Mrs Doe"
 *         caregiverRelationship:
 *           type: string
 *           example: "Mother"
 *         caregiverPhone:
 *           type: string
 *           example: "+2348012345678"
 *         caregiverEmail:
 *           type: string
 *           format: email
 *           example: "caregiver@example.com"
 *         caregiverStreetAddress:
 *           type: string
 *           example: "45 Care Street"
 *         caregiverCity:
 *           type: string
 *           example: "Abuja"
 *         caregiverState:
 *           type: string
 *           example: "FCT"
 *         caregiverCountry:
 *           type: string
 *           example: "Nigeria"
 *         caregiverZip:
 *           type: string
 *           example: "900001"
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *         isDeleted:
 *           type: boolean
 *           example: false
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
         * /api/v1/client/:
         *   post:
         *     summary: Create a new client candidate
         *     tags: [Client candidate]
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
        this.router.post("/", ClientDto.createClientDto, this.controller.createClientCandidate);

        /**
         * @swagger
         * /api/v1/client/:
         *   put:
         *     summary: Update client details
         *     tags:
         *       - Clients
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateClientDto'
         *     responses:
         *       200:
         *         description: Client updated successfully
         *       400:
         *         description: Invalid request body
         *       404:
         *         description: Client not found
         */
        this.router.put("/", ClientDto.updateClientDto, this.controller.updateClient);

        /**
        * @swagger
        * /api/v1/client/tenant/{tenantId}:
        *   get:
        *     summary: gets tenant clients
        *     tags: [Clients]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the tenant
        *     responses:
        *       200:
        *         description: tenant clients fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/:tenantId", this.controller.getTenantClients);
    }

    getRouter() {
        return this.router;
    }
}

export default new ClientRoutes().getRouter();