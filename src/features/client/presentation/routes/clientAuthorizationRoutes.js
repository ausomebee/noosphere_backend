import express from "express";
import ClientAuthorizationController from "../controllers/clientAuthorizationController.js";
import ClientAuthorizationDto from "../dto/clientAuthorizationDto.js";
import { clientProtect } from "../../../../middleware/auth_handlers.js";
/**
 * @swagger
 * tags:
 *   name: ClientAuthorization
 *   description: Client authorization management
 *
 * components:
 *   schemas:
 *     ClientAuthorization:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantClientId:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         authorizationNumber:
 *           type: string
 *         startDate:
 *           type: string
 *         endDate:
 *           type: string
 *         payer:
 *           type: string
 *         insuranceType:
 *           type: string
 *         serviceCodes:
 *           type: array
 *           items:
 *             type: object
 *         isDeleted:
 *           type: boolean
 *
 *   requestBodies:
 *     CreateClientAuthorization:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenantClientId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               authorizationNumber:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               payer:
 *                 type: string
 *               insuranceType:
 *                 type: string
 *               serviceCodes:
 *                 type: array
 *                 items:
 *                   type: object
 *             required:
 *               - tenantClientId
 *               - title
 *               - authorizationNumber
 *               - startDate
 *               - endDate
 *               - payer
 *               - insuranceType
 *               - serviceCodes
 *
 *     UpdateClientAuthorization:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               authorizationNumber:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               payer:
 *                 type: string
 *               insuranceType:
 *                 type: string
 *               serviceCodes:
 *                 type: array
 *                 items:
 *                   type: object
 */

class ClientAuthorizationRoutes {
    constructor() {
        this.controller = new ClientAuthorizationController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/client-authorization:
         *   post:
         *     summary: Create a new client authorization
         *     tags: [ClientAuthorization]
         *     requestBody:
         *       $ref: '#/components/requestBodies/CreateClientAuthorization'
         *     responses:
         *       201:
         *         description: Client authorization created successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ClientAuthorization'
         *       400:
         *         description: Validation error or creation failure
         */
        this.router.post(
            "/",
            clientProtect,
            ClientAuthorizationDto.createClientAuthorizationDto,
            this.controller.createClientAuthorization.bind(this.controller)
        );

        /**
         * @swagger
         * /api/v1/client-authorization/{id}:
         *   put:
         *     summary: Update an existing client authorization
         *     tags: [ClientAuthorization]
         *     parameters:
         *       - name: id
         *         in: path
         *         description: Authorization ID
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     requestBody:
         *       $ref: '#/components/requestBodies/UpdateClientAuthorization'
         *     responses:
         *       200:
         *         description: Client authorization updated successfully
         *       400:
         *         description: Validation error or update failure
         */
        this.router.put(
            "/:id",
            clientProtect,
            ClientAuthorizationDto.updateClientAuthorizationDto,
            this.controller.updateClientAuthorization.bind(this.controller)
        );

        /**
         * @swagger
         * /api/v1/client-authorization/single/{id}:
         *   get:
         *     summary: Get a single client authorization by ID
         *     tags: [ClientAuthorization]
         *     parameters:
         *       - name: id
         *         in: path
         *         description: Authorization ID
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Client authorization fetched successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ClientAuthorization'
         *       404:
         *         description: Authorization not found
         */
        this.router.get(
            "/single/:id",
            clientProtect,
            this.controller.getSingleClientAuthorization.bind(this.controller)
        );

        /**
         * @swagger
         * /api/v1/client-authorization/tenant-client/{tenantClientId}:
         *   get:
         *     summary: Get all authorizations for a tenant client
         *     tags: [ClientAuthorization]
         *     parameters:
         *       - name: tenantClientId
         *         in: path
         *         description: Tenant Client ID
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Authorizations fetched successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/ClientAuthorization'
         *       404:
         *         description: No authorizations found
         */
        this.router.get(
            "/tenant-client/:tenantClientId",
            clientProtect,
            this.controller.getClientAuthorizations.bind(this.controller)
        );

        /**
         * @swagger
         * /api/v1/client-authorization/chart/{tenantClientId}:
         *   get:
         *     summary: Get all authorizations chart for a tenant client
         *     tags: [ClientAuthorization]
         *     parameters:
         *       - name: tenantClientId
         *         in: path
         *         description: Tenant Client ID
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Authorizations fetched successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/ClientAuthorization'
         *       404:
         *         description: No authorizations found
         */
        this.router.get(
            "/chart/:tenantClientId",
            clientProtect,
            this.controller.getClientAuthorizationChart.bind(this.controller)
        );

         /**
         * @swagger
         * /api/v1/client-authorization/services/tenant-client/{tenantClientId}:
         *   get:
         *     summary: Get all authorization services for a client
         *     tags: [ClientAuthorization]
         *     parameters:
         *       - name: tenantClientId
         *         in: path
         *         description: Tenant Client ID
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Authorizations fetched successfully
         *         
         *       404:
         *         description: No authorizations found
         */
        this.router.get(
            "/services/tenant-client/:tenantClientId",
            clientProtect,
            this.controller.getClientAuthorizationServices.bind(this.controller)
        );

        /**
         * @swagger
         * /api/v1/client-authorization/summary/{tenantId}/{status}:
         *   get:
         *     summary: Get authorizations overview for a tenant client
         *     tags: [ClientAuthorization]
         *     parameters:
         *       - name: tenantId
         *         in: path
         *         description: Tenant ID
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *       - name: status
         *         in: path
         *         description: status of the authorization
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Authorizations fetched successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/ClientAuthorization'
         *       404:
         *         description: No authorizations found
         */
        this.router.get(
            "/summary/:tenantId/:status",
            clientProtect,
            this.controller.getClientAuthorizationsSummary.bind(this.controller)
        );

        /**
        * @swagger
        * /api/v1/client-authorization/summary/{tenantId}:
        *   get:
        *     summary: Get authorizations overview for a tenant client
        *     tags: [ClientAuthorization]
        *     parameters:
        *       - name: tenantId
        *         in: path
        *         description: Tenant ID
        *         required: true
        *         schema:
        *           type: string
        *           format: uuid
        *     responses:
        *       200:
        *         description: Authorizations fetched successfully
        *         content:
        *           application/json:
        *             schema:
        *               type: array
        *               items:
        *                 $ref: '#/components/schemas/ClientAuthorization'
        *       404:
        *         description: No authorizations found
        */
        this.router.get(
            "/summary/:tenantId",
            clientProtect,
            this.controller.countAuthorizationStatsByTenant.bind(this.controller)
        );

        /**
         * @swagger
         * /api/v1/client-authorization/{id}/{active}:
         *   patch:
         *     summary: deactivate or activate a client
         *     tags: [ClientAuthorization]
         *     parameters:
         *       - in: path
         *         name: id
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
        this.router.patch("/:id/:active", clientProtect, this.controller.deactivateAuth);

        /**
         * @swagger
         * /api/v1/client-authorization/delete/{id}/{delete}:
         *   patch:
         *     summary: deactivate or activate a client
         *     tags: [ClientAuthorization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: delete
         *         required: true
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Client deactivated successfully
         */
        this.router.patch("/:id/:delete", clientProtect, this.controller.deleteAuth);

    }

    getRouter() {
        return this.router;
    }
}

export default new ClientAuthorizationRoutes().getRouter();
