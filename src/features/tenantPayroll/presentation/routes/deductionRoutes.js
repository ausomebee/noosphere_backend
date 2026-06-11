import express from "express";
import DeductionController from "../controllers/deductionController.js";
import DeductionDto from "../dto/deductionDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     DeductionCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - name
 *         - type
 *         - rate
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Name of the deduction item
 *           example: "Tax"
 *         type:
 *           type: string
 *           description: Type of the deduction item (e.g., fixed, percentage)
 *           example: "percentage"
 *         rate:
 *           type: object
 *           description: Rate or value of the deduction
 *           example: { amount: 10, currency: "USD" }
 *
 *     DeductionUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique deduction item ID
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Tenant identifier
 *         name:
 *           type: string
 *           description: Updated name of the deduction
 *         type:
 *           type: string
 *           description: Updated type of deduction
 *         rate:
 *           type: object
 *           description: Updated rate
 *         isDeleted:
 *           type: boolean
 *         isActive:
 *           type: boolean
 */

class DeductionRoutes {
    constructor() {
        this.controller = new DeductionController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/deductions/:
         *   post:
         *     summary: Create a deduction item
         *     tags: [deductions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DeductionCreateDto'
         *     responses:
         *       201:
         *         description: Deduction item created successfully
         */
        this.router.post("/", staffProtect(), DeductionDto.createDeductionDto, this.controller.createDeduction);

        /**
         * @swagger
         * /api/v1/deductions/:
         *   put:
         *     summary: Update a deduction item
         *     tags: [deductions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DeductionUpdateDto'
         *     responses:
         *       200:
         *         description: Deduction item updated successfully
         */
        this.router.put("/", staffProtect(), DeductionDto.updateDeductionDto, this.controller.updateDeduction);

        /**
         * @swagger
         * /api/v1/deductions/tenant/{tenantId}:
         *   get:
         *     summary: Get all deduction items for a tenant
         *     tags: [deductions]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of deduction items retrieved successfully
         */
        this.router.get("/tenant/:tenantId", staffProtect(), this.controller.getTenantDeductions);

        /**
         * @swagger
         * /api/v1/deductions/{id}:
         *   get:
         *     summary: Get a single deduction item by ID
         *     tags: [deductions]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Deduction item retrieved successfully
         */
        this.router.get("/:id", staffProtect(), this.controller.getSingleDeduction);

        /**
         * @swagger
         * /api/v1/deductions/{id}/{active}:
         *   patch:
         *     summary: Activate or deactivate a deduction item
         *     tags: [deductions]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *       - in: path
         *         name: active
         *         required: true
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Deduction item status updated successfully
         */
        this.router.patch("/:id/:active", staffProtect(), this.controller.deactivateDeduction);
    }

    getRouter() {
        return this.router;
    }
}

export default new DeductionRoutes().getRouter();
