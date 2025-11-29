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
 *           example: "Initial"
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
 *         pipelineStageId:
 *           type: string
 *           format: uuid
 *         assignToClinicians:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "8309241f-d2a0-425c-ace9-134fdd58b7f4"
 *             required:
 *               - id
 *         createdBy:
 *           type: string
 *           format: uuid
 *         clientPortalAccess:
 *           type: boolean
 *           default: false
 *         caregiverName:
 *           type: string
 *         caregiverRelationship:
 *           type: string
 *         caregiverPhone:
 *           type: string
 *         caregiverEmail:
 *           type: string
 *           format: email
 *         caregiverStreetAddress:
 *           type: string
 *         caregiverCity:
 *           type: string
 *         caregiverState:
 *           type: string
 *         caregiverCountry:
 *           type: string
 *         caregiverZip:
 *           type: string
 *
 *         
 *
 *
 *     ManagePortalAccess:
 *       type: object
 *       required:
 *         - clientTenantId
 *         - documentAccess
 *         - requestAppointment
 *         - dbAccess
 *       properties:
 *         clientTenantId:
 *           type: string
 *           format: uuid
 *         documentAccess:
 *           type: boolean
 *         requestAppointment:
 *           type: boolean
 *         dbAccess:
 *           type: boolean
 *
 *
 *     UpdateClientDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         preferredName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phoneNumber:
 *           type: string
 *         gender:
 *           type: string
 *         DOB:
 *           type: string
 *           format: date
 *         streetAddress:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *         zipCode:
 *           type: string
 *         primaryPayer:
 *           type: string
 *         caregiverName:
 *           type: string
 *         caregiverRelationship:
 *           type: string
 *         caregiverPhone:
 *           type: string
 *         caregiverEmail:
 *           type: string
 *           format: email
 *         caregiverStreetAddress:
 *           type: string
 *         caregiverCity:
 *           type: string
 *         caregiverState:
 *           type: string
 *         caregiverCountry:
 *           type: string
 *         caregiverZip:
 *           type: string
  *         assignToClinicians:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "8309241f-d2a0-425c-ace9-134fdd58b7f4"
 *             required:
 *               - id

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

        /**
        * @swagger
        * /api/v1/client/client/{clientId}:
        *   get:
        *     summary: gets client clients
        *     tags: [Clients]
        *     parameters:
        *       - in: path
        *         name: clientId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the client
        *     responses:
        *       200:
        *         description: client fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/client/:clientId", this.controller.getSingleClient);

        /**
         * @swagger
         * /api/v1/client/portal-access:
         *   patch:
         *     summary: set client portal access
         *     tags: [Clients]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ManagePortalAccess'
         *     responses:
         *       200:
         *         description: Client portal access set successfully
         */
        this.router.patch("/portal-access", this.controller.clientPortalSettings);

         /**
         * @swagger
         * /api/v1/client/{clientTenantId}/{active}:
         *   patch:
         *     summary: deactivate or activate a client
         *     tags: [Clients]
         *     parameters:
         *       - in: path
         *         name: clientTenantId
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: active
         *         required: true
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Client deactivated successfully
         */
        this.router.patch("/:clientTenantId/:active", this.controller.deactivateClient);


    }

    getRouter() {
        return this.router;
    }
}

export default new ClientRoutes().getRouter();