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
 *     CreatePaymentDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - status
 *         - amount
 *         - invoiceId
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *         invoiceId:
 *           type: number
 *           example: 1
 *         status:
 *           type: string
 *           example: "Successful"
 *         amount:
 *           type: number
 *           example: 1000
 *         paymentMethodId:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *     CreatePaymentMethodDto:
 *       type: object
 *       required:
 *         - cardType
 *         - gatewayToken
 *         - lastFourDigits
 *         - tenantId
 *       properties:
 *         cardType:
 *           type: string
 *           example: "Visa"
 *           description: Type of the card.
 *         gatewayToken:
 *           type: string
 *           example: "tok_1Hh1YZKZ5lYnGNL9dhHbL6q2"
 *           description: Token provided by the payment gateway.
 *         lastFourDigits:
 *           type: string
 *           example: "1234"
 *           description: Last 4 digits of the card.
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "c0a8017e-7b68-11e9-8f9e-2a86e4085a59"
 *           description: UUID of the tenant.
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
         * /api/v1/billing/payment:
         *   post:
         *     summary: Create payment
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreatePaymentDto'
         *     responses:
         *       201:
         *         description: payment created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/payment", BillingDto.createPaymentDto, this.controller.createPayment);

        /**
        * @swagger
        * /api/v1/billing/payment/{id}:
        *   get:
        *     summary: gets single payment
        *     tags: [billing]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: number
        *         description: The ID of the payment
        *     responses:
        *       200:
        *         description: Payment fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/payment/:id", BillingDto.checkIntIdDto, this.controller.getSinglePayment);

        /**
         * @swagger
         * /api/v1/billing/allpayment:
         *   get:
         *     summary: Retrieve all payment
         *     tags: [billing]
         *     responses:
         *       200:
         *         description: all payment retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/allpayment", this.controller.getAllPayment);

        /**
        * @swagger
        * /api/v1/billing/payment/status/{status}:
        *   get:
        *     summary: gets payments by status
        *     tags: [billing]
        *     parameters:
        *       - in: path
        *         name: status
        *         required: true
        *         schema:
        *           type: string
        *         description: The status of the payments
        *     responses:
        *       200:
        *         description: Payment fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/payment/status/:status", BillingDto.checkStatusDto, this.controller.getPaymentByStatus);

        /**
         * @swagger
         * /api/v1/billing/paymentmethod:
         *   post:
         *     summary: Create a new payment method
         *     tags:
         *       - billing
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreatePaymentMethodDto'
         *     responses:
         *       201:
         *         description: Payment method created successfully
         *       400:
         *         description: Validation error
         *       500:
         *         description: Server error
         */
        this.router.post("/paymentmethod", BillingDto.createPaymentMethodDto, this.controller.createPaymentMethod);

        /**
         * @swagger
         * /api/v1/billing/countpayment:
         *   get:
         *     summary: count all payment
         *     tags: [billing]
         *     responses:
         *       200:
         *         description: all payment counted successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/countpayment", this.controller.getTotalPaymentByStatus);

    }

    getRouter() {
        return this.router;
    }
}

export default new BillingRoutes().getRouter();