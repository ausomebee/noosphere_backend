import express from "express";
import ClientController from "../controllers/clientController.js";
import ClientDto from "../dto/clientDto.js";
import { adminProtect, clientProtect, staffProtect } from "../../../../middleware/auth_handlers.js";
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
 *           example: "6d75ea7e-1909-497a-bedb-315671de1916"
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
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: "Passport"
 *               documentDetails:
 *                 type: object
 *                 example:
 *                   number: "A12345678"
 *                   issuedBy: "Nigeria Immigration Service"
 *                   expiryDate: "2030-01-01"
 *               createdBy:
 *                 type: string
 *                 format: uuid
 *             required:
 *               - name
 *               - documentDetails
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
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: "Passport"
 *               documentDetails:
 *                 type: object
 *                 example:
 *                   number: "A12345678"
 *                   issuedBy: "Nigeria Immigration Service"
 *                   expiryDate: "2030-01-01"
 *               createdBy:
 *                 type: string
 *                 format: uuid
 
 *             required:
 *               - name
 *               - documentDetails

 *         isDeleted:
 *           type: boolean
 *           example: false
 
 *     ClientSigninDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "johndoe@example.com"
 *           description: Client registered email address
 *         password:
 *           type: string
 *           format: password
 *           example: "StrongP@ssw0rd!"
 *           description: Client account password
 * 
 *     ResetPasswordDto:
 *       type: object
 *       required:
 *         - clientTenantId
 *         - password
 *       properties:
 *         clientTenantId:
 *           type: string
 *           format: uuid
 *         password:
 *           type: string
 *           format: password
 *           example: "StrongP@ssw0rd!"
 *           description: Client account password
 * 
 *     UpdatePassword:
 *       type: object
 *       required:
 *         - clientTenantId
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         clientTenantId:
 *           type: string
 *           format: uuid
 *         currentPassword:
 *           type: string
 *           format: password
 *           example: "CurrentP@ssw0rd!"
 *           description: Client current account password
 *         newPassword:
 *           type: string
 *           format: password
 *           example: "NewStr0ngP@ssw0rd!"
 *           description: Client new account password
 * 
 *     UpdateAvatar:
 *       type: object
 *       required:
 *         - clientId
 *         - avatarUrl
 *       properties:
 *         clientId:
 *           type: string
 *           format: uuid
 *         avatarUrl:
 *           type: string
 *           format: uri
 *           example: "https://example.com/avatar.jpg"
 *           description: URL of the client's new avatar image
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
         *     tags: [Clients]
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
        this.router.post("/",  ClientDto.createClientDto, this.controller.createClientCandidate);

        /**
         * @swagger
         * /api/v1/client/tenant:
         *   post:
         *     summary: Create a new client candidate
         *     tags: [Clients]
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
        this.router.post("/tenant", staffProtect(), ClientDto.createClientDto, this.controller.createClientCandidate);

       /**
         * @swagger
         * /api/v1/client/login:
         *   post:
         *     summary: client login
         *     tags: [Clients]
         *     parameters:
         *       - in: header
         *         name: x-fingerprint
         *         required: true
         *         schema:
         *           type: string
         *         description: Unique device fingerprint (UUID)
         *         example: 5d4ebdd2-fba0-4952-9b26-d1784757561e
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClientSigninDto'
         *     responses:
         *       201:
         *         description: Client login successful
         *       400:
         *         description: Validation error
         */
        this.router.post("/login", ClientDto.clientSigninDto, this.controller.login);

        /**
         * @swagger
         * /api/v1/client/password-reset:
         *   patch:
         *     summary: client reset password
         *     tags: [Clients]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ResetPasswordDto'
         *     responses:
         *       201:
         *         description: Client login successful
         *       400:
         *         description: Validation error
         */
        this.router.patch("/password-reset", ClientDto.resetPasswordDto, this.controller.resetPassword);

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
        this.router.put("/", adminProtect(), ClientDto.updateClientDto, this.controller.updateClient);

        /**
         * @swagger
         * /api/v1/client/client:
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
        this.router.put("/client", clientProtect(), ClientDto.updateClientDto, this.controller.updateClient);

        /**
         * @swagger
         * /api/v1/client/tenant:
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
        this.router.put("/tenant", staffProtect(), ClientDto.updateClientDto, this.controller.updateClient);

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
        this.router.get("/tenant/:tenantId", adminProtect(), this.controller.getTenantClients);

        /**
        * @swagger
        * /api/v1/client/tenant/tenant/{tenantId}:
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
        this.router.get("/tenant/tenant/:tenantId", staffProtect(), this.controller.getTenantClients);

        /**
         * @swagger
         * /api/v1/client/tenant/tenant/{tenantId}/available-staff:
         *   get:
         *     summary: Gets tenant clients with only staff available on the requested date
         *     tags: [Clients]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *       - in: query
         *         name: date
         *         required: true
         *         schema:
         *           type: string
         *           format: date
         *         description: Date used to determine the staff availability day
         *     responses:
         *       200:
         *         description: Tenant clients with available staff fetched successfully
         */
        this.router.get(
            "/tenant/tenant/:tenantId/available-staff",
            staffProtect(),
            ClientDto.getTenantClientsByAvailabilityDto,
            this.controller.getTenantClientsByAvailableStaff
        );

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
        this.router.get("/client/:clientId", clientProtect(), this.controller.getSingleClient);

        /**
        * @swagger
        * /api/v1/client/tenant/client/{clientId}:
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
        this.router.get("/tenant/client/:clientId", staffProtect(), this.controller.getSingleClient);

        /**
         * @swagger
         * /api/v1/client/clinician/{staffId}/{tenantId}:
         *   get:
         *     summary: gets clients by clinician
         *     tags: [Clients]
         *     parameters:
         *       - in: path
         *         name: staffId
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
        *       200:
        *         description: clients fetched successfully
        */
        this.router.get("/clinician/:staffId/:tenantId", adminProtect(), this.controller.getClientsByClinician);

         /**
         * @swagger
         * /api/v1/client/clinician/tenant/{staffId}/{tenantId}:
         *   get:
         *     summary: gets clients by clinician
         *     tags: [Clients]
         *     parameters:
         *       - in: path
         *         name: staffId
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
        *       200:
        *         description: clients fetched successfully
        */
        this.router.get("/clinician/tenant/:staffId/:tenantId", staffProtect(), this.controller.getClientsByClinician);

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
        this.router.patch("/portal-access", adminProtect(), this.controller.clientPortalSettings);

        /**
        * @swagger
        * /api/v1/client/tenant/{clientTenantId}/{active}:
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
        this.router.patch("/tenant/:clientTenantId/:active", staffProtect(), this.controller.deactivateClient);

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
        this.router.patch("/:clientTenantId/:active", adminProtect(), this.controller.deactivateClient);

        /**
        * @swagger
        * /api/v1/client/initiate/password-reset/{email}:
        *   patch:
        *     summary: initiate password reset for a client
        *     tags: [Clients]
        *     parameters:
        *       - in: path
        *         name: email
        *         required: true
        *         schema:
        *           type: string
        *     responses:
        *       200:
        *         description: Email sent successfully
        */
        this.router.patch("/initiate/password-reset/:email", this.controller.initiatePasswordReset);

        /**
        * @swagger
        * /api/v1/client/update-password:
        *   patch:
        *     summary: update client password
        *     tags: [Clients]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/UpdatePassword'
        *     responses:
        *       200:
        *         description: Password updated successfully
        */
        this.router.patch("/update-password", clientProtect(), ClientDto.updatePasswordDto, this.controller.updateClientPassword);

        /**
         * @swagger
         * /api/v1/client/update-avatar:
         *   patch:
         *     summary: update client avatar
         *     tags: [Clients]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateAvatar'
         *     responses:
         *       200:
         *         description: Avatar updated successfully
         */
        this.router.patch("/update-avatar", clientProtect(), this.controller.updateClientAvatar);

    }

    getRouter() {
        return this.router;
    }
}

export default new ClientRoutes().getRouter();
