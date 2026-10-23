import express from "express";
import NotificationController from "../controllers/notificationController.js";
import NotificationDto from "../dtos/notificationDto.js";
import { adminProtect, clientProtect, staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     NotificationCreateDto:
 *       type: object
 *       required:
 *         - userId
 *         - userType
 *         - type
 *         - title
 *         - content
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         userType:
 *           type: string
 *           enum: [ADMIN, TENANT_STAFF, CLIENT]
 *         type:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *
 *     NotificationUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         isRead:
 *           type: boolean
 */

class NotificationRoutes {
    constructor() {
        this.controller = new NotificationController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {

        /**
         * @swagger
         * /api/v1/notifications:
         *   post:
         *     summary: Create a notification
         *     tags: [notification]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/NotificationCreateDto'
         *     responses:
         *       201:
         *         description: Notification created successfully
         */
        this.router.post(
            "/",
            staffProtect(),
            NotificationDto.createNotificationDto,
            this.controller.createNotification
        );

        /**
         * @swagger
         * /api/v1/notifications:
         *   put:
         *     summary: Update a notification
         *     tags: [notification]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/NotificationUpdateDto'
         *     responses:
         *       201:
         *         description: Notification updated successfully
         */
        this.router.put(
            "/",
            staffProtect(),
            NotificationDto.updateNotificationDto,
            this.controller.updateNotification
        );

        /**
         * @swagger
         * /api/v1/notifications/{id}:
         *   get:
         *     summary: Get a single notification
         *     tags: [notification]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: Notification ID
         *     responses:
         *       200:
         *         description: Notification fetched successfully
         */
        this.router.get(
            "/:id",
            staffProtect(),
            this.controller.getSingleNotification
        );

        /**
         * @swagger
         * /api/v1/notifications/user/client/{userId}/{userType}:
         *   get:
         *     summary: Get notifications for a user
         *     tags: [notification]
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *       - in: path
         *         name: userType
         *         required: true
         *         schema:
         *           type: string
         *           enum: [ADMIN, TENANT_STAFF, CLIENT]
         *     responses:
         *       200:
         *         description: Notifications fetched successfully
         */
        this.router.get(
            "/user/client/:userId/:userType",
            clientProtect(),
            this.controller.getNotificationsByUser
        );

        /**
         * @swagger
         * /api/v1/notifications/user/{userId}/{userType}:
         *   get:
         *     summary: Get notifications for a user
         *     tags: [notification]
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *       - in: path
         *         name: userType
         *         required: true
         *         schema:
         *           type: string
         *           enum: [ADMIN, TENANT_STAFF, CLIENT]
         *     responses:
         *       200:
         *         description: Notifications fetched successfully
         */
        this.router.get(
            "/user/:userId/:userType",
            staffProtect(),
            this.controller.getNotificationsByUser
        );

        /**
         * @swagger
         * /api/v1/notifications/user/admin/{userId}/{userType}:
         *   get:
         *     summary: Get notifications for a user
         *     tags: [notification]
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *       - in: path
         *         name: userType
         *         required: true
         *         schema:
         *           type: string
         *           enum: [ADMIN, TENANT_STAFF, CLIENT]
         *     responses:
         *       200:
         *         description: Notifications fetched successfully
         */
        this.router.get(
            "/user/admin/:userId/:userType",
            adminProtect(),
            this.controller.getNotificationsByUser
        );

        /**
         * @swagger
         * /api/v1/notifications/read/client/{id}:
         *   patch:
         *     summary: Mark notification as read
         *     tags: [notification]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: Notification ID
         *     responses:
         *       200:
         *         description: Notification marked as read
         */
        this.router.patch(
            "/read/client/:id",
            clientProtect(),
            this.controller.markAsRead
        );

        /**
         * @swagger
         * /api/v1/notifications/read/admin/{id}:
         *   patch:
         *     summary: Mark notification as read
         *     tags: [notification]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: Notification ID
         *     responses:
         *       200:
         *         description: Notification marked as read
         */
        this.router.patch(
            "/read/admin/:id",
            adminProtect(),
            this.controller.markAsRead
        );

        /**
         * @swagger
         * /api/v1/notifications/read/{id}:
         *   patch:
         *     summary: Mark notification as read
         *     tags: [notification]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: Notification ID
         *     responses:
         *       200:
         *         description: Notification marked as read
         */
        this.router.patch(
            "/read/:id",
            staffProtect(),
            this.controller.markAsRead
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new NotificationRoutes().getRouter();