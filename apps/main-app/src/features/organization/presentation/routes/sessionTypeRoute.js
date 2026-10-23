import express from "express";
import OrganizationSessionTypesController from "../controller/sessionTypeController.js";
import OrganizationSessionTypesDto from "../dto/sessionTypeDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     OrganizationSessionTypeCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - name
 *         - category
 *         - service
 *         - staffRolesAllowed
 *         - locationsAllowed
 *         - defaultDuration
 *       properties:
 *         tenantId:
 *           type: string
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Name of the session type
 *           example: "Therapy Session"
 *         category:
 *           type: string
 *           description: Category of the session type
 *           example: "Mental Health"
 *         service:
 *           type: object
 *           description: JSON object for service details
 *         staffRolesAllowed:
 *           type: array
 *           items:
 *             type: string
 *           description: Roles allowed for this session type
 *         locationsAllowed:
 *           type: array
 *           items:
 *             type: string
 *           description: Locations where this session is allowed
 *         defaultDuration:
 *           type: integer
 *           description: Default duration in minutes
 *           example: 60
 *         isActive:
 *           type: boolean
 *           description: Indicates if the session type is active
 *         isBillable:
 *           type: boolean
 *           description: Indicates if the session type is billable
 *
 *     OrganizationSessionTypeUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *         - name
 *         - category
 *         - service
 *         - staffRolesAllowed
 *         - locationsAllowed
 *         - defaultDuration
 *         - isActive
 *         - isBillable
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the session type
 *         tenantId:
 *           type: string
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Name of the session type
 *         category:
 *           type: string
 *           description: Category of the session type
 *         service:
 *           type: object
 *           description: JSON object for service details
 *         staffRolesAllowed:
 *           type: array
 *           items:
 *             type: string
 *           description: Roles allowed for this session type
 *         locationsAllowed:
 *           type: array
 *           items:
 *             type: string
 *           description: Locations where this session is allowed
 *         defaultDuration:
 *           type: integer
 *           description: Default duration in minutes
 *         isActive:
 *           type: boolean
 *           description: Indicates if the session type is active
 *         isBillable:
 *           type: boolean
 *           description: Indicates if the session type is billable
 */

class OrganizationSessionTypesRoutes {
    constructor() {
        this.controller = new OrganizationSessionTypesController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/session-types:
         *   post:
         *     summary: Create organization session type
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/OrganizationSessionTypeCreateDto'
         *     responses:
         *       201:
         *         description: Organization session type created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", staffProtect(), OrganizationSessionTypesDto.createSessionTypeDto, this.controller.createSessionType);

        /**
         * @swagger
         * /api/v1/organization/session-types:
         *   put:
         *     summary: Update organization session type
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/OrganizationSessionTypeUpdateDto'
         *     responses:
         *       200:
         *         description: Organization session type updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.put("/", staffProtect(), OrganizationSessionTypesDto.updateSessionTypeDto, this.controller.updateSessionType);

        /**
         * @swagger
         * /api/v1/organization/session-types/tenant/{tenantId}:
         *   get:
         *     summary: Get tenant organization session types
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The Id of the tenant
         *     responses:
         *       200:
         *         description: Organization session types fetched successfully
         */
        this.router.get("/tenant/:tenantId", staffProtect(), this.controller.getTenantSessionTypes);

        /**
         * @swagger
         * /api/v1/organization/session-types/active/tenant/{tenantId}:
         *   get:
         *     summary: Get tenant organization session types
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The Id of the tenant
         *     responses:
         *       200:
         *         description: Organization session types fetched successfully
         */
        this.router.get("/active/tenant/:tenantId", staffProtect(), this.controller.getTenantSessionTypes);

        /**
         * @swagger
         * /api/v1/organization/session-types/{id}:
         *   get:
         *     summary: Get single organization session type
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The Id of the session type
         *     responses:
         *       200:
         *         description: Organization session type fetched successfully
         */
        this.router.get("/:id", staffProtect(), this.controller.getSingleSessionType);

        /**
         * @swagger
         * /api/v1/organization/session-types/active/{id}/{active}:
         *   patch:
         *     summary: Activate or deactivate an organization session type
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the session type
         *       - in: path
         *         name: active
         *         required: true
         *         schema:
         *           type: boolean
         *         description: Set to `true` to activate or `false` to deactivate
         *     responses:
         *       200:
         *         description: Organization session type status updated successfully
         *       400:
         *         description: Invalid request
         *       404:
         *         description: Session type not found
         */
        this.router.patch("/active/:id/:active", staffProtect(), this.controller.deactivateSessionType);
    }

    getRouter() {
        return this.router;
    }
}

export default new OrganizationSessionTypesRoutes().getRouter();
