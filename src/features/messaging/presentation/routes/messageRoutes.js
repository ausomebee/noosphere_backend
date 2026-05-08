import express from "express";
import MessageController from "../controllers/messageController.js";
import MessageDto from "../dtos/messageDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     MessageCreateDto:
 *       type: object
 *       required:
 *         - senderId
 *         - senderType
 *         - receiverId
 *         - receiverType
 *         - content
 *       properties:
 *         senderId:
 *           type: string
 *           format: uuid
 *         senderType:
 *           type: string
 *           enum: [ADMIN, TENANT_STAFF, CLIENT]
 *         receiverId:
 *           type: string
 *           format: uuid
 *         receiverType:
 *           type: string
 *           enum: [ADMIN, TENANT_STAFF, CLIENT]
 *         content:
 *           type: string
 *           example: "Hello, your request has been approved."
 *
 *     MessageUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         isRead:
 *           type: boolean
 */

class MessageRoutes {
    constructor() {
        this.controller = new MessageController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {

        /**
         * @swagger
         * /api/v1/messages:
         *   post:
         *     summary: Create a message
         *     tags: [message]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/MessageCreateDto'
         *     responses:
         *       201:
         *         description: Message created successfully
         */
        this.router.post(
            "/",
            staffProtect,
            MessageDto.createMessageDto,
            this.controller.createMessage
        );

        /**
         * @swagger
         * /api/v1/messages:
         *   put:
         *     summary: Update a message
         *     tags: [message]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/MessageUpdateDto'
         *     responses:
         *       201:
         *         description: Message updated successfully
         */
        this.router.put(
            "/",
            staffProtect,
            MessageDto.updateMessageDto,
            this.controller.updateMessage
        );

        /**
         * @swagger
         * /api/v1/messages/{id}:
         *   get:
         *     summary: Get a single message
         *     tags: [message]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: Message ID
         *     responses:
         *       200:
         *         description: Message fetched successfully
         */
        this.router.get(
            "/:id",
            staffProtect,
            this.controller.getSingleMessage
        );

        /**
         * @swagger
         * /api/v1/messages/user/{userId}/{userType}:
         *   get:
         *     summary: Get messages for a user
         *     tags: [message]
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
         *         description: Messages fetched successfully
         */
        this.router.get(
            "/user/:userId/:userType",
            staffProtect,
            this.controller.getMessagesByUser
        );

        /**
         * @swagger
         * /api/v1/messages/read/{id}:
         *   patch:
         *     summary: Mark a message as read
         *     tags: [message]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *         description: Message ID
         *     responses:
         *       200:
         *         description: Message marked as read
         */
        this.router.patch(
            "/read/:id",
            staffProtect,
            this.controller.markAsRead
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new MessageRoutes().getRouter();