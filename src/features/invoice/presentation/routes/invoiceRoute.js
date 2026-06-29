import express from "express";
import InvoiceController from "../controller/invoiceController.js";
import InvoiceDto from "../dto/invoiceDto.js";
import { staffProtect, adminProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateInvoiceDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - planId
 *         - status
 *         - dueDate
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *           description: The UUID of the tenant
 *         planId:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *           description: The UUID of the billing plan
 *         status:
 *           type: string
 *           enum: [Paid, Upcoming, Due, Overdue]
 *           example: "Paid"
 *           description: The status of the invoice
 *         billingFrequency:
 *           type: string
 *           enum: [Monthly, Yearly]
 *           example: "Monthly"
 *           description: The billing frequency of the invoice
 *         quantity:
 *           type: number
 *           example: 1
 *           description: The quantity of the plan
 * 
 *     GeneratePaymentLinkDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - planId
 *         - dueDate
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *           description: The UUID of the tenant
 *         planId:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *           description: The UUID of the billing plan
 *         billingFrequency:
 *           type: string
 *           enum: [Monthly, Yearly]
 *           example: "Monthly"
 *           description: The billing frequency of the invoice
 *         quantity:
 *           type: number
 *           example: 1
 *           description: The quantity of the plan
 * 
 *     CreateInvoiceManagementDto:
 *       type: object
 *       required:
 *         - onPlanPurchase
 *         - isDaysBeforeDueDate
 *         - daysBeforeDueDate
 *         - upcomingInvoiceHeader
 *         - upcomingInvoiceBody
 *         - onDueDate
 *         - dueInvoiceHeader
 *         - dueInvoiceBody
 *         - markOverDue
 *         - unpaidReminderTimesBefore
 *         - attachInvoiceToReminder
 *         - reminderEmail
 *       properties:
 *         onPlanPurchase:
 *           type: boolean
 *           example: true
 *         isDaysBeforeDueDate:
 *           type: boolean
 *           example: true
 *         daysBeforeDueDate:
 *           type: integer
 *           example: 5
 *         upcomingInvoiceHeader:
 *           type: string
 *           example: "Upcoming Invoice Notice"
 *         upcomingInvoiceBody:
 *           type: string
 *           example: "This is a reminder that your invoice is due soon."
 *         onDueDate:
 *           type: boolean
 *           example: true
 *         dueInvoiceHeader:
 *           type: string
 *           example: "Invoice Due Today"
 *         dueInvoiceBody:
 *           type: string
 *           example: "Please make payment to avoid service disruption."
 *         markOverDue:
 *           type: integer
 *           example: 3
 *         unpaidReminderTimesBefore:
 *           type: integer
 *           example: 2
 *         attachInvoiceToReminder:
 *           type: boolean
 *           example: true
 *         reminderEmail:
 *           type: array
 *           description: Array of reminder email configurations
 *           items:
 *             type: object
 *             properties:
 *               header:
 *                 type: string
 *                 example: "Reminder Email Header"
 *               body:
 *                 type: string
 *                 example: "This is your reminder email content."
 *               sendOn:
 *                 type: number
 *                 example: 3
 
 *     UpdateOnPlanPurchaseDto:
 *       type: object
 *       required:
 *         - id
 *         - onPlanPurchase
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         onPlanPurchase:
 *           type: boolean
 *           example: true

 *     UpdateDaysBeforeDueDateDto:
 *       type: object
 *       required:
 *         - id
 *         - daysBeforeDueDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         daysBeforeDueDate:
 *           type: integer
 *           example: 5

 *     UpdateIsDaysBeforeDueDateDto:
 *       type: object
 *       required:
 *         - id
 *         - isDaysBeforeDueDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         isDaysBeforeDueDate:
 *           type: boolean
 *           example: true

 *     UpdateUpcomingInvoiceDto:
 *       type: object
 *       required:
 *         - id
 *         - upcomingInvoiceHeader
 *         - upcomingInvoiceBody
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         upcomingInvoiceHeader:
 *           type: string
 *           example: "Upcoming Invoice Notice"
 *         upcomingInvoiceBody:
 *           type: string
 *           example: "Your invoice is due soon. Please review and make payment."

 *     UpdateOnDueDateDto:
 *       type: object
 *       required:
 *         - id
 *         - onDueDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440004"
 *         onDueDate:
 *           type: boolean
 *           example: true

 *     UpdateDueInvoiceDto:
 *       type: object
 *       required:
 *         - id
 *         - dueInvoiceHeader
 *         - dueInvoiceBody
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440005"
 *         dueInvoiceHeader:
 *           type: string
 *           example: "Invoice Due Today"
 *         dueInvoiceBody:
 *           type: string
 *           example: "Please make payment to avoid service disruption."

 *     UpdateMarkOverDueDto:
 *       type: object
 *       required:
 *         - id
 *         - markOverDue
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440007"
 *         markOverDue:
 *           type: integer
 *           example: 3

 *     UpdateUnpaidReminderTimesBeforeDto:
 *       type: object
 *       required:
 *         - id
 *         - unpaidReminderTimesBefore
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440008"
 *         unpaidReminderTimesBefore:
 *           type: integer
 *           example: 2

 *     UpdateAttachInvoiceToReminderDto:
 *       type: object
 *       required:
 *         - id
 *         - attachInvoiceToReminder
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440009"
 *         attachInvoiceToReminder:
 *           type: boolean
 *           example: true

 *     UpdateReminderEmailDto:
 *       type: object
 *       required:
 *         - id
 *         - reminderEmail
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440010"
 *         reminderEmail:
 *           type: array
 *           description: Array of reminder email configurations
 *           items:
 *             type: object
 *             required:
 *               - header
 *               - body
 *               - sendOn
 *             properties:
 *               header:
 *                 type: string
 *                 example: "Reminder Email Header"
 *               body:
 *                 type: string
 *                 example: "This is your reminder email content."
 *               sendOn:
 *                 type: number
 *                 example: 3
 */

class InvoiceRoutes {
    constructor() {
        this.controller = new InvoiceController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {

        /**
         * @swagger
         * /api/v1/invoice/:
         *   post:
         *     summary: Create invoice
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateInvoiceDto'
         *     responses:
         *       201:
         *         description: Invoice created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", staffProtect(), InvoiceDto.createInvoiceDto, this.controller.createInvoice);

        /**
         * @swagger
         * /api/v1/invoice/:
         *   get:
         *     summary: Retrieve all invoices
         *     tags: [Invoice]
         *     parameters:
         *       - in: query
         *         name: page
         *         required: false
         *         schema:
         *           type: integer
         *           default: 1
         *         description: Page number for pagination
         *       - in: query
         *         name: pageSize
         *         required: false
         *         schema:
         *           type: integer
         *           default: 10
         *         description: Number of invoices per page
         *     responses:
         *       200:
         *         description: invoices retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/", staffProtect(), this.controller.getAllInvoices);

        /**
         * @swagger
         * /api/v1/invoice/control:
         *   get:
         *     summary: Retrieve all invoices
         *     tags: [Invoice]
         *     parameters:
         *       - in: query
         *         name: page
         *         required: false
         *         schema:
         *           type: integer
         *           default: 1
         *         description: Page number for pagination
         *       - in: query
         *         name: pageSize
         *         required: false
         *         schema:
         *           type: integer
         *           default: 10
         *         description: Number of invoices per page
         *     responses:
         *       200:
         *         description: invoices retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/control", adminProtect(), this.controller.getAllInvoices);

        /**
         * @swagger
         * /api/v1/invoice/tenants/{tenantId}/invoices:
         *   get:
         *     summary: Retrieve all invoices for a tenant
         *     tags: [Invoice]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The tenant ID
         *       - in: query
         *         name: page
         *         required: false
         *         schema:
         *           type: integer
         *           default: 1
         *         description: Page number for pagination
         *       - in: query
         *         name: pageSize
         *         required: false
         *         schema:
         *           type: integer
         *           default: 10
         *         description: Number of invoices per page
         *     responses:
         *       200:
         *         description: Tenant invoices retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Tenant invoices fetched successfully
         *                 status:
         *                   type: string
         *                   example: ok
         *                 data:
         *                   type: array
         *                   items:
         *                     type: object
         *                 pagination:
         *                   type: object
         *                   properties:
         *                     total:
         *                       type: integer
         *                       example: 50
         *                     page:
         *                       type: integer
         *                       example: 1
         *                     pageSize:
         *                       type: integer
         *                       example: 10
         *                     totalPages:
         *                       type: integer
         *                       example: 5
         *       400:
         *         description: Bad request
         */
        this.router.get(
            "/tenants/:tenantId/invoices",
            adminProtect(),
            this.controller.getTenantInvoices
        );

        /**
         * @swagger
         * /api/v1/invoice/tenants/{tenantId}/invoices/status/{status}:
         *   get:
         *     summary: Retrieve tenant invoices by status
         *     tags: [Invoice]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *         description: The tenant ID
         *       - in: path
         *         name: status
         *         required: true
         *         schema:
         *           type: string
         *         description: Invoice status (e.g., PAID, PENDING, OVERDUE)
         *     responses:
         *       200:
         *         description: Tenant invoices by status retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get(
            "/tenants/:tenantId/invoices/status/:status",
            adminProtect(),
            this.controller.getTenantInvoicesByStatus
        );

        /**
         * @swagger
         * /api/v1/invoice/billed/total/{from}/{to}:
         *   get:
         *     summary: Retrieve total billed
         *     tags: [Invoice]
         *     parameters:
         *       - in: path
         *         name: from
         *         schema:
         *           type: string
         *           format: date
         *         description: Start date (e.g., 2024-01-01)
         *       - in: path
         *         name: to
         *         schema:
         *           type: string
         *           format: date
         *         description: End date (e.g., 2024-01-31)
         *     responses:
         *       200:
         *         description: total billed retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/billed/total/:from/:to", adminProtect(), InvoiceDto.checkDurationDto, this.controller.getTotalBilled);

        /**
         * @swagger
         * /api/v1/invoice/billed/due/{from}/{to}:
         *   get:
         *     summary: Retrieve total due invoices
         *     tags: [Invoice]
         *     parameters:
         *       - in: path
         *         name: from
         *         schema:
         *           type: string
         *           format: date
         *         description: Start date (e.g., 2024-01-01)
         *       - in: path
         *         name: to
         *         schema:
         *           type: string
         *           format: date
         *         description: End date (e.g., 2024-01-31)
         *     responses:
         *       200:
         *         description: total billed retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/billed/due/:from/:to", adminProtect(), InvoiceDto.checkDurationDto, this.controller.getTotalDueInvoice);

        /**
        * @swagger
        * /api/v1/invoice/status/{status}:
        *   get:
        *     summary: gets invoices by status
        *     tags: [Invoice]
        *     parameters:
        *       - in: path
        *         name: status
        *         schema:
        *           type: string
        *         description: The status of the invoices
        *     responses:
        *       200:
        *         description: Invoice fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/status/:status", adminProtect(), InvoiceDto.checkStatusDto, this.controller.getAllInvoiceByStatus);

        /**
         * @swagger
         * /api/v1/invoice/total/status:
         *   get:
         *     summary: Retrieve total by status
         *     tags: [Invoice]
         *     responses:
         *       200:
         *         description: total invoices counted successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/total/status", adminProtect(), this.controller.getTotalByStatus);

        /**
         * @swagger
         * /api/v1/invoice/management:
         *   post:
         *     summary: Create invoice management
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateInvoiceManagementDto'
         *     responses:
         *       201:
         *         description: Invoice management created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/management", staffProtect(), InvoiceDto.createInvoiceManagementDto, this.controller.createInvoiceManagement);

        /**
        * @swagger
        * /api/v1/invoice/invoice/management:
        *   get:
        *     summary: gets invoice management
        *     tags: [Invoice]
        
        *     responses:
        *       200:
        *         description: Invoice management fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/invoice/management", adminProtect(), this.controller.getInvoiceManagement);

        /**
        * @swagger
        * /api/v1/invoice/payment-link:
        *   post:
        *     summary: Generate payment link
        *     tags: [Invoice]
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/GeneratePaymentLinkDto'
        *     responses:
        *       200:
        *         description: Payment link generated successfully
        *       400:
        *         description: Validation error
        */
        this.router.post("/payment-link", adminProtect(), this.controller.generatePaymentLink);

        /**
        * @swagger
        * /api/v1/invoice/validate-payment-token/{token}:
        *  get:
        *   summary: Validate payment token
        *   tags: [Invoice]
        *   parameters:
        *     - name: token
        *       in: path
        *       required: true
        *       schema:
        *         type: string
        *   responses:
        *     200:
        *       description: Payment token validated successfully
        *     400:
        *       description: Validation error
        */
        this.router.get("/validate-payment-token/:token", this.controller.validatePaymentToken);

        /**
         * @swagger
         * /api/v1/invoice/regenerate/{tenantId}:
         *   patch:
         *     summary: Regenerate payment link
         *     tags: [Invoice]
         *     parameters:
         *       - name: tenantId
         *         in: path
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Payment link regenerated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/regenerate/:tenantId", adminProtect(), this.controller.regeneratePaymentLink);

        /**
         * @swagger
         * /api/v1/invoice/history/{tenantId}:
         *   get:
         *     summary: Get invoice payment history
         *     tags: [Invoice]
         *     parameters:
         *       - name: tenantId
         *         in: path
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Invoice payment history fetched successfully 
         *       400:
         *         description: Validation error
         */
        this.router.get("/history/:tenantId", adminProtect(), this.controller.getInvoiceTokenHistory);

        /**
        * @swagger
        * /api/v1/invoice/{id}:
        *   get:
        *     summary: gets single invoice
        *     tags: [Invoice]
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: The ID of the invoice
        *     responses:
        *       200:
        *         description: Invoice fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:id", adminProtect(), InvoiceDto.checkIdDto, this.controller.getSingleInvoice);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/on-plan-purchase:
         *   patch:
         *     summary: Update onPlanPurchase flag
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateOnPlanPurchaseDto'
         *     responses:
         *       200:
         *         description: onPlanPurchase updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/on-plan-purchase", staffProtect(), InvoiceDto.updateOnPlanPurchaseDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/days-before-due-date:
         *   patch:
         *     summary: Update days before due date
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateDaysBeforeDueDateDto'
         *     responses:
         *       200:
         *         description: daysBeforeDueDate updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/days-before-due-date", staffProtect(), InvoiceDto.updateDaysBeforeDueDateDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/days-before-due-date/admin:
         *   patch:
         *     summary: Update days before due date
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateDaysBeforeDueDateDto'
         *     responses:
         *       200:
         *         description: daysBeforeDueDate updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/days-before-due-date/admin", adminProtect(), InvoiceDto.updateDaysBeforeDueDateDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/is-days-before-due-date:
         *   patch:
         *     summary: Enable or disable the days-before-due-date setting
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateIsDaysBeforeDueDateDto'
         *     responses:
         *       200:
         *         description: isDaysBeforeDueDate updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/is-days-before-due-date", adminProtect(), InvoiceDto.updateIsDaysBeforeDueDateDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/is-days-before-due-date/admin:
         *   patch:
         *     summary: Enable or disable the days-before-due-date setting as an admin
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateIsDaysBeforeDueDateDto'
         *     responses:
         *       200:
         *         description: isDaysBeforeDueDate updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/is-days-before-due-date/admin", adminProtect(), InvoiceDto.updateIsDaysBeforeDueDateDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/upcoming-invoice:
         *   patch:
         *     summary: Update upcoming invoice 
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateUpcomingInvoiceDto'
         *     responses:
         *       200:
         *         description: upcomingInvoice updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/upcoming-invoice", staffProtect(), InvoiceDto.updateUpcomingInvoiceDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/upcoming-invoice/admin:
         *   patch:
         *     summary: Update upcoming invoice 
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateUpcomingInvoiceDto'
         *     responses:
         *       200:
         *         description: upcomingInvoice updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/upcoming-invoice/admin", adminProtect(), InvoiceDto.updateUpcomingInvoiceDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/on-due-date:
         *   patch:
         *     summary: Update onDueDate flag
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateOnDueDateDto'
         *     responses:
         *       200:
         *         description: onDueDate updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/on-due-date", staffProtect(), InvoiceDto.updateOnDueDateDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/due-invoice:
         *   patch:
         *     summary: Update due invoice 
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateDueInvoiceDto'
         *     responses:
         *       200:
         *         description: dueInvoice updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/due-invoice", adminProtect(), InvoiceDto.updateDueInvoiceDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/mark-over-due:
         *   patch:
         *     summary: Update markOverDue value
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateMarkOverDueDto'
         *     responses:
         *       200:
         *         description: markOverDue updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/mark-over-due", adminProtect(), InvoiceDto.updateMarkOverDueDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/mark-over-due/admin:
         *   patch:
         *     summary: Update markOverDue value
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateMarkOverDueDto'
         *     responses:
         *       200:
         *         description: markOverDue updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/mark-over-due/admin", adminProtect(), InvoiceDto.updateMarkOverDueDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/unpaid-reminder-times-before:
         *   patch:
         *     summary: Update unpaid reminder times before
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateUnpaidReminderTimesBeforeDto'
         *     responses:
         *       200:
         *         description: unpaidReminderTimesBefore updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/unpaid-reminder-times-before", staffProtect(), InvoiceDto.updateUnpaidReminderTimesBeforeDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/attach-invoice-to-reminder:
         *   patch:
         *     summary: Update attach invoice to reminder flag
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateAttachInvoiceToReminderDto'
         *     responses:
         *       200:
         *         description: attachInvoiceToReminder updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/attach-invoice-to-reminder", staffProtect(), InvoiceDto.updateAttachInvoiceToReminderDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/reminder-email:
         *   patch:
         *     summary: Update reminder email configuration
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateReminderEmailDto'
         *     responses:
         *       200:
         *         description: reminderEmail updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/reminder-email", staffProtect(), InvoiceDto.updateReminderEmailDto, this.controller.updateInvoiceManagement);

        /**
         * @swagger
         * /api/v1/invoice/invoice/management/reminder-email/admin:
         *   patch:
         *     summary: Update reminder email configuration
         *     tags: [Invoice]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateReminderEmailDto'
         *     responses:
         *       200:
         *         description: reminderEmail updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/invoice/management/reminder-email/admin", adminProtect(), InvoiceDto.updateReminderEmailDto, this.controller.updateInvoiceManagement);

    }

    getRouter() {
        return this.router;
    }
}

export default new InvoiceRoutes().getRouter();
