import express from "express";
import TenantGeneralSettingsController from "../controllers/tenantGeneralSettingsController.js";
import TenantGeneralSettingsDto from "../dto/tenantGeneralSettingsDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TenantGeneralSettingsCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - dateFormat
 *         - timeFormat
 *         - currency
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         dateFormat:
 *           type: string
 *           example: "YYYY-MM-DD"
 *         timeFormat:
 *           type: string
 *           example: "HH:mm"
 *         currency:
 *           type: string
 *           example: "USD"
 *
 *     TenantGeneralSettingsUpdateDto:
 *       type: object
 *       required:
 *         - tenantId
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *         dateFormat:
 *           type: string
 *         timeFormat:
 *           type: string
 *         currency:
 *           type: string
 */

class TenantGeneralSettingsRoutes {
    constructor() {
        this.controller = new TenantGeneralSettingsController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/tenant-general-settings:
         *   post:
         *     summary: Create tenant general settings
         *     tags: [tenant-general-settings]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantGeneralSettingsCreateDto'
         *     responses:
         *       201:
         *         description: Tenant general settings created successfully
         */
        this.router.post(
            "/",
            staffProtect,
            TenantGeneralSettingsDto.createSettingsDto,
            this.controller.createSettings
        );

        /**
         * @swagger
         * /api/v1/tenant-general-settings:
         *   put:
         *     summary: Update tenant general settings
         *     tags: [tenant-general-settings]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantGeneralSettingsUpdateDto'
         *     responses:
         *       200:
         *         description: Tenant general settings updated successfully
         */
        this.router.put(
            "/",
            staffProtect,
            TenantGeneralSettingsDto.updateSettingsDto,
            this.controller.updateSettings
        );

        /**
         * @swagger
         * /api/v1/tenant-general-settings/{tenantId}:
         *   get:
         *     summary: Get general settings for a tenant
         *     tags: [tenant-general-settings]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         schema:
         *           type: string
         *         required: true
         *         description: Tenant ID
         *     responses:
         *       200:
         *         description: Tenant general settings fetched successfully
         */
        this.router.get(
            "/:tenantId",
            staffProtect(),
            this.controller.getSettings
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new TenantGeneralSettingsRoutes().getRouter();
