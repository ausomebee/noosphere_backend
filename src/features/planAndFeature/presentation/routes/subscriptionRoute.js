import express from "express";
import SubscriptionController from "../controllers/subscriptionController.js";
import SubscriptionDto from "../dto/subscriptionDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateSubscriptionDto:
 *       type: object
 *       required:
 *         - startDate
 *         - endDate
 *         - status
 *         - tenantId
 *         - planId
 *         - transactionId
 *       properties:
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2025-12-31"
 *         status:
 *           type: string
 *           example: "active"
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *         planId:
 *           type: string
 *           format: uuid
 *           example: "a3d2569e-4dc1-4a7e-a132-30b8d4766fc1"
 *         transactionId:
 *           type: string
 *           format: uuid
 *           example: "fbc8f9da-06df-4787-9cd5-0bcb8a493f94"
 */

class SubscriptionRoutes {
    constructor() {
        this.controller = new SubscriptionController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/subscription:
         *   post:
         *     summary: Create Subscription 
         *     tags: [subscription]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateSubscriptionDto'
         *     responses:
         *       201:
         *         description: Subscription created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", SubscriptionDto.createSubscriptionDto, this.controller.createSubscription);

        /**
        * @swagger
        * /api/v1/subscription/{id}:
        *   get:
        *     summary: gets single Subscription
        *     tags: [subscription]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the Subscription
        *     responses:
        *       200:
        *         description: Subscription fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:id", SubscriptionDto.checkIdDto, this.controller.getAllSubscription);

        /**
         * @swagger
         * /api/v1/subscription:
         *   get:
         *     summary: Retrieve all subscription
         *     tags: [subscription]
         *     responses:
         *       200:
         *         description: all subscription retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/", this.controller.getAllSubscription);

    }

    getRouter() {
        return this.router;
    }
}

export default new SubscriptionRoutes().getRouter();