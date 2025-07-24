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
 *         - streetAddress
 *         - city
 *         - state
 *         - country
 *         - zipCode
 *         - phoneNumber
 *         - stage
 *         - gender
 *         - DOB
 *         - tenantId
 *         - pipelineStageId
 *         - assignToTenantStaff
 *         - dbAccess
 *         - createdBy
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         streetAddress:
 *           type: string
 *           example: 123 Banana Street
 *         city:
 *           type: string
 *           example: Lagos
 *         state:
 *           type: string
 *           example: Lagos State
 *         country:
 *           type: string
 *           example: Nigeria
 *         zipCode:
 *           type: string
 *           example: 100001
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           example: "+2348123456789"
 *         stage:
 *           type: string
 *           example: onboarding
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: male
 *         DOB:
 *           type: string
 *           format: date
 *           example: 1995-06-15
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *           example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         assignToTenantStaff:
 *           type: string
 *           format: uuid
 *           example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         dbAccess:
 *           type: boolean
 *           example: true
 *         createdBy:
 *           type: string
 *           format: uuid
 *           example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *     UpdateClientDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         email:
 *           type: string
 *           format: email
 *           example: "client@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         fullName:
 *           type: string
 *           example: "Jane Doe"
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         DOB:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         gender:
 *           type: string
 *           example: "female"
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
 *         password:
 *           type: string
 *           format: password
 *           example: "SecurePass123"
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
         * /api/clients/update:
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
    }

    getRouter() {
        return this.router;
    }
}

export default new ClientRoutes().getRouter();