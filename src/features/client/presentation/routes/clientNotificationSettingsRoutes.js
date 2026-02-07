import express from "express";
import ClientNotificationSettingsController from "../controllers/clientNotificationSettingsController.js";
import ClientNotificationSettingsDto from "../dto/clientNotificationSettingsDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     NotificationSettingsCreateDto:
 *       type: object
 *       required:
 *         - tenantClientId
 *         - reschedule
 *         - starts
 *         - completed
 *         - awaitingReview
 *         - approvedReschedule
 *       properties:
 *         tenantClientId:
 *           type: string
 *           format: uuid
 *         reschedule:
 *           type: boolean
 *         starts:
 *           type: boolean
 *         completed:
 *           type: boolean
 *         awaitingReview:
 *           type: boolean
 *         approvedReschedule:
 *           type: boolean
 *
 *     NotificationSettingsUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         reschedule:
 *           type: boolean
 *         starts:
 *           type: boolean
 *         completed:
 *           type: boolean
 *         awaitingReview:
 *           type: boolean
 *         approvedReschedule:
 *           type: boolean
 */

class ClientNotificationSettingsRoutes {
    constructor() {
        this.controller = new ClientNotificationSettingsController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/notification-settings:
         *   post:
         *     summary: Create notification settings for a client
         *     tags: [client-notification-settings]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/NotificationSettingsCreateDto'
         *     responses:
         *       201:
         *         description: Notification settings created successfully
         */
        this.router.post(
            "/",
            ClientNotificationSettingsDto.createNotificationSettingsDto,
            this.controller.createNotificationSettings
        );

        /**
         * @swagger
         * /api/v1/notification-settings:
         *   put:
         *     summary: Update notification settings for a client
         *     tags: [client-notification-settings]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/NotificationSettingsUpdateDto'
         *     responses:
         *       201:
         *         description: Notification settings updated successfully
         */
        this.router.put(
            "/",
            ClientNotificationSettingsDto.updateNotificationSettingsDto,
            this.controller.updateNotificationSettings
        );

        /**
         * @swagger
         * /api/v1/notification-settings/{id}:
         *   get:
         *     summary: Get a single notification settings record
         *     tags: [client-notification-settings]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Notification settings ID
         *     responses:
         *       200:
         *         description: Notification settings fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleNotificationSettings
        );

        /**
         * @swagger
         * /api/v1/notification-settings/tenant/{clientTenantId}:
         *   get:
         *     summary: Get notification settings for a specific clientTenantId
         *     tags: [client-notification-settings]
         *     parameters:
         *       - in: path
         *         name: clientTenantId
         *         schema:
         *           type: string
         *         required: true
         *         description: The client tenant ID
         *     responses:
         *       200:
         *         description: Notification settings fetched successfully
         */
        this.router.get(
            "/tenant/:clientTenantId",
            this.controller.getNotificationSettingsByClient
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClientNotificationSettingsRoutes().getRouter();
