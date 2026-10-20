import express from "express";
import ServiceCodesDto from "../dto/serviceCodesDto.js";
import ServiceCodesController from "../controllers/serviceCodesController.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceCodesCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - code
 *         - description
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         code:
 *           type: string
 *           description: Service code identifier
 *           example: "SC-101"
 *         description:
 *           type: string
 *           description: Description of the service code
 *           example: "General Consultation"
 *         modifiers:
 *           type: object
 *           description: JSON object with modifiers
 *           example: { "modifier1": "urgent", "modifier2": "telehealth" }
 *
 *     ServiceCodesUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique service code id
 *         tenantId:
 *           type: string
 *           format: uuid
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         modifiers:
 *           type: object
 *         isDeleted:
 *           type: boolean
 *         isActive:
 *           type: boolean
 */

class ServiceCodesRoutes {
    constructor() {
        this.controller = new ServiceCodesController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/service-codes/:
         *   post:
         *     summary: Create service code
         *     tags: [service-codes]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ServiceCodesCreateDto'
         *     responses:
         *       201:
         *         description: Service code created successfully
         */
        this.router.post("/", staffProtect(), ServiceCodesDto.createServiceCodeDto, this.controller.createServiceCode);

        /**
         * @swagger
         * /api/v1/service-codes/:
         *   put:
         *     summary: Update service code
         *     tags: [service-codes]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ServiceCodesUpdateDto'
         *     responses:
         *       201:
         *         description: Service code updated successfully
         */
        this.router.put("/", staffProtect(), ServiceCodesDto.updateServiceCodeDto, this.controller.updateServiceCode);

        /**
         * @swagger
         * /api/v1/service-codes/tenant/{tenantId}:
         *   get:
         *     summary: Get all service codes for a tenant
         *     tags: [service-codes]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of service codes
         */
        this.router.get("/tenant/:tenantId", staffProtect(), this.controller.getTenantServiceCodes);

        /**
         * @swagger
         * /api/v1/service-codes/{id}:
         *   get:
         *     summary: Get a single service code
         *     tags: [service-codes]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Service code fetched successfully
         */
        this.router.get("/:id", staffProtect(), this.controller.getSingleServiceCode);

        /**
         * @swagger
         * /api/v1/service-codes/{id}/{active}:
         *   patch:
         *     summary: Deactivate service code
         *     tags: [service-codes]
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
         *         description: Service code deleted successfully
         */
        this.router.patch("/:id/:active", staffProtect(), this.controller.deactivateServiceCode);
    }

    getRouter() {
        return this.router;
    }
}

export default new ServiceCodesRoutes().getRouter();
