import express from "express";
import InvoiceController from "../controller/invoiceController.js";
import InvoiceDto from "../dto/invoiceDto.js";

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
        this.router.post("/", InvoiceDto.createInvoiceDto, this.controller.createInvoice);

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
        this.router.get("/:id", InvoiceDto.checkIdDto, this.controller.getSingleInvoice);

        /**
         * @swagger
         * /api/v1/invoice:
         *   get:
         *     summary: Retrieve all invoices
         *     tags: [Invoice]
         *     responses:
         *       200:
         *         description: all invoices retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/", this.controller.getAllInvoice);

        /**
         * @swagger
         * /api/v1/invoice/billed/total:
         *   get:
         *     summary: Retrieve total billed
         *     tags: [Invoice]
         *     responses:
         *       200:
         *         description: total billed retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/billed/total", this.controller.getTotalBilled);

        /**
         * @swagger
         * /api/v1/invoice/billed/due:
         *   get:
         *     summary: Retrieve total due invoices
         *     tags: [Invoice]
         *     responses:
         *       200:
         *         description: total billed retrieved successfully
         *       400:
         *         description: Bad request
         */
        this.router.get("/billed/due", this.controller.getTotalDueInvoice);

        /**
        * @swagger
        * /api/v1/invoice/status/{status}:
        *   get:
        *     summary: gets invoices by status
        *     tags: [Invoice]
        *     parameters:
        *       - in: path
        *         name: status
        *         required: true
        *         schema:
        *           type: string
        *         description: The status of the invoices
        *     responses:
        *       200:
        *         description: Invoice fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/status/:status", InvoiceDto.checkStatusDto, this.controller.getAllInvoiceByStatus);

    }

    getRouter() {
        return this.router;
    }
}

export default new InvoiceRoutes().getRouter();