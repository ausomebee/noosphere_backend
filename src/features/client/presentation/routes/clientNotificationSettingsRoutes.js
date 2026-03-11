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
 *       properties:
 *         tenantClientId:
 *           type: string
 *           format: uuid
 *         appointmentScheduled:
 *           type: boolean
 *         appointmentRescheduled:
 *           type: boolean
 *         appointmentAboutToStart:
 *           type: boolean
 *         appointmentStarted:
 *           type: boolean
 *         appointmentCancelled:
 *           type: boolean
 *         appointmentCompletedAwaitingFeedback:
 *           type: boolean
 *         documentRequested:
 *           type: boolean
 *         formShared:
 *           type: boolean
 *         authorizationAboutToExpire:
 *           type: boolean
 *         authorizationExpired:
 *           type: boolean
 *         authorizationUnitsAlmostExhausted:
 *           type: boolean
 *         authorizationUnitsExhausted:
 *           type: boolean
 *         signatureRequested:
 *           type: boolean
 *
 *     NotificationSettingsUpdateDto:
 *       type: object
 *       properties:
 *         appointmentScheduled:
 *           type: boolean
 *         appointmentRescheduled:
 *           type: boolean
 *         appointmentAboutToStart:
 *           type: boolean
 *         appointmentStarted:
 *           type: boolean
 *         appointmentCancelled:
 *           type: boolean
 *         appointmentCompletedAwaitingFeedback:
 *           type: boolean
 *         documentRequested:
 *           type: boolean
 *         formShared:
 *           type: boolean
 *         authorizationAboutToExpire:
 *           type: boolean
 *         authorizationExpired:
 *           type: boolean
 *         authorizationUnitsAlmostExhausted:
 *           type: boolean
 *         authorizationUnitsExhausted:
 *           type: boolean
 *         signatureRequested:
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
         * /api/v1/client/notification-settings:
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
         * /api/v1/client/notification-settings/{id}:
         *   put:
         *     summary: Update notification settings
         *     tags: [client-notification-settings]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Notification settings ID
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/NotificationSettingsUpdateDto'
         *     responses:
         *       200:
         *         description: Notification settings updated successfully
         */
        this.router.put(
            "/:id",
            this.controller.updateNotificationSettings
        );

        /**
         * @swagger
         * /api/v1/client/notification-settings/single/{id}:
         *   get:
         *     summary: Get notification settings by ID
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
            "/single/:id",
            this.controller.getSingleNotificationSettings
        );

        /**
         * @swagger
         * /api/v1/client/notification-settings/{tenantClientId}:
         *   get:
         *     summary: Get notification settings for a client
         *     tags: [client-notification-settings]
         *     parameters:
         *       - in: path
         *         name: tenantClientId
         *         schema:
         *           type: string
         *         required: true
         *         description: Client tenant ID
         *     responses:
         *       200:
         *         description: Notification settings fetched successfully
         */
        this.router.get(
            "/:tenantClientId",
            this.controller.getNotificationSettingsByClient
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new ClientNotificationSettingsRoutes().getRouter();