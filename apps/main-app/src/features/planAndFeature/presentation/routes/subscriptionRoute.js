import express from "express";
import SubscriptionController from "../controllers/subscriptionController.js";
import SubscriptionDto from "../dto/subscriptionDto.js";
import { adminProtect } from "../../../../middleware/auth_handlers.js";

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
 *         planId:
 *           type: string
 *           format: uuid
 *         transactionId:
 *           type: string
 *           format: uuid
 *         paymentId:
 *           type: number
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
 *           example: ACTIVE
 *         id:
 *           type: string
 *           format: uuid

 *     CancelNowDto:
 *       type: object
 *       required:
 *         - status
 *         - id
 *         - adminId
 *         - comment
 *         - reason
 *         - autoRenew
 *       properties:
 *         status:
 *           type: string
 *           enum: [CANCELLED]
 *           default: CANCELLED
 *         id:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         adminId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         autoRenew:
 *           type: boolean
 *           default: false
 *
 *     CancelAtEndDto:
 *       type: object
 *       required:
 *         - id
 *         - adminId
 *         - comment
 *         - reason
 *         - autoRenew
 *       properties:
 *         id:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         adminId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         autoRenew:
 *           type: boolean
 *           default: false
 *
 *     ResumeNowDto:
 *       type: object
 *       required:
 *         - status
 *         - id
 *         - adminId
 *         - comment
 *         - reason
 *         - mailNotification
 *       properties:
 *         status:
 *           type: string
 *           enum: [ACTIVE]
 *           default: ACTIVE
 *         id:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         adminId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         mailNotification:
 *           type: boolean
 *
 *     ResumeLaterDto:
 *       type: object
 *       required:
 *         - id
 *         - adminId
 *         - comment
 *         - reason
 *         - resumeShedule
 *         - mailNotification
 *       properties:
 *         id:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         adminId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         resumeShedule:
 *           type: string
 *           format: date-time
 *         mailNotification:
 *           type: boolean
 *
 *     PauseNowDto:
 *       type: object
 *       required:
 *         - status
 *         - id
 *         - adminId
 *         - comment
 *         - reason
 *         - autoRenew
 *         - mailNotification
 *       properties:
 *         status:
 *           type: string
 *           enum: [PAUSED]
 *           default: PAUSED
 *         id:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         adminId:
 *           type: string
 *           format: uuid
 *         comment:
 *           type: string
 *         reason:
 *           type: string
 *         autoRenew:
 *           type: boolean
 *           default: false
 *         mailNotification:
 *           type: boolean
 *
 *     PauseUntilDto:
 *       type: object
 *       required:
 *         - status
 *         - id
 *         - adminId
 *         - comment
 *         - reason
 *         - resumeShedule
 *         - autoRenew
 *         - mailNotification
 *       properties:
 *         status:
 *           type: string
 *           enum: [PAUSED]
 *           default: PAUSED
 *         id:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         adminId:
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
 *         mailNotification:
 *           type: boolean
 *
 *     PauseScheduleDto:
 *       type: object
 *       required:
 *         - id
 *         - adminId
 *         - comment
 *         - reason
 *         - pauseSchedule
 *         - autoRenew
 *         - mailNotification
 *       properties:
 *         id:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         adminId:
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
 *         mailNotification:
 *           type: boolean
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
        this.router.post("/", adminProtect(), SubscriptionDto.createSubscriptionDto, this.controller.createSubscription);

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
        this.router.get("/:id", adminProtect(), SubscriptionDto.checkIdDto, this.controller.getAllSubscription);

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
        this.router.get("/", adminProtect(), this.controller.getAllSubscription);

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
        this.router.get("/plan/:planId", adminProtect(), SubscriptionDto.checkPlanIdDto, this.controller.getSubscriptionByPlan);

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
        this.router.get("/count/total", adminProtect(), this.controller.getTotalSubscriptionByStatus);

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
        this.router.get("/status/:status", adminProtect(), SubscriptionDto.checkStatusDto, this.controller.getSubscriptionByStatus);

        /**
        * @swagger
        * /api/v1/subscription/tenant/{tenantId}:
        *   get:
        *     summary: gets subscription by tenantId
        *     tags: [subscription]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the tenant
        *     responses:
        *       200:
        *         description: subscription fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/tenant/:tenantId", adminProtect(), this.controller.getTenantSubscriptions);

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
        this.router.patch("/cancelnow", adminProtect(), SubscriptionDto.cancelNowDto, this.controller.updateSubscription);

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
        this.router.patch("/cancelatend", adminProtect(), SubscriptionDto.cancelAtEndDto, this.controller.updateSubscription);

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
        this.router.patch("/resumenow", adminProtect(), SubscriptionDto.resumeNowDto, this.controller.updateSubscription);

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
        this.router.patch("/resumelater", adminProtect(), SubscriptionDto.resumeLaterDto, this.controller.updateSubscription);

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
        this.router.patch("/pausenow", adminProtect(), SubscriptionDto.pauseNowDto, this.controller.updateSubscription);

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
        this.router.patch("/pauseuntil", adminProtect(), SubscriptionDto.pauseUntilDto, this.controller.updateSubscription);

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
        this.router.patch("/pauseschedule", adminProtect(), SubscriptionDto.pauseScheduleDto, this.controller.updateSubscription);

    }

    getRouter() {
        return this.router;
    }
}

export default new SubscriptionRoutes().getRouter();