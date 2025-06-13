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
 *         - billingCycle
 *         - paymentId
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
 *         paymentId:
 *           type: number
 *           example: 1
 *         billingCycle:
 *           type: string
 *           example: "Monthly"
 *     UpdateStatusDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         status:
 *           type: string
 *           enum: [ACTIVE, PAUSED, PENDING, CANCELLED]
 *           description: Status of the item
 *           example: ACTIVE
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *     CancelNowDto:
 *       type: object
 *       required:
 *         - status
 *         - id
 *         - tenantId
 *         - comment
 *         - reason
 *         - autoRenew
 *       properties:
 *         status:
 *           type: string
 *           enum: [CANCELLED]
 *           default: CANCELLED
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         autoRenew:
 *           type: boolean
 *           default: false

 *     CancelAtEndDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *         - comment
 *         - reason
 *         - autoRenew
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         autoRenew:
 *           type: boolean
 *           default: false

 *     ResumeNowDto:
 *       type: object
 *       required:
 *         - status
 *         - id
 *         - tenantId
 *         - comment
 *         - reason
 *       properties:
 *         status:
 *           type: string
 *           enum: [ACTIVE]
 *           default: ACTIVE
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string

 *     ResumeLaterDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *         - comment
 *         - reason
 *         - resumeShedule
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         resumeShedule:
 *           type: string
 *           format: date-time

 *     PauseNowDto:
 *       type: object
 *       required:
 *         - status
 *         - id
 *         - tenantId
 *         - comment
 *         - reason
 *         - autoRenew
 *       properties:
 *         status:
 *           type: string
 *           enum: [PAUSED]
 *           default: PAUSED
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         autoRenew:
 *           type: boolean
 *           default: false

 *     PauseUntilDto:
 *       type: object
 *       required:
 *         - status
 *         - id
 *         - tenantId
 *         - comment
 *         - reason
 *         - resumeShedule
 *         - autoRenew
 *       properties:
 *         status:
 *           type: string
 *           enum: [PAUSED]
 *           default: PAUSED
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         resumeShedule:
 *           type: string
 *           format: date-time
 *         autoRenew:
 *           type: boolean
 *           default: false

 *     PauseScheduleDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *         - comment
 *         - reason
 *         - pauseSchedule
 *         - autoRenew
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         pauseSchedule:
 *           type: string
 *           format: date-time
 *         autoRenew:
 *           type: boolean
 *           default: true
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

        /**
        * @swagger
        * /api/v1/subscription/plan/{planId}:
        *   get:
        *     summary: gets Subscriptions by plan
        *     tags: [subscription]
        *     parameters:
        *       - in: path
        *         name: planId
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the plan
        *     responses:
        *       200:
        *         description: Subscriptions fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/plan/:planId", SubscriptionDto.checkPlanIdDto, this.controller.getSubscriptionByPlan);

        /**
         * @swagger
         * /api/v1/subscription/count/total:
         *   get:
         *     summary: counted all subscription
         *     tags: [subscription]
         *     responses:
         *       200:
         *         description: all subscription counted successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/count/total", this.controller.getTotalSubscriptionByStatus);

        /**
        * @swagger
        * /api/v1/subscription/status/{status}:
        *   get:
        *     summary: gets subscription by status
        *     tags: [subscription]
        *     parameters:
        *       - in: path
        *         name: status
        *         required: true
        *         schema:
        *           type: string
        *         description: The status of the subscription
        *     responses:
        *       200:
        *         description: subscription fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/status/:status", SubscriptionDto.checkStatusDto, this.controller.getSubscriptionByStatus);

        /**
         * @swagger
         * /api/v1/subscription/cancelnow:
         *   patch:
         *     summary: Update the status of a subscription
         *     tags:
         *       - subscription
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CancelNowDto'
         *     responses:
         *       200:
         *         description: Status updated successfully
         *       400:
         *         description: Invalid input
         */
        this.router.patch("/cancelnow", SubscriptionDto.cancelNowDto, this.controller.updateSubscription);

        /**
         * @swagger
         * /api/v1/subscription/cancelatend:
         *   patch:
         *     summary: Update the status of a subscription
         *     tags:
         *       - subscription
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CancelAtEndDto'
         *     responses:
         *       200:
         *         description: Status updated successfully
         *       400:
         *         description: Invalid input
         */
        this.router.patch("/cancelatend", SubscriptionDto.cancelAtEndDto, this.controller.updateSubscription);

        /**
         * @swagger
         * /api/v1/subscription/resumenow:
         *   patch:
         *     summary: Update the status of a subscription
         *     tags:
         *       - subscription
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ResumeNowDto'
         *     responses:
         *       200:
         *         description: Status updated successfully
         *       400:
         *         description: Invalid input
         */
        this.router.patch("/resumenow", SubscriptionDto.resumeNowDto, this.controller.updateSubscription);

        /**
         * @swagger
         * /api/v1/subscription/resumelater:
         *   patch:
         *     summary: Update the status of a subscription
         *     tags:
         *       - subscription
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ResumeLaterDto'
         *     responses:
         *       200:
         *         description: Status updated successfully
         *       400:
         *         description: Invalid input
         */
        this.router.patch("/resumelater", SubscriptionDto.resumeLaterDto, this.controller.updateSubscription);

        /**
         * @swagger
         * /api/v1/subscription/pausenow:
         *   patch:
         *     summary: Update the status of a subscription
         *     tags:
         *       - subscription
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PauseNowDto'
         *     responses:
         *       200:
         *         description: Status updated successfully
         *       400:
         *         description: Invalid input
         */
        this.router.patch("/pausenow", SubscriptionDto.pauseNowDto, this.controller.updateSubscription);

        /**
         * @swagger
         * /api/v1/subscription/pauseuntil:
         *   patch:
         *     summary: Update the status of a subscription
         *     tags:
         *       - subscription
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PauseUntilDto'
         *     responses:
         *       200:
         *         description: Status updated successfully
         *       400:
         *         description: Invalid input
         */
        this.router.patch("/pauseuntil", SubscriptionDto.pauseUntilDto, this.controller.updateSubscription);

        /**
         * @swagger
         * /api/v1/subscription/pauseschedule:
         *   patch:
         *     summary: Update the status of a subscription
         *     tags:
         *       - subscription
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PauseScheduleDto'
         *     responses:
         *       200:
         *         description: Status updated successfully
         *       400:
         *         description: Invalid input
         */
        this.router.patch("/pauseschedule", SubscriptionDto.pauseScheduleDto, this.controller.updateSubscription);

    }

    getRouter() {
        return this.router;
    }
}

export default new SubscriptionRoutes().getRouter();