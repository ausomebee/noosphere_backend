import express from "express";
import TenantNotificationSettingsController from "../controllers/tenantNotificationSettingsController.js";
import TenantNotificationSettingsDto from "../dto/tenantNotificationSettingsDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TenantNotificationSettingsCreateDto:
 *       type: object
 *       required:
 *         - userId
 *         - settings
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         settings:
 *           type: object
 *           description: Notification categories with nested booleans
 *           example:
 *             CALENDAR_APPOINTMENTS:
 *               enabled: true
 *               upcoming_appointments: true
 *               canceled_appointments: false
 *             CLIENT_MANAGEMENT:
 *               enabled: false
 *
 *     TenantNotificationSettingsUpdateDto:
 *       type: object
 *       required:
 *         - settings
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         settings:
 *           type: object
 *           description: Notification categories with nested booleans
 */

class TenantNotificationSettingsRoutes {
    constructor() {
        this.controller = new TenantNotificationSettingsController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/tenant/notification-settings:
         *   post:
         *     summary: Create tenant notification settings for a user
         *     tags: [tenant-notification-settings]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantNotificationSettingsCreateDto'
         *     responses:
         *       201:
         *         description: Tenant notification settings created successfully
         */
        this.router.post(
            "/",
            staffProtect,
            TenantNotificationSettingsDto.createNotificationSettingsDto,
            this.controller.saveNotificationSettings
        );

        /**
         * @swagger
         * /api/v1/tenant/notification-settings/:
         *   put:
         *     summary: Update tenant notification settings for a user
         *     tags: [tenant-notification-settings]
         *     
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TenantNotificationSettingsUpdateDto'
         *     responses:
         *       200:
         *         description: Tenant notification settings updated successfully
         */
        this.router.put(
            "/",
            staffProtect,
            TenantNotificationSettingsDto.updateNotificationSettingsDto,
            this.controller.saveNotificationSettings
        );

        /**
         * @swagger
         * /api/v1/tenant/notification-settings/{userId}:
         *   get:
         *     summary: Get tenant notification settings for a user
         *     tags: [tenant-notification-settings]
         *     parameters:
         *       - in: path
         *         name: userId
         *         schema:
         *           type: string
         *         required: true
         *         description: TenantStaff user ID
         *     responses:
         *       200:
         *         description: Tenant notification settings fetched successfully
         */
        this.router.get(
            "/:userId",
            staffProtect,
            this.controller.getNotificationSettings
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new TenantNotificationSettingsRoutes().getRouter();
