import express from "express";
import BillingController from "../controllers/billingController.js";
import BillingDto from "../dto/billingDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBillingMetadataDto:
 *       type: object
 *       required:
 *         - billingAddress
 *         - paymentMethod
 *         - tenantId
 *       properties:
 *         billingAddress:
 *           type: string
 *           example: "123 Lagos Street, NG"
 *         paymentMethod:
 *           type: string
 *           example: "credit_card"
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *
 *     CreateTransactionDto:
 *       type: object
 *       required:
 *         - billingMetadataId
 *       properties:
 *         billingMetadataId:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *
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

class BillingRoutes {
    constructor() {
        this.controller = new BillingController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/billing/billingmetadata:
         *   post:
         *     summary: Create billing metadata
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateBillingMetadataDto'
         *     responses:
         *       201:
         *         description: Billing Metadata created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/billingmetadata", BillingDto.createBillingMetadataDto, this.controller.createBillingMetadata);

        /**
        * @swagger
        * /api/v1/billing/getbillingmetadata/{id}:
        *   get:
        *     summary: gets single billing metadata
        *     tags: [billing]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the billing metadata
        *     responses:
        *       200:
        *         description: billing metadata fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/getbillingmetadata/:id", BillingDto.checkIdDto, this.controller.getSingleBillingMetadata);

        /**
         * @swagger
         * /api/v1/billing/allbillingmetadata:
         *   get:
         *     summary: Retrieve all billing metadata
         *     tags: [billing]
         *     responses:
         *       200:
         *         description: all billing metadata retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/allbillingmetadata", this.controller.getAllBillingMetadata);

        /**
         * @swagger
         * /api/v1/billing/transaction:
         *   post:
         *     summary: Create transaction 
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateTransactionDto'
         *     responses:
         *       201:
         *         description: transaction created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/transaction", BillingDto.createTransactionDto, this.controller.createTransaction);

        /**
        * @swagger
        * /api/v1/billing/gettransaction/{id}:
        *   get:
        *     summary: gets single transaction
        *     tags: [billing]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the transaction
        *     responses:
        *       200:
        *         description: transaction fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/gettransaction/:id", BillingDto.checkIdDto, this.controller.getAllTransaction);

        /**
         * @swagger
         * /api/v1/billing/alltransaction:
         *   get:
         *     summary: Retrieve all transactions
         *     tags: [billing]
         *     responses:
         *       200:
         *         description: all transaction retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/alltransaction", this.controller.getAllTransaction);

        /**
         * @swagger
         * /api/v1/billing/subscription:
         *   post:
         *     summary: Create Subscription 
         *     tags: [billing]
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
        this.router.post("/subscription", BillingDto.createSubscriptionDto, this.controller.createSubscription);

        /**
        * @swagger
        * /api/v1/billing/getsubscription/{id}:
        *   get:
        *     summary: gets single Subscription
        *     tags: [billing]
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
        this.router.get("/getsubscription/:id", BillingDto.checkIdDto, this.controller.getAllSubscription);

        /**
         * @swagger
         * /api/v1/billing/allsubscription:
         *   get:
         *     summary: Retrieve all subscription
         *     tags: [billing]
         *     responses:
         *       200:
         *         description: all subscription retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/allsubscription", this.controller.getAllSubscription);

        /**
         * @swagger
         * /api/v1/billing/billingplan:
         *   post:
         *     summary: Create billing plan
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateBillingPlanDto'
         *     responses:
         *       201:
         *         description: billing plan created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/billingplan", BillingDto.createBillingPlanDto, this.controller.createBillingPlan);

        /**
        * @swagger
        * /api/v1/billing/getbillingplan/{id}:
        *   get:
        *     summary: gets single billing plan
        *     tags: [billing]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the billing plan
        *     responses:
        *       200:
        *         description: billing plan fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/getbillingplan/:id", BillingDto.checkIdDto, this.controller.getSingleBillingPlan);

        /**
         * @swagger
         * /api/v1/billing/allbillingplan:
         *   get:
         *     summary: Retrieve all billing plan
         *     tags: [billing]
         *     responses:
         *       200:
         *         description: all billing plan retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/allbillingplan", this.controller.getAllBillingPlan);

        /**
         * @swagger
         * /api/v1/billing/feature:
         *   post:
         *     summary: Create Feature
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateFeatureDto'
         *     responses:
         *       201:
         *         description: Feature created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/feature", BillingDto.createFeatureDto, this.controller.createFeature);

        /**
        * @swagger
        * /api/v1/billing/getfeature/{id}:
        *   get:
        *     summary: gets single Feature
        *     tags: [billing]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the Feature
        *     responses:
        *       200:
        *         description: Feature fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/getfeature/:id", BillingDto.checkIdDto, this.controller.getSingleFeature);

        /**
         * @swagger
         * /api/v1/billing/allfeature:
         *   get:
         *     summary: Retrieve all feature
         *     tags: [billing]
         *     responses:
         *       200:
         *         description: all feature retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/allfeature", this.controller.getAllFeature);

    }

    getRouter() {
        return this.router;
    }
}

export default new BillingRoutes().getRouter();