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
 *     CreatePaymentAccessDto:
 *       type: object
 *       required:
 *         - chargeOnDueDate
 *         - chargeLastUsedFirst
 *         - chargeAlternative
 *         - retryBefore
 *         - retryAfter
 *         - notifyTenant
 *         - notificationEmailHeader
 *         - notificationEmailBody
 *         - cancelAfter
 *         - manualCancel
 *         - suspensionAction
 *         - errorMessage
 *         - emailAfterAttempts
 *         - warningMailHeader
 *         - warningMailBody
 *         - sendOnSubscriptionCancel
 *         - cancelMailHeader
 *         - cancelMailBody
 *       properties:
 *         chargeOnDueDate:
 *           type: boolean
 *           example: true
 *         chargeLastUsedFirst:
 *           type: boolean
 *           example: false
 *         chargeAlternative:
 *           type: boolean
 *           example: true
 *         retryBefore:
 *           type: integer
 *           example: 5
 *         retryAfter:
 *           type: integer
 *           example: 7
 *         notifyTenant:
 *           type: boolean
 *           example: true
 *         notificationEmailHeader:
 *           type: string
 *           example: "Upcoming Payment Notification"
 *         notificationEmailBody:
 *           type: string
 *           example: "Dear customer, your payment is due soon..."
 *         cancelAfter:
 *           type: integer
 *           example: 5
 *         manualCancel:
 *           type: boolean
 *           example: false
 *         suspensionAction:
 *           type: string
 *           example: "SUSPEND_SERVICE"
 *         errorMessage:
 *           type: string
 *           example: "Payment failed due to insufficient funds."
 *         emailAfterAttempts:
 *           type: integer
 *           example: 3
 *         warningMailHeader:
 *           type: string
 *           example: "Warning: Payment Issue Detected"
 *         warningMailBody:
 *           type: string
 *           example: "Your recent payment could not be processed..."
 *         sendOnSubscriptionCancel:
 *           type: boolean
 *           example: true
 *         cancelMailHeader:
 *           type: string
 *           example: "Subscription Cancelled"
 *         cancelMailBody:
 *           type: string
 *           example: "Your subscription has been cancelled due to payment issues."
 *     UpdateChargeOnDueDateDto:
 *       type: object
 *       required:
 *         - id
 *         - chargeOnDueDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "a4b1c3d2-e4f1-5678-9101-123456789abc"
 *         chargeOnDueDate:
 *           type: boolean
 *           example: true

 *     UpdateChargeLastUsedFirstDto:
 *       type: object
 *       required:
 *         - id
 *         - chargeLastUsedFirst
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "bd6d9a21-f3c4-46e2-9c00-0b1c4d23f321"
 *         chargeLastUsedFirst:
 *           type: boolean
 *           example: false

 *     UpdateChargeAlternativeDto:
 *       type: object
 *       required:
 *         - id
 *         - chargeAlternative
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "cafebabe-1234-5678-9999-deadbeef0001"
 *         chargeAlternative:
 *           type: boolean
 *           example: true

 *     UpdateRetryBeforeDto:
 *       type: object
 *       required:
 *         - id
 *         - retryBefore
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "7e9847f6-5e34-4b00-8870-adafbcf67991"
 *         retryBefore:
 *           type: integer
 *           example: 6

 *     UpdateRetryAfterDto:
 *       type: object
 *       required:
 *         - id
 *         - retryAfter
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "197ce012-8df0-4f3e-b989-cc7ecf39cc94"
 *         retryAfter:
 *           type: integer
 *           example: 5

 *     UpdateNotifyTenantDto:
 *       type: object
 *       required:
 *         - id
 *         - notifyTenant
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "499c66a6-9be0-4c68-a58f-f0f9b507e91b"
 *         notifyTenant:
 *           type: boolean
 *           example: true

 *     UpdateNotificationEmailDto:
 *       type: object
 *       required:
 *         - id
 *         - notificationEmailHeader
 *         - notificationEmailBody
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "845f7de3-d6c4-431b-bf5d-b9f29a9e5c10"
 *         notificationEmailHeader:
 *           type: string
 *           example: "Payment Failed Notification"
 *         notificationEmailBody:
 *           type: string
 *           example: "Your payment attempt failed. Please update your billing info."

 *     UpdateCancelAfterDto:
 *       type: object
 *       required:
 *         - id
 *         - cancelAfter
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "3aa09877-3ea6-4f67-8e18-06cf3281adf3"
 *         cancelAfter:
 *           type: integer
 *           example: 5

 *     UpdateManualCancelDto:
 *       type: object
 *       required:
 *         - id
 *         - manualCancel
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "0fd8dfb2-3fbc-403e-9604-f4959b2c4b6c"
 *         manualCancel:
 *           type: boolean
 *           example: false

 *     UpdateSuspensionActionDto:
 *       type: object
 *       required:
 *         - id
 *         - suspensionAction
 *         - errorMessage
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "2ec5dcf6-6e1c-4b4a-b5d5-d18b12410ef3"
 *         suspensionAction:
 *           type: string
 *           example: "Suspend Account"
 *         errorMessage:
 *           type: string
 *           example: "Payment processing error"

 *     UpdateEmailAfterAttemptsDto:
 *       type: object
 *       required:
 *         - id
 *         - emailAfterAttempts
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "b021bcba-c85f-4469-b6a5-885b18d6bc32"
 *         emailAfterAttempts:
 *           type: integer
 *           example: 3

 *     UpdateWarningMailDto:
 *       type: object
 *       required:
 *         - id
 *         - warningMailHeader
 *         - warningMailBody
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "ca4f9c43-d2dc-4633-b3a2-e84f5c8b5735"
 *         warningMailHeader:
 *           type: string
 *           example: "Warning: Payment Issue Detected"
 *         warningMailBody:
 *           type: string
 *           example: "You have one more chance to update your payment method."

 *     UpdateSendOnSubscriptionCancelDto:
 *       type: object
 *       required:
 *         - id
 *         - sendOnSubscriptionCancel
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "a89239c3-009e-4387-bb2a-913c2a1119cd"
 *         sendOnSubscriptionCancel:
 *           type: boolean
 *           example: true

 *     UpdateCancelMailDto:
 *       type: object
 *       required:
 *         - id
 *         - cancelMailHeader
 *         - cancelMailBody
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "51c92c86-06a1-4146-97cc-4ec81bcb5dc7"
 *         cancelMailHeader:
 *           type: string
 *           example: "Subscription Cancelled"
 *         cancelMailBody:
 *           type: string
 *           example: "Your subscription has been cancelled due to non-payment."
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

        /**
         * @swagger
         * /api/v1/billing/paymentaccess:
         *   post:
         *     summary: Create payment access
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreatePaymentAccessDto'
         *     responses:
         *       201:
         *         description: payment access created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/paymentaccess", BillingDto.createPaymentAceesDto, this.controller.createPaymentAccess);

         /**
         * @swagger
         * /api/v1/billing/paymentaccess:
         *   get:
         *     summary: Retrieve payment access
         *     tags: [billing]
         *     responses:
         *       200:
         *         description: all payment retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/paymentaccess", this.controller.getPaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/charge-on-due-date:
         *   patch:
         *     summary: Update charge on due date
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateChargeOnDueDateDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/charge-on-due-date", BillingDto.updateChargeOnDueDateDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/charge-last-used-first:
         *   patch:
         *     summary: Update charge last used first
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateChargeLastUsedFirstDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/charge-last-used-first", BillingDto.updateChargeLastUsedFirstDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/charge-alternative:
         *   patch:
         *     summary: Update charge alternative method
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateChargeAlternativeDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/charge-alternative", BillingDto.updateChargeAlternativeDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/retry-before:
         *   patch:
         *     summary: Update retry before due date
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateRetryBeforeDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/retry-before", BillingDto.updateRetryBeforeDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/retry-after:
         *   patch:
         *     summary: Update retry after due date
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateRetryAfterDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/retry-after", BillingDto.updateRetryAfterDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/notify-tenant:
         *   patch:
         *     summary: Update notify tenant
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateNotifyTenantDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/notify-tenant", BillingDto.updateNotifyTenantDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/notification-email:
         *   patch:
         *     summary: Update notification email 
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateNotificationEmailDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/notification-email", BillingDto.updateNotificationEmailDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/cancel-after:
         *   patch:
         *     summary: Update cancel after attempts
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateCancelAfterDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/cancel-after", BillingDto.updateCancelAfterDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/manual-cancel:
         *   patch:
         *     summary: Update manual cancel option
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateManualCancelDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/manual-cancel", BillingDto.updateManualCancelDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/suspension-action:
         *   patch:
         *     summary: Update suspension action
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateSuspensionActionDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/suspension-action", BillingDto.updateSuspensionActionDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/email-after-attempts:
         *   patch:
         *     summary: Update number of attempts before email
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateEmailAfterAttemptsDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/email-after-attempts", BillingDto.updateEmailAfterAttemptsDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/warning-mail:
         *   patch:
         *     summary: Update warning mail
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateWarningMailDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/warning-mail", BillingDto.updateWarningMailDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/send-on-subscription-cancel:
         *   patch:
         *     summary: Update send on subscription cancel
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateSendOnSubscriptionCancelDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/send-on-subscription-cancel", BillingDto.updateSendOnSubscriptionCancelDto, this.controller.updatePaymentAccess);

        /**
         * @swagger
         * /api/v1/billing/paymentaccess/cancel-mail:
         *   patch:
         *     summary: Update cancel mail 
         *     tags: [billing]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateCancelMailDto'
         *     responses:
         *       200:
         *         description: Updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/paymentaccess/cancel-mail", BillingDto.updateCancelMailDto, this.controller.updatePaymentAccess);

    }

    getRouter() {
        return this.router;
    }
}

export default new BillingRoutes().getRouter();